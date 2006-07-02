/**
 * cello.SQLSchema node base object for various nodes found in 
 * @param {String} 			name	The name of the node
 * @param {Node}	parent	The parent node of this node (or null)
 */ 
Node = function(name, parent) {
	this.init(name,parent);
}
/**
 * Returns a string representation of this node.
 * @returns a string representation of this node
 * @type String
 */
Node.prototype.toString = function() {
	return "[alt.squeal.Node: "+this.name+"]";
}
/**
 * Initializes this node (used by subclasses)
 * @param {String} 			name	The name of the node
 * @param {Node}	parent	The parent node of this node (or null)
 */
Node.prototype.init = function(name, parent) {
	this.name = name;
	this.parent = parent ? parent : null;
	this.fullname = name;
	if (parent && parent.fullname)
		this.fullname = parent.fullname + '.' + name;
}