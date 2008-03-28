/*displaySource("Session.js","Session.xml");

Alt.require('alt.resource.XML');

//default xml namespace = 'http://www.w3.org/1999/xhtml';
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
response.start('text/html; charset=utf-8');
response.write(xml);
*/









displaySource("Session.js",'Example.onion.xml','/alt/dictator/Session.js');

Alt.require("alt.resource.XML");

// disable caching.
response.cache = false;

var onion = new Onion(Resources.load('Example.onion.xml'));



var session = dictator.session;
function dump(o) {
	var s = '';
	for (var x in o)
		s += 'o['+x+'] = '+o[x]+'\n';
	return s;
}

var old = dump(session.data);

if (!session.data) {
	session.data.hits = 0;
	session.data.string = 'default string';
}
session.data.hits++;

var newString = request.getParameter('string');
if (newString != null)
	session.data.string = newString;



var site = onion.evaluate(
<example-page>
 <title>Session Example</title>
 <body>
 	<p>{old}</p>
	<p><b>Your session id:</b> {request.session.id}</p>
	<p><b>Your session hits on this page:</b> {session.data.hits}</p>
	<p><b>Your session string (from form below):</b> {session.data.string}</p>
	<form action="." method="post">  
	<p>
	<label for="string">Set string:</label> <input id="string" name="string" value={session.data.string} size="30" />
	<input name="hidden" type="hidden" value="secret stuff"/>
	</p>
	<p><input type="submit" name="submit" value="Update" /></p>
	</form>
</body>
</example-page>);

response.write(site);
