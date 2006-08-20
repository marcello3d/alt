Alt.require('alt.resource.XML');

var xml = Resources.load("module-summary.xml");

var sorted = [];
for each (var n in inspector.modules[currentModule])
    if (n instanceof alt.jsdoc.InspectorClass)
        sorted.push(n);
function compare(a,b) {
    if (a<b) return -1;
    if (a>b) return 1;
    return 0;
}
sorted.sort(function(a,b) {
    return compare(a.name,b.name);
});

xml..h1.(@id=="name")[0] += currentModule;


var classlist = xml..table.(@id=="classes");
for each (var n in sorted) {
	var desc = '';
	if (n.doc && n.doc.classDesc)
		desc = n.doc.classDesc;
			
    var path = n.name+'.html';
    classlist.appendChild(
    <tr>
     <td><a href={path}>{n.name}</a></td>
     <td>{desc}</td>
    </tr>);
}

response.contentType = "text/html; charset=UTF-8";
response.status = response.SC_OK;
response.writer.print(xml);
 