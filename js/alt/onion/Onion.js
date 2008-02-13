
Alt.require("alt.onion.Exception");

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
	
    if (xml instanceof XML)
        this.add(xml);
}

Onion.TAG = new Namespace("tag", "http://alt.cellosoft.com/xml/onion/tag");
Onion.O = new Namespace("o", "http://alt.cellosoft.com/xml/onion/core");

Onion.prototype.getTagFunction = function(tag) {
	Alt.log("onion.getTagFunction("+tag);
		
	// return tag if it is defined
	if (this.tags[tag])
		return this.tags[tag];
	
	// otherwise return generic function
	return function(onion, xml, data) {
		return onion.evaluateChildren(xml,data);
	}
}

/**
 * Evaluates 
 * @param {Object} xml
 * @param {Object} data
 */
Onion.prototype.evaluateChildren = function (xml, data) {
	//Alt.log("evaluateChildren("+xml);
	if (xml instanceof XML) {
		// recursively call evaluate on child elements. 
		for each (var child in xml.*) {
			if (child.nodeKind) {
				function writeln() {
					
				}
				writeln("{{{{");
				var x = child.toXMLString();
				writeln("}}}}");
				if (child.nodeKind() == 'element')
					Onion.replaceWith(child, this.evaluate(child, data));
			}
		}
	}
	return xml;
}
/**
 * 
 * @param {Object} xml
 * @param {Object} data
 */
Onion.prototype.evaluate = function(xml, data) {
	Alt.log("evaluate("+xml.localName()+")");
	// get the associated tag function and call it
	return (this.getTagFunction(xml.localName()))(this,xml,data);
}

/**
 * XML-defined tags are defined as (args is an array of args used, tagxml is the XML of the tag):
 *
 * @param {Object} onion
 * @param {Object} xml
 * @param {Object} data
 */


/**
 * E4X does not support "replaceWith" so we wrote our own hackish version. 
 * Replaces an XML node with another
 * @param {Object} oldnode
 * @param {Object} newnode
 */

Onion.replaceWith = function(oldnode,newnode) {
	oldnode.parent().*[oldnode.childIndex()] = newnode;
}

Onion.makeTag = function (tagxml) {
	/*
	var args = {};
	var TAG = Onion.TAG;
	for each (var node in tagxml..TAG::*)
		args[node.localName()] = node;*/
	
	return function(onion, xml, data) {
		Packages.java.lang.System.err.println("in "+tagxml.name());
		// copy the tag template XML
		var result = tagxml.copy();
		
		
		var TAG = Onion.TAG;
		for each (var node in tagxml..TAG::*) {
			var arg = node.localName();
			var tagValue = arg=="all" ? 
									xml.* : 
									(xml.attributes(arg) || xml.child(arg));
			Alt.log("arg:"+arg+" -["+xml+"]{"+xml.*+"}- "+tagValue);
			
			Onion.replaceWith(node,tagValue);
		}
		// loop through each arg
		/*
		for (var arg in args) {
			// find arguments from call to this tag function 
			// first check if attribute exists, otherwise use the child tag
			var tagValue =  (arg=="all") ? 
									(xml.*) : 
									(xml.@[arg] || xml[arg]);
			Alt.log("arg:"+arg+" -- "+tagValue);
			
			// replace all instances in template with new value
			for each (var argInOutput in result.descendants(arg))
				Onion.replaceWith(argInOutput,tagValue);
		}*/
		// recursively call evaluate on children. 
		return onion.evaluateChildren(result, data);
	}
}

/**
 * Adds an XML object to this Onion ML object.
 * @param {XML} xml  the xml object
 */
Onion.prototype.add = function(xml) {
	var TAG = Onion.TAG;
	if (xml.namespace() == TAG) {
		//Alt.log("found tag: "+xml.localName());
		this.tags[xml.localName()] = Onion.makeTag(xml);
	} else for each (var child in xml.TAG::*) {
		this.add(child);
	}
}
	/*
Onion.prototype.add = function(xml) {
	for each (var o in xml.*) {
		if (o.namespace() == Onion.TAG_NAMESPACE)
			this.defineTag(o.localName().toString(),o);
	}
}

Onion.prototype.getTag = function (tagName) {
    if (!this.tags[tagName]) {
        default xml namespace = Onion.O_NAMESPACE;
        this.tags[tagName] = new OnionTag(tagName,
                                            <tag-contents />,
                                            null);
        //throw new Exception("Tag not defined: "+tagName);
    }
    return this.tags[tagName];
}


Onion.prototype.getXML = function (tagName, contents) {
    this.getTag(tagName).handle(this, contents);
}
Onion.prototype.handle = function (tag, contents) {
   // Alt.log("handle("+tag+","+contents+")");
    var kind = tag.nodeKind();
    var ns = tag.namespace();
    switch (kind) {
        case 'text':
            return tag.toString();
        case 'element':
            var name = tag.localName().toString();
            switch (ns) {
                case Onion.O_NAMESPACE:
                    if (name=="tag-contents")
                        return tag;
                    break;
                case Onion.TAG_NAMESPACE:
                    throw new Exception("Inner tags not supported yet.");
                default:
                    var onionTag = this.getTag(name);
                    return onionTag.handle(this, tag);
            }
            throw new Exception("Unknown tag: "+tag.name());
    }
}


/**
 * Defines a particular tag in this Onion ML object.
 * @param {String} name the name of the tag
 * @param {XML} xml the xml body of this tag
 */
/*
Onion.prototype.defineTag = function(name, xml) {
	this.tags[name] = new OnionTag(name, xml, this.tags[name]);
}

function OnionTag(name, xml, parent) {
    this.name = name;
    this.xml = xml;
    this.parent = parent;
}
OnionTag.prototype.handle = function (onion, contents) {
    for each (var tag in this.xml.children())
        onion.handle(tag, contents);
}
*/