Rhino.require('alt.resource.XML');


response.contentType = "text/html; charset=UTF-8";
response.status = response.SC_NOT_FOUND;

var xml = alt.resource.Loader.load("/alt/dictator/IndexPage.xml");

var title = "Not Found "+dictator.path.uri;
xml..head.title = title;
xml..body.h2 = title;

response.writer.print(xml.toXMLString());
