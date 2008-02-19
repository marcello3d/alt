
Alt.require("alt.onion.Onion");
Alt.require("alt.resource.XML");

var SourceDisplay = {};


SourceDisplay.render = function(sources) {
	var onion = new alt.onion.Onion(alt.resource.Resources.load('/alt/util/SourceDisplay.onion.xml'));

	var files = "";
	for each (var source in sources) {
		if (files) files+=', ';
		files += source.filename;
	}
	var page = 
		<page>
			<title>Displaying source for: {files}</title>
			<content></content>
		</page>;
	var types = { js: "javascript" };
	for each (var source in sources) {
		var type = /[^\.]+$/.exec(source.filename);
		if (types[type]) type = types[type];
		page.content.source += <source> 
							<filename>{source.filename}</filename>
							<code>{source.code}</code>
							<type>{type}</type>
						</source>;
	}
	return onion.evaluate(page);
}
