
Rhino.require("alt.squeal.Node",true);

/**
 * Constructor for Type object.
 * @param {String} name the name of the type
 * @param {Node} parent the parent node
 */
function Type(name, parent) {
	this.init(name,parent);
}
Type.prototype = new Node();
Type.prototype.toString = function() {
	return "[alt.squeal.Type: "+this.base+"]";
}