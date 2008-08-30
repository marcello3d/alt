Alt.require('alt.resource.XML');

var onion = new Onion(Resources.load('IndexPage.onion.xml'));

var paths = [];
for (var page in dictator.recordedPaths)
	paths.push(page);

var site = onion.evaluate(
	<listing directory={dictator.path.current} />, 
	// Data
	{ children: paths }
);
// and running in proper xhtml mode is currently a bitch
response.write(site.toString());
