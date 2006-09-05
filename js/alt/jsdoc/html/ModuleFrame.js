Alt.require('alt.resource.XML');

var xml = Resources.load("module-frame.xml");

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

xml..p.(@id=="module")[0] += <a href="module-summary.html" 
                                target="classFrame">{currentModule}</a>;
var classlist = xml..ul.(@id=="classes");
for each (var n in sorted) {
    var path = n.name+'.html';
    classlist.appendChild(<li><a href={path} target="classFrame">{n.name}</a></li>);
}

response.write(xml);
 