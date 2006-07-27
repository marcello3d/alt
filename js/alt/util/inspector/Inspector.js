
Rhino.require('alt.util.inspector.JSDoc');

var JSInspector = Packages.cello.alt.util.Inspector;
var Decompiler = Packages.org.mozilla.javascript.Decompiler;


/**
 * Constructs a new Inspector object for a given base object
 * @class
 * This class provides a means for analyzing JavaScript data structure
 * @param {Object} object   Object to inspect
 */
function Inspector(object) {
	this.nodeMap = new java.util.HashMap();
	this.main = new InspectorObject(this, object);
}
/**
 * Inspects the children of this object
 */
Inspector.prototype.inspectChildren = function() {
	this.main.inspectChildren();
}
/**
 * Gets a mapping of full names to InspectorNodes
 * @return {Object}  map of InspectorNode objects
 */
Inspector.prototype.getFlatMap = function() {
	return this.main.getFlatMap();
}
/**
 * Returns a string representation of this object
 * @return {String} representation of this object
 */
Inspector.prototype.toString = function() {
	return "[Inspector]";
}

/**
 * Constructs base inspector node
 * @class
 * This is the base class for inspector nodes used to signify classes, 
 * functions, objects, and properties.
 * @param {Inspector} inspector
 * @param {Object} object
 */
function InspectorNode(inspector, object) {
	this.inspector = inspector;
	this.object = object;
	this.parents = [];
}
/**
 * Adds a parent to this node.
 * 
 * @param {InspectorNode}	parent	parent node
 * @param {String}			name	the name of this node under the parent
 */
InspectorNode.prototype.addParent = function(parent, name) {
	this.parents.push({parent: parent, name: name});
}
/**
 * Returns a string representation of this object
 * @return {String} representation of this object
 */
InspectorNode.prototype.toString = function() {
	return "["+this.constructor.name+" "+this.getName()+"]";
}


InspectorNode.prototype.getType = function(type) {
	for each (var o in this.parents) {
		var node = o.parent.getType(type);
		if (node) return node;
	}
	var map = this.inspector.getFlatMap();
	if (map[type]) return map[type];
	return null;
}


InspectorNode.prototype.getName = function() {
	if (!this.parents)
		return '';
	if (this.parents.length==0) return "Anonymous";
	if (this.parents.length==1) return this.parents[0].name;
	var list = '';
	for each (var o in this.parents) {
		if (list)
			list+='|';
		list+=o.name;
	}
	return '['+list+']';
}
InspectorNode.prototype.getFullName = function() {
	if (this.parents.length==0) 
		return false;
	if (this.parents.length==1) {
		var parentName = this.parents[0].parent.getFullName();
		if (parentName)
			return parentName + '.' + this.getName();
		return this.getName();
	}
	var list = '';
	for each (var o in this.parents) {
		if (list)
			list+='|';
		list+=o.parent.getFullName();
	}
	return '['+list+'].'+this.getName();
}
/**
 * Constructs a new inspector object.
 * @class
 * This class maps to a JavaScript object
 * @param {Inspector}	inspector
 * @param {Object}		object
 */
function InspectorObject(inspector, object) {
	InspectorNode.call(this, inspector,object);
	this.children = null;
	this.inspectChildren();
}
InspectorObject.prototype = new InspectorNode;

InspectorObject.prototype.getType = function(type) {
	var childType = this.getChildType(type);
	if (childType) return childType;
	return InspectorNode.prototype.getType.call(this,type);
}
/**
 * Returns the child of this node a given type
 */
InspectorObject.prototype.getChildType = function(type) {
	return this.children[type];
}
/**
 * Inspects the children of this node
 */
InspectorObject.prototype.inspectChildren = function(levels, flush) {
	if (flush || this.children==null)
		this.children = {};
		
	// get JSInspector's properties
	var props = JSInspector.getProperties(this.object);
	var allprops = JSInspector.getAllProperties(this.object);
	
	var names = {};
	for each (var x in props) {
		names[x] = true;
		this.addChild(x, this.object[x]);
	}
		
	for each (var x in allprops)
		if (names[x] == null)
			this.addChild(x, this.object[x], true);	
}

/**
 * Creates and adds a child to this node (potentially using a cached node),
 *  and adds a parent link to the child node.
 * 
 * @param {String} 			name	name of this node relative to the parent
 * @param {Object}  		object	the child object
 * @return {InspectorNode}  the constructed/cached node object
 */
