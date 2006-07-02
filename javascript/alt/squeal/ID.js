
Rhino.require('alt.squeal.Link', true);

/**
 * Constructor for ID object.
 * @param {String} name the name of the id
 * @param {Node} parent the parent node
 */
function ID(name, parent) {
	this.init(name,parent);
}
ID.prototype = new Link();
ID.prototype.toString = function() {
	return "[ID: "+this.name+"]";
}