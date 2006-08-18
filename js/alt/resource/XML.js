
Alt.require('alt.resource.Resource', true);
Alt.require('alt.resource.String');

/**
 * Constructs a new XMLResource from a given resource object
 */
function XMLResource(resource, resourceName) {
	var str = Resources.get(resourceName, StringResource);
	this.xml = new XML(str);
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