InspectorObject.prototype.addChild = function(name, object, hidden) {
	var constructor;
	var node = this.inspector.nodeMap.get(object);
	if (node != null) {
		var reference = isReference(name, object);
		if (reference != node instanceof InspectorReference)
			node = null;
	}
	
	if (node==null){
		if (hidden && this != this.inspector.main) {
			return;
		} else if (isReference(name, object)) {
			constructor = InspectorReference;
		} else if (isClass(name, object)) {
			constructor = InspectorClass;
		} else if (hidden) {
			return null;
		} else if (object instanceof Function) {
			constructor = InspectorFunction;
		} else if (isObject(object)) {
			constructor = InspectorObject;
		} else {
			constructor = InspectorProperty;
		}
		node = new constructor(this.inspector, object);
		this.inspector.nodeMap.put(object, node);
	}
	if (!hidden || constructor)
		this.children[name] = node;
	if (!hidden && node.addParent)
		node.addParent(this, name);
	return node;
	
	/**
	 * Something is only an object if it's not null, instance of Object, and
	 *  has some properties.
	 * @param {Object}   o		the object
	 * @return {boolean} true if o is an "object"
	 */
	function isObject(o) {
		if (o!=null && o instanceof Object)
			for (var x in o)
				return true;
		return false;
	}
	/**
	 * Checks if a particular object is considered a class.
	 * @param {String} name  the name of the object
	 * @param {Object} o     the the object
	 * @return {boolean}  true if o is a "class"
	 */
	function isClass(name,o) {
		if (o == null) 
			return false;
		if (o instanceof Function)
			for (var x in o.prototype)
				return true;
		return o instanceof Object && name.match(/^[A-Z]/);
	}
	function isReference(name,o) {
		return isClass(name,o) && 
					object instanceof Function && object.name != name;
	}
}

/**
 * Gets a mapping of full names to InspectorNodes
 * @return {Object}  map of InspectorNode objects
 */
InspectorObject.prototype.getFlatMap = function() {
	var map = {};
	for (var x in this.children) {
		var child = this.children[x];
		if (child.getFlatMap) {
			var childmap = child.getFlatMap();
			if (childmap)
				for (var x2 in childmap)
					map[x+'.'+x2] = childmap[x2];
			else
				map[x] = child;
		} else 
			map[x] = child;
	}
	return map;
}

/**
 * Constructs a new InspectorFunction object from a given function.
 * @param {Inspector}   inspector
 * @param {Function}	func
 */
function InspectorFunction(inspector, func) {
	InspectorObject.call(this,inspector,func);
	this.func = func;
	this.doc = new JSDoc(func);
}
InspectorFunction.prototype = new InspectorObject;

/**
 * Constructs a new InspectorClass object from a given function.
 * @param {Inspector}   inspector
 * @param {Function}	func		the class
 */
function InspectorClass(inspector,func) {
	InspectorFunction.call(this,inspector,func);
	
	var thisObj = this;
	
	// Non-static class
	if (func.prototype)
		this.proto = new InspectorObject(inspector, func.prototype);
}
InspectorClass.prototype = new InspectorFunction;
/**
 * Gets the super-class of a particular InspectorClass.  This method does not
 *  work quite correctly at the moment.
 * 
 * @return {InspectorClass}  the super class of this InspectorClass
 */
InspectorClass.prototype.getSuperClass = function() {
	if (this.func.prototype) {
		var c = this.func.prototype.constructor;
		var p = this.func.prototype.__proto__;
		for each (var o in this.inspector.nodeMap.values().toArray()) {
			if (o.prototype==p)
				return o;
		}
		
		if (c==this.func)
			return false;
		var node = this.inspector.nodeMap.get(c);
		if (node!=null)
			return node;
	}
	return false;
}
InspectorClass.prototype.getFlatMap = function() {
	return null;
}

/**
 * Constructs a new InspectorReference object from a given function.
 * @param {Inspector}   inspector
 * @param {Object}		function
 */
function InspectorReference(inspector,object) {
	InspectorNode.call(this,inspector,object);
}
InspectorReference.prototype = new InspectorNode;
InspectorReference.prototype.getReference = function() {
	return this.inspector.nodeMap.get(this.object);
}

/**
 * Constructs a new InspectorClass object from a given object.
 * @param {Inspector}   inspector
 * @param {Object}		object
 */
function InspectorProperty(inspector,object) {
	InspectorNode.call(this,inspector,object);
}
InspectorProperty.prototype = new InspectorNode;

