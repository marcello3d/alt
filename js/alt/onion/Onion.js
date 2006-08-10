
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

Onion.TAG_NAMESPACE = new Namespace("http://alt.cellosoft.com/xml/onion/tag");
Onion.O_NAMESPACE = new Namespace("http://alt.cellosoft.com/xml/onion/core");

/**
 * Adds an XML object to this Onion ML object.
 * @param {XML} xml  the xml object
 */
Onion.prototype.add = function(xml) {
	for each (var o in xml.*) {
		if (o.namespace() == Onion.TAG_NAMESPACE)
			this.defineTag(o.localName().toString(),o);
	}
}
Onion.prototype.getTag = function (tagName) {
    if (!this.tags[tagName])
        throw new Exception("Tag not defined: "+tagName);
    return this.tags[tagName];
}
Onion.prototype.getXML = function (tagName, contents) {
    this.getTag(tagName).handle(this, contents);
}
Onion.prototype.handle = function (tag, contents) {
    Alt.log("handle("+tag+","+contents+")");
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
