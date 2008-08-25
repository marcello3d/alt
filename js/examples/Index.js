
function displaySource() {
	if (dictator.path.next == "source") {
		Alt.require("alt.util.SourceDisplay");
		Alt.require("alt.resource.String");
		
		var sources = [];
		
		
		for (var i = 0; i < arguments.length; i++)
			sources.push({
				filename:	arguments[i],
				code:		Resources.get(arguments[i], alt.resource.StringResource)
			});
		response.write(alt.util.SourceDisplay.render(sources).toXMLString());
		dictator.setHandled();
	}
}

dictator.map({
	java2d: 	'examples.Java2D',
	tests: 		dictator.Redirect('/tests/'),
	inspector: 	'examples.Inspector',
	upload: 	'examples.Upload',
	//dbtest: 	'examples.DBTest',
	session: 	'examples.Session',
	//Dictator: 	'examples.Dictator',
	//Delight: 	'examples.Delight',
	//SQueaL: 	'examples.SQueaL',
	OnionML:    'examples.OnionML',
	Form:		'examples.Form',
	//HSQL:		'examples.HSQL',
	Timeout:    'examples.Timeout',
	chat:       'examples.chat.Main',
	SVN:        'examples.SVN',
	GuestBook:  'examples.guestbook.Index'
});

if (!dictator.handled) {



	Alt.require('alt.resource.XML');
	
	var onion = new Onion(Resources.load('/alt/dictator/IndexPage.onion.xml'));
	
	onion.add(
		<tag:index-list xmlns:tag={Onion.TAG} xmlns:set={Onion.SET}>
		   <for item="child" data="children">
		    <li><a><set:href><get data="child"/>/</set:href><get data="child"/></a> 
				<span style="font-size:80%">(<a><set:href><get data="child"/>/source/</set:href>source</a>)</span></li>
		   </for>
		</tag:index-list>
	);
	
	var paths = [];
	for (var page in dictator.recordedPaths)
		paths.push(page);
	
	
	var site = onion.evaluate(
		<listing directory={dictator.path.current} />, 
		// Data
		{ children: paths }
	);
	response.write(site.toString());
	
	dictator.setHandled();
}