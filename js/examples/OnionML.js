Alt.require("alt.resource.XML");

var xml = Resources.load('OnionML.onion.xml');

var onion = new Onion(xml);

var site = onion.evaluate(
<mylayout>
 <title>Hello world!</title>
 <body>This is my <b>world</b>, too.</body>
 <year>2008</year>
</mylayout>
);

response.write(site);
