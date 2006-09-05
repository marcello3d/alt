Alt.require('alt.resource.XML');

default xml namespace = 'http://www.w3.org/1999/xhtml';
var xml = Resources.load('Session.xml');

var session = request.session;

if (session) {
    var sessiondata = session.getAttribute('data');
    if (sessiondata == null) {
    	var sessiondata = {
    		hits: 0,
    		string: 'default string!'
    	};
    	session.setAttribute('data', sessiondata);
    }
    
    sessiondata.hits++;
    var newString = request.getParameter('string');
    if (newString != null)
    	sessiondata.string = newString;
}
xml..span.(@id=="sessionid")[0] = session.id;
xml..span.(@id=="sessionhits")[0] = sessiondata.hits;
xml..span.(@id=="string")[0] = sessiondata.string;
xml..input.(@name=="string").@value = sessiondata.string;

//response.allow(HTTP.POST);
response.start('application/xhtml+xml; charset=utf-8');
response.write(xml);
