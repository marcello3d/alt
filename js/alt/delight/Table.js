
Alt.require('alt.util.ScriptableWrapper');
Alt.require('alt.delight.Row');
Alt.require('alt.delight.View');
Alt.require('alt.delight.Results');


/**
 * Constructs a new cello.Delight Table object.
 * @class
 * cello.Delight representation for
 * @constructor
 * @param {java.sql.Connection}		conn		A database connection
 * @param {Database}	parent		Database or Table
 * @param {String}					name 		Table name
 * @param {cello.SQLSchema.Table}	table 		a cello.SQLSchema table
 */
function Table(conn, parent, name, table) {
	this.conn = conn;
	this.name = name;
	this.fullname = table.fullname;
	this.schema = table;
	this.parent = parent;
	this.fields = {};
	this.tables = {};
	this.innerTables = {};
	for (var i in table.fields) {
		var field = table.fields[i];
		this.fields[field.name] = field;
	}
	// Link cello.SQLSchema back to the delight table
	// This isn't very elegant, but not sure if there is any good way
	// TODO: Look into alternatives
	//  Possible solution: force delight to be a 1-1 mapping of a sqlschema
	//   This could actually allow for cleanup of redundant datatypes...maybe.
	table.delightTable = this;
	
	// Reference this in sub objects/classes
	var delightTable = this;
	
	for (var name in table.tables) {
		var t = table.tables[name];
		this.tables[name] = t;
		// Construct table prototypes with all the bulk of the information
		// these prototypes will be subclassed by rows of the outer table
		// when the user tries to access the inner table from a row.
		// (This saves overhead of creating an inner table and all its
		// accessor methods for every row.)
		this.innerTables[name] = function(row) {
			this.getParentID = function() { return row.id; }
		}
		this.innerTables[name].prototype = new Table(conn, this, name, t);
	}
	
	/**
	 * Constructs a new Row object for this table:  new table.Row();
	 * @constructor
	 * An Row that is associated with a particular table.
	 * @extends Row
	 * @param row copy another row's contents (optional) 
	 */
	this.Row = function(row) {
		Row.call(this,delightTable);
		if (row) this.set(row);
		this._sw = new alt.util.ScriptableWrapper(this,"get","set");
		return this._sw;
	}
	// Prototype this row from the generic row
	this.Row.prototype = new Row(delightTable);
	
	/**
	 * @constructor
	 * A View that is associated with a particular table.
	 * @extends View
	 */
	this.View = function() {
		
	}
	this.View.prototype = new View();
	this.View.prototype.toString = function() {
		return "[Table.View: "+table.fullname+"]";
	}
	
	/**	 
	 * Default "all" view for this table.
	 */
	this.all = new this.View();
	/**
	 * Defines the get method for the all view.
	 * @returns Results object for this view.
	 * @see View#get
	 */
	this.all.get = function() {
	
		function listFields(table,tables,fields,on) {
			var tablename = "t"+tables.length;
			if (on) on = " ON ("+tablename+".id="+on+")";
			else on = "";
			
			tables.push((on?"LEFT JOIN ":"")+table.getSQLName()+" AS "+tablename+on);
			//path[table.fullname] = true;
			
			for (var i in table.fields) {
				var field = table.fields[i];
			
				// Dereference links and recurse
				if (field instanceof cello.SQLSchema.ID) {
					fields.push(tablename+".`"+field.name+"`");
				} else if (field instanceof cello.SQLSchema.Link) {
					var child = field.getTable();
					if (field.required) {
					
						//var newpath = new Object();
						//for (var x in path)
						//	newpath[x] = true;
						listFields(child,tables,fields,tablename+".`"+field.name+"`");
					} else {
						fields.push(tablename+".`"+field.name+"`");
					}
				} else {
					fields.push(tablename+".`"+field.name+"`");
				}
			}
		}
		// Get a list of tables
		var tables = new Array();
		var fields = new Array();
		listFields(delightTable.schema,tables,fields);
		
		var where = "";
		if (delightTable.getParentID)
			where = " WHERE `parent.id`="+delightTable.getParentID();
		
		var result = cello.SQLSchema.sql.query(conn,
			"SELECT "+fields.join(",")+
			" FROM "+tables.join(" ")+
			where
		);
		return {
			next: function() {
				if (!result.next()) 
					return null;
				var column = 1;
				function nextObject() {
					return result.result.getObject(column++);
				}
				function fillFields(table,row) {
					writeln("fill fields for "+table);
					
					path[table.fullname] = true;
					
					for (var i in table.schema.fields) {
						var field = table.schema.fields[i];
						
						// Dereference links and recurse
						if (field instanceof cello.SQLSchema.ID) {
							row.define('id',true,nextObject());
						} else if (field instanceof cello.SQLSchema.Link) {
							// get next object
							var child = field.getTable().delightTable;

							var linkrow = new child.Row();
							row.define(
								field.name, 
								true, // read only
								linkrow
							);
							// If we're recurring...
							if (field.required) {
								// Fill the fields for this row.
								fillFields(child,linkrow);
							} else {
								// Otherwise save id?
								linkrow.define('id',true,nextObject());
							}
						} else {
							// Regular columns
							row.define(
								field.name, 
								false, // not read only
								nextObject()
							);
						}
					}
					return row;
				}
				var row = new delightTable.Row();
				fillFields(delightTable,row);
				return row;
			},
			list: function() {
				var array = new Array();
				var row;
				while (row = this.next())
					array.push(row);
				return array;
			},
			prototype: Results
		};
	}
	
}



/**
 * Returns a string representation of this object.
 * @returns a string representation of this object
 * @type String
 */
Table.prototype.toString = function() {
	return "[Table: "+this.fullname+"]";
}

/**
 * Adds a row to database throws an exception if the row has already been added.
 * @param {Row}		row		a row object : Table.add(row)
 * @param {Map}				map		an associative array : Table.add(map)
 * @throws AddException if row has already been added.
 */
Table.prototype.add = function(row) {
	if (row instanceof Row) {
		row.add();
	} else {
		row = new this.Row(row);
		row.add();
	}
}
