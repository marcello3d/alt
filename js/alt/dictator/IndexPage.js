split('index1');
Alt.require('alt.resource.XML');
split('index2');

var xml = Resources.load("/alt/dictator/IndexPage.xml");
split('index3');

var title = "Index for "+dictator.path.current;

xml..head.title = title;
xml..body.h2 = title;

split('index4');
for (var page in dictator.recordedPaths)
	xml..ul.appendChild(<li><a href={page+'/'}>{page}</a></li>);

response.writer.print(xml.toXMLString());
split('index5');
