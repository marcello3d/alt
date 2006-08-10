Alt.require('alt.util.Inspector');
Alt.require('alt.resource.XML');

var xml = Loader.load('manage.xml');

xml..body.h2 += dictator.path.current;

xml..body[0] +=
 <table border="1">
  <tr><th>module</th><th>data</th></tr>
 </table>;

var table = xml..body.table;

var node = global;

response.writer.print(xml.toXMLString());
