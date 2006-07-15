
Rhino.require('alt.resource.Loader', true);
Rhino.require('alt.resource.String');

function XMLResource(resource,resourceName) {
	return new XML(String(resource));//Loader.get(resourceName,String));
}
Loader.defineType(XMLResource, 'xml');
Loader.defineType(XMLResource, 'html');
Loader.defineType(XMLResource, 'htm');
