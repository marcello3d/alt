displaySource("OnionML.js",'OnionML.onion.xml');

Alt.require("alt.resource.XML");

var onion = new Onion(Resources.load('OnionML.onion.xml'));

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
	// Data
	{ people: 
			[{name:'Fred',age:23},
			 {name:'Julie',age:31},
			 {name:'Ji',age:20}]
	}
);



response.write(site);
