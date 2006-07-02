
Rhino.require('alt.squeal.Node', true);
Rhino.require('alt.squeal.Database');

/**
 * Constructor for Table object.
 * @param {String} name the name of the table
 * @param {Node} parent the parent node
 */
function Table(name, parent) {
	this.init(name,parent);
}
Table.prototype = new Node();
Table.prototype.toString = function() {
	return "[Table: "+this.name+"]";
}


/**
 * Returns the database associated with a particular table
 * @returns the database associated with this table
 * @type Database
 */
Table.prototype.getDatabase = function() {
	var node = this;
	while (node && !(node instanceof Database))
		node = node.parent;
	return node;
}