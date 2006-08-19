/**
 * Use an anonymous function to hide all these variables from scopes we are 
 * inspecting.
 */
(function(node) {
    
    
var JSInspector = Packages.cello.alt.util.Inspector;

var top = dictator.path.currenturi;
var path = '';
var pathxml = <><a href={top}>top</a></>;
var uri = top;

while (dictator.path.next) {
    var next = dictator.path.next;
    dictator.path.pop();

    
    uri += next+'/';
    
    if (path)
        path += '.';
    path += next;
    if (dictator.path.next)
        pathxml += <> : <a href={uri}>{next}</a></>;
    else
        pathxml += <> : <b>{next}</b></>;
    if (!node)
        pathxml += <i>[undefined!]</i>;
        
    if (node)
        node = node[next];
}

var xml = Resources.load('inspect.xml');

if (path)
    xml..title[0].appendChild(' : '+path);
xml..*.(@id=="path")[0].appendChild(pathxml);


var value = 'unknown';
try {
    value = <pre>{node}</pre>;
} catch (ex) {
    value = <><b>Exception trying to get value:</b> {ex}</>;
}

xml..*.(@id=="value")[0].appendChild(value);


var props = JSInspector.getProperties(node);
var allprops = JSInspector.getAllProperties(node);

var publicNames = {};
var privateNames = {};
var prototypeNames = {};

for each (var n in allprops)
    privateNames[n] = true;
for each (var n in props)
    if (privateNames[n]) {
        publicNames[n] = true;
        delete privateNames[n];
    }
for (var n in node)
    if (!privateNames[n] && !publicNames[n])
        prototypeNames[n] = true;


buildTable(xml..table.(@id=="public")[0], publicNames);
buildTable(xml..table.(@id=="private")[0], privateNames);
buildTable(xml..table.(@id=="prototype")[0], prototypeNames);

function buildTable(table, names) {
    var sortedNames = [];
    for (var x in names)
        sortedNames.push(x);
    sortedNames.sort();
    for each (var x in sortedNames) {
        var value = 'unknown';
        var type = 'unknown';
        try {
            value = <pre class="value">{node[x]}</pre>;
            type = typeof(node[x]);
        } catch (ex) {
            value = <><b>Exception trying to get value:</b> {ex}</>;
        }
        table.appendChild(
            <tr>
             <td valign="top"><a href={x+"/"}>{x}</a></td>
             <td valign="top">{type}</td>
             <td valign="top">{value}</td>
            </tr>
        );
    }
}

response.contentType = "text/html; charset=UTF-8";
response.status = response.SC_OK;
response.writer.print(xml);

dictator.setHandled();

})({
    'global_scope': global,
    'module_scope': module,
    'request_scope': this 
});