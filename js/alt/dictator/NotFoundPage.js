Alt.require('alt.resource.XML');

dictator.start("text/html; charset=UTF-8", HTTP.NOT_FOUND);

var xml = Resources.load("/alt/dictator/IndexPage.xml");

var title = "Not Found "+dictator.path.uri;
xml..head.title = title;
xml..body.h2 = title;

response.writer.print(xml.toXMLString());
