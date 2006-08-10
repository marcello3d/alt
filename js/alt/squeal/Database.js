
Alt.require('alt.squeal.Node', true);

/**
 * Constructor for Database object.
 * @param {String} name the name of the database
 * @param {Node} parent the parent node
 */
function Database(name, parent) {
	// super constructor
	Node.call(this,name,parent);
}
Database.prototype = new Node();
Database.prototype.toString = function() {
	return "[Database: "+this.name+"]";
}