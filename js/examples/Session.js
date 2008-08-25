displaySource("Session.js",'Example.onion.xml','/alt/dictator/Session.js');

Alt.require("alt.resource.XML");

// disable caching.
response.cache = false;

var onion = new Onion(Resources.load('Example.onion.xml'));



var session = dictator.session;

if (request.getParameter('erase')) {
	session.end();
} else {
	function dump(o) {
		var s = '';
		for (var x in o)
			s += 'o['+x+'] = '+o[x]+'\n';
		return s;
	}
	
	var old = dump(session.data);
	
	if (!session.data) {
		session.data = { 
			hits: 0,
			string: 'Initial string'
		};
	}
	if (!session.data.hits)
		session.data.hits = 0;
	session.data.hits++;
	
	var newString = request.getParameter('string');
	if (newString != null)
		session.data.string = newString;
}	



var site = onion.evaluate(
<example-page>
 <title>Session Example</title>
 <body>
 	<p>{old}</p>
	<p><b>Your session id:</b> {request.session.id}</p>
	<p><b>Your session hits on this page:</b> {session.data ? session.data.hits : 'n/a'}</p>
	<p><b>Your session string (from form below):</b> {session.data ? session.data.string : 'n/a'}</p>
	<form action="." method="post">  
	<p>
	<label for="string">Set string:</label> <input id="string" name="string" value={session.data ? session.data.string : 'n/a'} size="30" />
	<input name="hidden" type="hidden" value="secret stuff"/>
	</p>
	<p><input type="submit" name="submit" value="Update" /><input type="submit" name="erase" value="Delete Session" /></p>
	</form>
</body>
</example-page>);

response.write(site);
