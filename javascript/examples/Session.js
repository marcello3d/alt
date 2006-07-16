Rhino.require('alt.resource.XML');

default xml namespace = 'http://www.w3.org/1999/xhtml';
var xml = alt.resource.Loader.get('Session.xml').copy();


var sessiondata = request.session.getAttribute('data');
if (sessiondata == null) {
	var sessiondata = {
		hits: 0,
		string: 'default string!'
	};
	request.session.setAttribute('data', sessiondata);
}

sessiondata.hits++;
var newString = request.getParameter('string');
if (newString != null)
	sessiondata.string = newString;
	
xml..span.(@id=="sessionid").parent().span = request.session.id;
xml..span.(@id=="sessionhits").parent().span = sessiondata.hits;
xml..span.(@id=="string").parent().span = sessiondata.string;
xml..input.(@name=="string").@value = sessiondata.string;

response.status = response.SC_OK;
response.contentType = 'application/xhtml+xml; charset=utf-8'

response.writer.print(xml.toXMLString());
