Alt.require('alt.resource.XML');

var xml = Resources.load("allclasses-frame.xml");

var sorted = [];
for each (var nodes in inspector.modules)
    for each (var n in nodes)
        if (n instanceof alt.jsdoc.InspectorClass)
            sorted.push(n);
function compare(a,b) {
    if (a<b) return -1;
    if (a>b) return 1;
    return 0;
}
sorted.sort(function(a,b) {
    return compare(a.name,b.name) || compare(a.getModule(), b.getModule());
});
    
var classlist = xml..ul.(@id=="classes");
for each (var n in sorted) {
    var path = n.getModule()+'/'+n.name+'.html';
    classlist.appendChild(<li><a href={path} target="classFrame">{n.name}</a> 
            <small>{n.getModule()}</small></li>);
}

response.write(xml);
 