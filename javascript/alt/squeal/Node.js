
Rhino.require('alt.squeal.Exception');

/**
 * cello.SQLSchema node base object for various nodes found in 
 * @param {String} 			name	The name of the node
 * @param {Node}	parent	The parent node of this node (or null)
 */ 
function Node(name, parent) {
	this.name = name;
	this.parent = parent ? parent : null;
	this.fullname = name;
	if (parent && parent.fullname)
		this.fullname = parent.fullname + '.' + name;
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
 * Finds a type relative to this Node.
 * This may return a Table if the type is a table type, 
 * it may return a Type if the type is a regular type,
 * or it will throw an exception if the type cannot be found.
 *
 * @param {String} name 	The relative name of the type.
 * @returns		A Type or Table
 * @type Node
 * @throws Exception if the type could not be found
 */
Node.prototype.findType = function(name) {
	if (/^sql:/.test(this.type)) return this.type;
	if (!name) name = this.type;
	var path = name.split('.');
	var from = this;
	
	var s = "";
	// Go "up" until we find a matching key
	while (!((from.types && from.types[path[0]]) ||
			 (from.tables && from.tables[path[0]]) ||
			 (from.databases && from.databases[path[0]]))) {
		if (s) s+=",";
		s+=from.name;
		from = from.parent;
		if (from == null)
			throw new Exception("Cannot find '"+path[0]+"' "+this+" ("+s+")");
	}
	
	// Go "down" following our path
	for (var i in path) {
		var name = path[i];
		if (from.databases && from.databases[name])
			from = from.databases[name];
		else if (from.tables && from.tables[name]) {
			from = from.tables[name];
		} else if (from.types && from.types[name]) {
			return from.types[name];
		} else
			throw new Exception("Cannot find '"+name+"' in "+from);
	}
	if (from instanceof Table)
		return from;
		
	if (from instanceof Database)
		throw new Exception("Cannot use a database name as a type name.");
	
	throw new Exception("Cannot find '"+name+"' in "+from);
}
