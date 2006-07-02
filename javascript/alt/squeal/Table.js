/**
 * Constructor for Table object.
 * @param {String} name the name of the table
 * @param {Node} parent the parent node
 */
Table = function(name, parent) {
	this.init(name,parent);
}
Table.prototype = new Node();
Table.prototype.toString = function() {
	return "[Table: "+this.name+"]";
}