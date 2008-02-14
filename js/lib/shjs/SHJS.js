Alt.require('alt.resource.String');

var file = dictator.path.pop();

function outputFile(filename, mimetype) {
	var s = Resources.get(filename, alt.resource.StringResource);
	response.contentType = mimetype;
	response.write(s);
}

response.cache = 18000;

switch (file) {
	case 'sh_style.css':
		outputFile('sh_style.css', 'text/css');
		break;
	case 'sh_main.min.js':
	case 'sh_xml.min.js':
	case 'sh_javascript.min.js':
		outputFile(file, 'text/javascript');
		break;
}