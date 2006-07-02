/**
 * @fileoverview
 * This file specifies some MySQL extensions module to SQL Schema.
 * 
 * These are required by cello.SQLSchema.sync and Delight.
 */

Rhino.require('alt.squeal.SQLSchema', true);
Rhino.require('alt.squeal.Table', true);
Rhino.require('alt.squeal.sql.Exception');
	
/**
 * Returns the fully qualified SQL name for this table
 * @return a SQL format of this class's name
 * @type String
 */
alt.squeal.Table.prototype.getSQLName = function() {
	var sqlname = this.name.replace(reg,'_');
	var node = this.parent;
	var reg = /[^a-z_]/i;
	while (node != null) {
		if (node instanceof alt.squeal.Database)
			sqlname = node.name.replace(reg,'_') + '.' + sqlname;
		else if (node instanceof alt.squeal.Table)
			sqlname = node.name.replace(reg,'_') + '_' + sqlname;
		else
			break;
		node = node.parent;
	}
	return sqlname;
}

/**
 * @class
 * cello.SQLSchema.sql has a series of useful functions used by cello.SQLSchema
 * @constructor
 * @private
 */
/**
 * Escapes a string for use in a SQL query
 * @param {String} string the string
 * @returns the escaped string
 * @type String
 */
function escapeString(string) {
	return string.replace(/('")/,"\\$1");
}

/**
 * Performs a sql query on a particular database
 * @param {java.sql.Connection} conn the connection
 * @param {String} query the query
 * @param {boolean} error_ok returns null on error if this is true
 * @param {function(msg)} log a log function (or null)
 * @returns a result object [[TODO: Expand upon this]]
 * @type Result Object
 * @throws cello.SQLSchema.SQLException if there was an error and error_ok is not true
 */
function query(conn,query, error_ok, log) {
	if (log) log("Executing query [<code>"+query+"</code>]");
	writeln("query:"+query);
	
	try {
		var stmt = conn.createStatement();
		var result = stmt.executeQuery(query);
	
		// Wrapper Object to make up for weird DB support
		return {
			result: result,
			meta: result.metaData,
			hasRows: function() {
				if (this.hasrow) return true;
				this.hasrow = this.result.next();
				return this.hasrow;
			},
			next: function() { 
				if (this.hasrow) {
					var row = this.hasrow;
					delete this.hasrow;
					return row;
				}
				return this.result.next(); 
			},
			fetch: function() {
				var data = new Array();
				for (var i=0; i<this.meta.columnCount; i++)
					data[this.meta.getColumnName(i+1)] = this.result.getObject(i+1);
				return data;
			}
		};
	} catch (ex) {
		if (error_ok) return null;
		throw new Exception(ex.toString(),query);
	}
	return result;
}
/**
 * Performs a sql alter on a particular database
 * @param {java.sql.Connection} conn the connection
 * @param {String} query the query
 * @param {boolean} error_ok returns null on error if this is true
 * @param {function(msg)} log a log function (or null)
 * @returns a result object [[TODO: Expand upon this]]
 * @throws cello.SQLSchema.SQLException if there was an error and error_ok is not true
 */
function alter(conn, query, error_ok, log) {
	if (log) log("Executing command [<code>"+query+"</code>]");
	writeln("alter:"+query);

	try {
		var stmt = conn.createStatement();
		return stmt.executeUpdate(query);
	} catch (ex) {
		if (error_ok) return null;
		throw new Exception(ex.toString(),query);
	}
}
/**
 * Gets the last insert id from the database.
 * TODO: make sure this actually works in a multithreaded environment
 * @param {java.sql.Connection} conn the connection
 * @param {boolean} error_ok returns null on error if this is true
 * @param {function(msg)} log a log function (or null)
 * @returns the last id
 */
function getLastId(conn, error_ok, log) {
	var result = query(conn,"SELECT LAST_INSERT_ID() AS id",error_ok,log);
	result.next();
	var row = result.fetch();
	return row.id;
}
