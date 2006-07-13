
Rhino.require('alt.squeal.Node', true);

/**
 * Constructor for Field object.
 * @param {String} name the name of the field
 * @param {Node} parent the parent node
 */
function Field(name, parent) {
	Node.call(this,name,parent);
}
Field.prototype = new Node();
Field.prototype.toString = function() {
	return "[alt.squeal.Field: "+this.name+", type="+this.type+"]";
}