
/* Needed for parsing xml */
XML.prettyPrinting = false;
XML.prettyIndent = false;
XML.ignoreWhitespace = false;

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
	

	function getItem(originaldata,originalpath) {
		var path = originalpath.toString().split(/\./);
		var data = originaldata;
		while (path.length)
			if (!data)
				throw new alt.Exception("Cannot read "+originalpath+" from "+originaldata.toSource());
			else
				data = data[path.shift()];
		return data;
	}
	
	this.add({
		get:	function(onion,xml,data) {
					return getItem(data, xml.@data);
				},
		"if":	function(onion,xml,data) {
					if (getItem(data,xml.@data)) {
						delete xml['else'];
						return onion.evaluateChildren(xml).children();
					} else
						return onion.evaluateChildren(xml['else']).children();
				},
		"for":	function(onion,xml,data) {
					var result = <></>;
					var items = getItem(data,xml.@data);
					if (items instanceof Array)
						for (var i=0; i<items.length; i++) {
							data[xml.@item] = items[i];
							result += onion.evaluateChildren(xml.copy(),data).children();
						}
					else 
						for each (var item in items) {
							data[xml.@item] = item;
							result += onion.evaluateChildren(xml.copy(),data).children();
						}
					return result;
				}
	});

	
    if (xml instanceof XML)
        this.add(xml);
	
}

Onion.TAG = new Namespace("tag", "http://alt.cellosoft.com/xml/onion/tag");
Onion.ARG = new Namespace("arg", "http://alt.cellosoft.com/xml/onion/arg");
Onion.SET = new Namespace("set", "http://alt.cellosoft.com/xml/onion/set");
Onion.O = new Namespace("o", "http://alt.cellosoft.com/xml/onion/core");

/**
 * Adds an XML object to this Onion ML object.
 * @param {XML} xml  the xml object
 */
Onion.prototype.add = function(o,func) {
	if (o instanceof XML) {
		var TAG = Onion.TAG;
		if (o.namespace() == TAG)
			this.add(o.localName(), Onion.makeTag(o));
		else 
			for each (var child in o.TAG::*)
				this.add(child);
	} else if (func) {
		this.tags[o] = func;
	} else if (o instanceof Object) {
		for (var name in o)
			this.tags[name] = o[name];
	}
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
	var tag = this.getTagFunction(xml.localName());
	if (tag instanceof XML)
		return tag;
	return tag(this,xml,data);
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
				if (child.nodeKind() == 'element') {
					if (child.name().uri == Onion.SET) {
						xml.@[child.localName()] = this.evaluateChildren(child,data).children().toXMLString();
						Onion.replaceWith(child, '');
					} else
						Onion.replaceWith(child, this.evaluate(child, data));
				}
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
		
		// Replace all <arg:*/> with the passed arguments
		var ARG = Onion.ARG;
		for each (var node in result..ARG::*) {
			var arg = node.localName();
			// <arg:all/> returns everything, otherwise look for an attribute 
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
