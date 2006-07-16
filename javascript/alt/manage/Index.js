Rhino.require('alt.util.Inspector');
Rhino.require('alt.resource.XML');

var xml = alt.resource.Loader.load('design.xml');

xml..body.h2 += dictator.requestPath.currentPath;

xml..body[0] +=
 <table border="1">
  <tr><th>module</th><th>data</th></tr>
 </table>;

var table = xml..body.table;

var node = global;

response.writer.print(xml.toXMLString());
