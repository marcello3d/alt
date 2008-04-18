Alt.require('alt.resource.XML');

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

response.writer.print(xml.toXMLString());
