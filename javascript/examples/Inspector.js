Rhino.require('alt.util.Inspector');
Rhino.require('alt.resource.XML');


//default xml namespace = 'http://www.w3.org/1999/xhtml';
var xml = alt.resource.Loader.load('Inspector.xml');


var div = xml..div.(@id=="content");

var ins = new alt.util.Inspector(global);

Rhino.log('xml='+xml);
Rhino.log('div='+div);

div.appendChild(ins.toHTML());

response.status = response.SC_OK;
response.contentType = 'application/xhtml+xml; charset=utf-8'
response.writer.print(xml.toXMLString());
