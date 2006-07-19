Rhino.require('alt.util.Inspector');
Rhino.require('alt.resource.XML');

default xml namespace = 'http://www.w3.org/1999/xhtml';
var xml = alt.resource.Loader.load('Inspector.xml');



var ins = new alt.util.Inspector(global);

//Rhino.log('xml='+xml);

xml..div.appendChild(ins.toHTML());

response.status = response.SC_OK;
response.contentType = 'text/xml; charset=utf-8'
response.writer.print(xml);