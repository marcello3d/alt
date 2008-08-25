displaySource("Inspector.js","Inspector.xml");

Alt.require('alt.jsdoc.Inspector');
Alt.require('alt.jsdoc.html.InspectorHTML');
Alt.require('alt.resource.XML');

response.writer.println("this takes a while...");
response.writer.flush();

default xml namespace = 'http://www.w3.org/1999/xhtml';
var xml = Resources.load('Inspector.xml');

var div = xml.div.(@id=="content");

var Context = Packages.org.mozilla.javascript.Context;

XML.prettyPrinting = false;
XML.prettyIndent = 1;
XML.ignoreWhitespace = false;
XML.ignoreComments = false;
var inspector = new alt.jsdoc.Inspector(global);
xml..div.(@id=="content").appendChild(inspector.toHTML());


response.write(xml);
