/**
 * @fileoverview
 * This file specifies the MySQL synchronization module for SQL Schema.
 * This module updates the MySQL database structure to match the SQL
 * Schema.  
 *
 * This is only necessary for administration purposes, in theory if your
 * database schema doesn't change (or you use a separate system to handle
 * updating the database), you do not need this module.
 */

if (typeof(cello) == "undefined") cello = {};

cello['import SQLSchema.sync.MySQL'] = function() {
	
	cello.load('SQLSchema.sql');
	
/**
 * Synchronizes a cello.SQLSchema structure with an actual database.
 * @param {java.sql.Connection} conn	A database connection
 * @param {function(msg)}		log		A function that takes a string parameter for logging actions (optional)
 * @throws cello.SQLSchema.SQLException  if there was an SQL exception
 */
 
cello.SQLSchema.prototype.synchronize = function(conn,log) {
	var created_database = new Array();
	
	if (!log) log = function(){};
	
	var schema = this;
	
	for (var name in this.databases)
		this.databases[name].synchronize(conn,log);
	for (var name in this.tables)
		this.tables[name].synchronize(conn,log);
	
}

/**
 * @private
 * Synchronizes a cello.SQLSchema.Database
 * @param {java.sql.Connection} conn	A database connection
 * @param {function(msg)}		log		A function that takes a string parameter for logging actions (optional)
 * @throws cello.SQLSchema.SQLException  if there was an SQL exception
 */
cello.SQLSchema.Database.prototype.synchronize = function(conn, log) {
	//alter("CREATE DATABASE "+database, true);

	for (var name in this.tables)
		this.tables[name].synchronize(conn,log);
}


/**
 * Get the SQL type of a cello.SQLSchema.Link
 * @returns the SQL type of this link
 * @type String
 */
cello.SQLSchema.Link.prototype.getSQLType = function() {
	var table = this.getTable();
	var type = table.getSQLType();
	return type;
}
/**
 * Get the SQL type of a cello.SQLSchema.ID
 * @returns the SQL type of this link
 * @type String
 */
cello.SQLSchema.ID.prototype.getSQLType = function() {
	var table = this.getTable();
	var type = table.getSQLType() + " auto_increment";
	return type;
}
/**
 * Get the SQL type of a cello.SQLSchema.Table
 * @returns the SQL type of this table
 * @type String
 */
cello.SQLSchema.Table.prototype.getSQLType = function() {
	return this.type;
}
/**
 * Get the SQL type of a cello.SQLSchema.Type
 * @returns the SQL type of this type
 * @type String
 */
cello.SQLSchema.Type.prototype.getSQLType = function() {
	if (/^sql:/.test(this.base))
		return this.base.substring(4);
	return this.findType(this.base).getSQLType();
}
/**
 * Get the SQL type of a cello.SQLSchema.Field
 * @returns the SQL type of this field
 * @type String
 */
cello.SQLSchema.Field.prototype.getSQLType = function() {
	if (/^sql:/.test(this.type))
		return this.type.substring(4);
	return this.findType(this.type).getSQLType();
}
/**
 * Get the full SQL definition of this cello.SQLSchema.Field
 * @returns the SQL definition of this field
 * @type String
 */
cello.SQLSchema.Field.prototype.getSQLDefinition = function() {
	return this.getSQLType() +
		(this.required ? ' NOT NULL' : ' NULL') + 
		(this.defaultValue ? ' DEFAULT "'+cello.SQLSchema.escapeString(this.defaultValue)+'"' : '');
}

/**
 * @private
 * Synchronizes a cello.SQLSchema.Database
 * @param {java.sql.Connection} conn	A database connection
 * @param {function(msg)}		log		A function that takes a string parameter for logging actions (optional)
 * @throws cello.SQLSchema.SQLException  if there was an SQL exception
 */
cello.SQLSchema.Table.prototype.synchronize = function(conn, log) {
	log("Synchronizing "+this.name+" ("+this.fullname+").");

	var sqlname = this.getSQLName();

	var table_status = query("SHOW FULL COLUMNS FROM "+sqlname, true);

	if (!table_status || !table_status.hasRows()) {
		// Create the table
		log("Creating table "+name+".");
		
		var database = this.getDatabase();
		if (database)
			alter("CREATE DATABASE " + database.name, true);
		
		var q = "CREATE TABLE " + sqlname + "(\n";
		
		// Loop through fields
		for (var i in this.fields) {
			var field = this.fields[i];
			
			// Add commas before entries (except first one)
			if (i > 0) q += ",\n";
			
			// Get definition
			definition = field.getSQLDefinition();
			definition += (field.index=='primary'?' PRIMARY KEY':'')+' COMMENT "'+definition+'"';
			q += "   `" + field.name + '` ' + definition;
			// Add index
			if (field.index && field.index!='primary')
				q += ",\n   " + field.index + "(`" + field.name + "`)";
		}
		
		q += ")";
		
		// Send query to database
		alter(q, true);
	} else {

		var found_columns = new Array();
		
		var result = table_status;
		
		var table = this;
		
		function getField(column) {
			for (var i in table.fields)
				if (table.fields[i].name == column)
					return table.fields[i];
			return null;
		}
			
		// Loop through existing tables
		while (result.next()) {
			var sqlfield = result.fetch();
			var column = sqlfield['Field'];
			
			var field = getField(column);
			
			log("Checking field "+column+" ["+field.getSQLDefinition()+"]");
					
			if (!field) {
				log("Field not found in schema, deleting...");
				alter("ALTER TABLE "+sqlname+" DROP `"+column+"`");
			} else {
				found_columns[column] = true;
				var type = field.getSQLType();
				var definition = field.getSQLDefinition();
				
				
				// Compare definition
				if ( sqlfield['Comment'] != definition ) {
					log("Type not synchronized (was "+sqlfield['Comment']+", should be "+definition+"), altering...");
						
					definition += ' COMMENT "'+definition+'"';
					alter("ALTER TABLE "+sqlname+" MODIFY `"+column+"` "+definition);
				}
			}
		}
		
	
		var result = query("SHOW INDEX FROM "+sqlname);
		var found_indexes = new Array();
		var found_primary = false;
	
		// Loop through existing indices
		while (result.next()) {
			var index = result.fetch();
			var column = index['Column_name'];
			var keyname = index['Key_name'];
			var type = '';
			if (keyname == 'PRIMARY')
				type = 'primary';
			else if (index['Index_type'] == "FULLTEXT")
				type = 'fulltext';
			else 
				type = index['Non_unique'] ? 'index' : 'unique';
				
			var first = !found_indexes[column];
			found_indexes[column] = index['Non_unique'] ? true : 'unique';
	
			log("Checking index "+keyname+" ("+column+")...");
			
			var field = getField(column);
	
			// Check that column defines an index	
			if (!field || !field.index || !first) {
				if (!first)
					log ("Duplicate Index found, deleting...");
				else
					log("Index not found in schema, deleting...");
				alter("DROP INDEX `"+keyname+"` ON "+sqlname);
				continue;
	
			// Check that index type is correct
			} else if (field.index != type) {
				if (type == 'primary') {
					log("Incorrect primary key, fixing...");
					alter("ALTER TABLE "+sqlname+" DROP PRIMARY KEY");
					continue;
				} else if (field.index == 'primary') {
					//if (found_primary) {
						log("Extra index, removing...");
						alter("ALTER TABLE "+sqlname+" DROP INDEX `"+keyname+"`");
					//} else {
					//	echo "incorrect primary key, fixing...";
					//		"ADD PRIMARY KEY (`".$column."`)");
					//}
					continue;
				} else {
					log("Index type has changed (was "+type+", should be "+field.index+")...");
					alter("ALTER TABLE "+sqlname+" DROP INDEX `"+keyname+"`,"+
						  "ADD "+field.index+" (`"+column+"`)");
					continue;
				}
			}
	
			if (type == 'primary')
				found_primary = true;
		}
		
		// Loop through schema looking for new elements
		var placement = "FIRST";
		for (var i in this.fields) {
			var field = this.fields[i];
			
			if (!found_columns[field.name]) {
				log("New field ["+field+"] in schema, adding...");
				
				var definition = field.getSQLDefinition();
				definition += ' COMMENT "'+definition+'"';
				alter("ALTER TABLE "+sqlname+" ADD `"+field.name+"` "+definition+" "+placement);
			}
			if (!found_indexes[column] && field.index) {
				log("New index "+field.index+"["+field.name+"] in schema, adding...");
				alter("ALTER TABLE "+sqlname+" ADD "+(field.index=='primary'?'PRIMARY KEY':field.index)+" (`"+field.name+"`)");
			}
		
			placement = "AFTER `"+field.name+"`";
		}
	}
	
	
	// Synchronize inner tables
	for (var name in this.tables)
		this.tables[name].synchronize(conn,log);
	
	function query(q, error_ok) {
		return cello.SQLSchema.sql.query(conn,q,error_ok,log);
	}
	function alter(q, error_ok) {
		return cello.SQLSchema.sql.alter(conn,q,error_ok,log);
	}
}

};// import
