/**
 * Constructs a new Onion ML object.
 * @class
 * The Onion ML object is the Alt Framework approach to templates.  Unlike other
 * systems, Onion ML enforces XML syntax and encourages content abstraction. 
 * 
 * @param {XML} xml  optional xml object to add
 */
function Onion(xml) {
	this.tags = {};
	
	XML.prettyPrinting = false;
	XML.prettyIndent = false;
	XML.ignoreWhitespace = false;
	
    if (xml instanceof XML)
        this.add(xml);
}

Onion.TAG = new Namespace("tag", "http://alt.cellosoft.com/xml/onion/tag");
Onion.O = new Namespace("o", "http://alt.cellosoft.com/xml/onion/core");

/**
 * Adds an XML object to this Onion ML object.
 * @param {XML} xml  the xml object
 */
Onion.prototype.add = function(xml) {
	var TAG = Onion.TAG;
	if (xml.namespace() == TAG) {
		this.tags[xml.localName()] = Onion.makeTag(xml);
	} else 
		for each (var child in xml.TAG::*)
			this.add(child);	
}

/**
 * Gets the function associated with a give tag
 * @param {String} tag
 */
Onion.prototype.getTagFunction = function(tag) {
	// return tag if it is defined
	if (this.tags[tag])
		return this.tags[tag];
	
	// otherwise return generic function
	return function(onion, xml, data) {
		return onion.evaluateChildren(xml, data);
	}
}

/**
 * Evaluate an XML tree with this Onion object.  Main entry point 
 * for using onion templates.
 * @param {XML} xml
 * @param {Object} data
 */
Onion.prototype.evaluate = function(xml, data) {
	// get the associated tag function and call it
	return (this.getTagFunction(xml.localName()))(this,xml,data);
}

/**
 * Evaluate child nodes in an XML tree with this Onion object.
 * This is used by functional tags.
 * @param {XML} xml
 * @param {Object} data
 */
Onion.prototype.evaluateChildren = function (xml, data) {
	if (xml instanceof XML)
		// recursively call evaluate on child elements. 
		for each (var child in xml.*)
			if (child.nodeKind)
				if (child.nodeKind() == 'element') 
					Onion.replaceWith(child, this.evaluate(child, data));
	return xml;
}

/**
 * E4X does not support "replaceWith" so we wrote our own hackish version. 
 * Replaces an XML node with another
 * @param {Object} oldnode
 * @param {Object} newnode
 * @private
 */
Onion.replaceWith = function(node,newnode) {
	node.parent().replace(node.childIndex(), newnode);
}

/**
 * Generates a function for a tag defined in XML 
 * @param {Object} tagxml
 * @private
 */
Onion.makeTag = function (tagxml) {
	
	/**
	 * XML-defined tags are defined as (args is an array of args used, tagxml 
	 * is the XML of the tag):
	 *
	 * @param {Object} onion
	 * @param {Object} xml
	 * @param {Object} data
	 */
	return function(onion, xml, data) {
		// copy the tag template XML
		var result = tagxml.copy();
		
		// Replace all <tag:*/> with the passed arguments
		var TAG = Onion.TAG;
		for each (var node in result..TAG::*) {
			var arg = node.localName();
			// <tag:all/> returns everything, otherwise look for an attribute 
			// or child node
			var tagValue = arg=="all" 
							? xml.children() 
							: (xml.@[arg].toString() || xml[arg].children());
			Onion.replaceWith(node, tagValue);
		}
		// Evaluate all children then knock off the top-level
		return onion.evaluateChildren(result, data).children();
	}
}
