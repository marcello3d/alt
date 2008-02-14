
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
	for each (var source in sources)
		page.content.source += <source> 
							<filename>{source.filename}</filename>
							<code>{source.code}</code>
						</source>;
	Alt.log(page.toXMLString());
	return onion.evaluate(page);
}
