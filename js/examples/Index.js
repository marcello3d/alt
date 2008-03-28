
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
	session: 	'examples.Session',
	Dictator: 	'examples.Dictator',
	Delight: 	'examples.Delight',
	SQueaL: 	'examples.SQueaL',
	OnionML:    'examples.OnionML',
	Form:		'examples.Form',
	HSQL:		'examples.HSQL',
	Timeout:    'examples.Timeout',
	chat:       'examples.chat.Main',
	SVN:        'examples.SVN'
});

if (!dictator.handled) {

	Alt.require('alt.resource.XML');
	
	var xml = Resources.load("/alt/dictator/IndexPage.xml");
	
	var title = "Examples";
	
	xml..head.title = title;
	xml..body.h2 = title;
	
	for (var page in dictator.recordedPaths)
		xml..ul.appendChild(<li><a href={page+'/'}>{page}</a> (<a href={page+'/source'}>source</a>)</li>);
	
	response.writer.print(xml.toXMLString());
	
	dictator.setHandled();
}