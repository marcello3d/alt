
Rhino.require("alt.squeal.Node");

/**
 * Constructor for View object.
 * @param {String} name the name of the view
 * @param {Node} parent the parent node
 */
function View(name, parent) {
	this.init(name,parent);
}
View.prototype = new Node();
View.prototype.toString = function() {
	return "[alt.squeal.View: "+this.name+"]";
}