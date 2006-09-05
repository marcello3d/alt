Alt.require('alt.resource.XML');

var xml = Resources.load("/alt/dictator/IndexPage.xml");

var title = "Index for "+dictator.path.current;
xml..head.title = title;
xml..body.h2 = title;


for (var page in dictator.recordedPaths)
	xml..ul.appendChild(<li><a href={page+'/'}>{page}</a></li>);

response.writer.print(xml.toXMLString());
