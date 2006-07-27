Rhino.require('alt.resource.XML');


response.contentType = "text/html; charset=UTF-8";
response.status = response.SC_OK;

var xml = Loader.load("/alt/dictator/IndexPage.xml");

var title = "Index for "+dictator.path.current;
xml..head.title = title;
xml..body.h2 = title;


for (var page in dictator.recordedPaths)
	xml..ul.appendChild(<li><a href={page+'/'}>{page}</a></li>);

response.writer.print(xml.toXMLString());
