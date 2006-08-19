Alt.require('alt.resource.XML');


var xml = Resources.load("overview-frame.xml");

var modulelist = xml..ul.(@id=="modules");

var modules = inspector.modules;

var sorted = [];
for (var n in modules) 
    sorted.push(n);
sorted.sort();
    
for each (var n in sorted) {
    var path = n+'/module-frame.html';
    modulelist.appendChild(<li><a href={path} target="moduleFrame">{n}</a></li>);
}

response.contentType = "text/html; charset=UTF-8";
response.status = response.SC_OK;
response.writer.print(xml);
 