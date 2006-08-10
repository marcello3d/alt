/**
 * Constructs a new cello.Delight database object.
 * @class
 * cello.Delight representation of a database.  Contains a member for each table in this database.
 * @constructor
 * @param {java.sql.Connection} conn		A database connection
 * @param {String} 				name		Database name
 * @param {cello.SQLSchema.Database}	schemadb	a cello.SQLSchema database
 */
function Database(conn, name, schemadb) {
	this.name = name;
	for (var table in schemadb.tables)
		this[table] = new Table(conn, this,table,schemadb.tables[table]);
}
/**
 * Returns a string representation of this object.
 * @returns the string respresentation of this object
 * @type String
 */
Database.prototype.toString = function() {
	return "[alt.delight.Database: "+this.name+"]";
}