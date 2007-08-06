
Alt.require('alt.resource.Resource', true);
Alt.require('alt.resource.Reader');

/**
 * Constructs a new XMLResource from a given resource object
 */
function XMLResource(resource, resourceName) {
	var reader = Resources.load(resourceName, ReaderResource);
	this.xml = new XML(reader); //.replace(/^<\?xml.+?\?>/,'')+'</foo>');
}
XMLResource.prototype = new Resource;

XMLResource.prototype.get = function() {
	return this.xml;
}

XMLResource.prototype.getCopy = function() {
	return this.xml.copy();
}


Resources.defineType(XMLResource, 'xml');
Resources.defineType(XMLResource, 'xhtml');
