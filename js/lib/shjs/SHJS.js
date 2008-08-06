Alt.require('alt.resource.String');

var file = dictator.path.next;

function outputFile(filename, mimetype) {
	response.cache = 18000;
	var s = Resources.get(filename, alt.resource.StringResource);
	response.contentType = mimetype;
	response.write(s);
}

dictator.map({
	'sh_style.css': function() {
		outputFile('sh_style.css', 'text/css');
	},
	'sh_main.min.js': function() {
		outputFile(file, 'text/javascript');
	},
	'sh_xml.min.js': function() {
		outputFile(file, 'text/javascript');
	},
	'sh_javascript.min.js': function() {
		outputFile(file, 'text/javascript');
	}
})
/*
switch (file) {
	case 'sh_style.css':
		outputFile('sh_style.css', 'text/css');
		break;
	case 'sh_main.min.js':
	case 'sh_xml.min.js':
	case 'sh_javascript.min.js':
		outputFile(file, 'text/javascript');
		break;
}*/