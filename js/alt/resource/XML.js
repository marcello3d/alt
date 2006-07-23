
Rhino.require('alt.resource.Resource', true);
Rhino.require('alt.resource.String');

/**
 * Constructs a new XMLResource from a given resource object
 */
function XMLResource(resource, resourceName) {
	var str = Loader.get(resourceName, StringResource);
	
	XML.prettyPrinting = false;
	XML.prettyIndent = 0;
	XML.ignoreWhitespace = false;
	XML.ignoreComments = false;
	this.xml = new XML(str);
}
XMLResource.prototype = new Resource;

XMLResource.prototype.get = function() {
	return this.xml;
}

XMLResource.prototype.getCopy = function() {
	return this.xml.copy();
}


Loader.defineType(XMLResource, 'xml');
Loader.defineType(XMLResource, 'xhtml');
