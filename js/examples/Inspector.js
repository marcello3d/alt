Rhino.require('alt.util.inspector.Inspector');
Rhino.require('alt.util.inspector.InspectorHTML');
Rhino.require('alt.resource.XML');

default xml namespace = 'http://www.w3.org/1999/xhtml';
var xml = Loader.load('Inspector.xml');

var div = xml.div.(@id=="content");

var Context = Packages.org.mozilla.javascript.Context;

var c = Context.enter();

c.optimizationLevel = -1;

XML.prettyPrinting = false;
XML.prettyIndent = 1;
XML.ignoreWhitespace = false;
XML.ignoreComments = false;
var inspector = new alt.util.inspector.Inspector(global);
/*
for each (var x in ['XML','String','Array','Function','Date',
		'XMLList','QNode','Namespace',])
	inspector.main.addChild(x, global[x]);
*/
xml..div.(@id=="content").appendChild(inspector.toHTML());

response.status = response.SC_OK;
response.contentType = 'text/xml; charset=utf-8'
response.writer.print(xml.toXMLString());

c.exit();
