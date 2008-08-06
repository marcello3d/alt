Alt.require('alt.resource.XML');
/*
var xml = //Resources.load("/alt/dictator/IndexPage.xml");
<html>
 <head><title>Index listing</title></head>
 <body>
  <h2 id="title">Index listing</h2>
  <ul><li><a href="..">..</a></li></ul>
 </body>
</html>;



var title = "Index for "+dictator.path.current;

xml..head.title = title;
xml..body.h2 = title;

for (var page in dictator.recordedPaths)
	xml..ul.appendChild(<li><a href={page+'/'}>{page}</a></li>);
*/

var onion = new Onion(Resources.load('IndexPage.onion.xml'));

var paths = [];
for (var page in dictator.recordedPaths)
	paths.push(page);


var site = onion.evaluate(
	<listing directory={dictator.path.current} />, 
	// Data
	{ children: paths }
);
// and running in proper xhtml mode is currently a bitch
response.write(site.toString());

//response.writer.print(xml.toXMLString());
