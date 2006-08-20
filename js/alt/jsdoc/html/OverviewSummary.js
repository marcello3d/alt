Alt.require('alt.resource.XML');


var xml = Resources.load("overview-summary.xml");

var modulelist = xml..table.(@id=="modules");

var modules = inspector.modules;

var sorted = [];
for (var n in modules) 
    sorted.push(n);
sorted.sort();
    
for each (var n in sorted) {
    var path = n+'/module-summary.html';
    modulelist.appendChild(
     <tr>
      <td><a href={path}>{n}</a></td>
      <td width="100%">-</td>
     </tr>);
}

response.contentType = "text/html; charset=UTF-8";
response.status = response.SC_OK;
response.writer.print(xml);
 