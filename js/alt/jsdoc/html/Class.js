Alt.require('alt.jsdoc.html.InspectorHTML');
Alt.require('alt.resource.XML');

default xml namespace = 'http://www.w3.org/1999/xhtml';
var xml = Resources.load("class.xml");

var node = inspector.modules[currentModule][currentClass];

xml..div.(@id=="contents")[0] += node.toHTML();

response.write(xml);
 