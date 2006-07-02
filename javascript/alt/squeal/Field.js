Rhino.require("alt.squeal.Node");

/**
 * Constructor for Field object.
 * @param {String} name the name of the field
 * @param {Node} parent the parent node
 */
Field = function(name, parent) {
	this.init(name,parent);
}
Field.prototype = new Node();
Field.prototype.toString = function() {
	return "[alt.squeal.Field: "+this.name+", type="+this.type+"]";
}