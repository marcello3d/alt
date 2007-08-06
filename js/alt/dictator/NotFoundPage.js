Alt.require('alt.resource.XML');


var xml = Resources.load("/alt/dictator/IndexPage.xml");

var title = "Not Found "+dictator.path.uri;
xml..head.title = <title>{title}</title>;
xml..body.h2 = title;

response.status = HTTP.NOT_FOUND;
response.cache.seconds = 3600;
response.write(xml.toXMLString());
