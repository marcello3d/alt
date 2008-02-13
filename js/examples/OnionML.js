Alt.require("alt.resource.XML");

var xml = Resources.load('OnionML.onion.xml');


var onion = new Onion(xml);

function getItem(data,path) {
	var path = path.toString().split(/\./);
	while (path.length)
		data = data[path.shift()];
	return data;
}

onion.add({
	get:	function(onion,xml,data) {
				return getItem(data, xml.@data);
			},
	"if":	function(onion,xml,data) {
				if (getItem(data,xml.@data)) {
					delete xml['else'];
					return onion.evaluateChildren(xml).children();
				} else
					return onion.evaluateChildren(xml['else']).children();
			},
	"for":	function(onion,xml,data) {
				var result = <></>;
				for each (var item in getItem(data,xml.@data)) {
					data[xml.@item] = item;
					result += onion.evaluateChildren(xml.copy(),data).children();
				}
				return result;
			}
});

var site = onion.evaluate(
<mylayout>
 <title>Hello world!</title>
 <body>
 	<p>This is my <b>world</b>, too.</p>
	<p>Table of figures:</p>
	<table>
	<tr> 
	 <th>Name</th>
	 <th>Age</th> 
	</tr>
	<for item="person" data="people">
	 <tr>
	  <td><get data="person.name"/></td> 
	  <td><get data="person.age"/></td>
	 </tr>
	</for>
	</table>
</body>
 <year>2008</year>
</mylayout>, 
	{ people: 
			[{name:'Fred',age:23},
			 {name:'Julie',age:31},
			 {name:'Ji',age:20}]
	}
);



response.write(site);
