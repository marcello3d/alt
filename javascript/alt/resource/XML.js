
Rhino.require('alt.resource.Loader', true);
Rhino.require('alt.resource.String');

XML.prettyPrint = true;
XML.prettyIndent = true;
XML.ignoreWhitespace = false;
XML.ignoreComments = false;

function XMLResource(resource) {
	var str = Loader.loadResource(resource, StringResource, true);
	return new XML(str);
}
Loader.defineType(XMLResource, 'xml');
Loader.defineType(XMLResource, 'html');
Loader.defineType(XMLResource, 'htm');
