Rhino.require('alt.util.Inspector');
Rhino.require('alt.util.InspectorHTML');
Rhino.require('alt.resource.XML');

default xml namespace = 'http://www.w3.org/1999/xhtml';
var xml = alt.resource.Loader.load('Inspector.xml');

XML.prettyPrinting = false;
XML.prettyIndent = 1;
XML.ignoreWhitespace = false;
XML.ignoreComments = false;
var inspector = new alt.util.Inspector(global);
/*
for each (var x in ['XML','String','Array','Function','Date',
		'XMLList','QNode','Namespace',])
	inspector.main.addChild(x, global[x]);
*/
xml..div.(@id=="content").appendChild(inspector.toHTML());

response.status = response.SC_OK;
response.contentType = 'text/xml; charset=utf-8'
response.writer.print(xml.toXMLString());
