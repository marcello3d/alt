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
var props = alt.util.Inspector.getProperties(node);

Rhino.log(props.length);
for (var x in props) {
	xml..body.table +=
	  <tr>
	   <td><a href={x}>{x}</a></td>
	   <td>{node[x]}</td>
	  </tr>;
}

response.writer.print(xml.toXMLString());
