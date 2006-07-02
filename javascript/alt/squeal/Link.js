

Rhion.require('alt.squeal.Field', true);

/**
 * Constructor for Link object.
 * @param {String} name the name of the link
 * @param {Node} parent the parent node
 */
Link = function(name, parent) {
	this.init(name,parent);
}
Link.prototype = new Field();
Link.prototype.toString = function() {
	return "[alt.squeal.Link: "+this.name+"]";
}
