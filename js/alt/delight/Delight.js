/**
 * @fileoverview
 * This file specifies holds all the code cello.Delight, the main class
 * {@link alt.delight.Delight} can be constructed using a 
 * {@link alt.squeal.SQLSchema} object.
 */

Alt.require('alt.squeal.SQLSchema');
Alt.require('alt.squeal.sql.SQL');

Alt.require('alt.delight.Exceptions');

Alt.require('alt.delight.Database');
Alt.require('alt.delight.Table');
	
/**
 * Creates a new Delight object from an existing cello.SQLSchema object.
 * @class
 * The main Delight class.  Use a valid {@link alt.squeal.SQLSchema} 
 * object to construct Delight objects, which will then contain a list of 
 * members for all top level databases ({@link Database}) and tables 
 * ({@link Table}) from the SQL Schema.
 * @constructor
 * @param {alt.squeal.SQLSchema} 	schema	The SQLSchema object this api is based on.
 * @param {java.sql.Connection}	    conn	A database connection
 */
function Delight(schema,conn) {
	for (var database in schema.databases)
		this[database] = new Database(conn, database, schema.databases[database]);
	for (var table in schema.tables)
		this[table] = new Table(conn, null, table, schema.tables[table]);
}

/**
 * Returns a string representation of this class
 * @returns a string resprentation of this class
 * @type String
 */
Delight.prototype.toString = function() {
	return "[alt.delight.Delight]";
}
