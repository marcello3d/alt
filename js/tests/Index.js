

Alt.require('tests.Tester');


response.contentType = "text/html; charset=UTF-8";
response.status = response.SC_OK;

var o = response.writer;

o.print('<html><body>');


Alt.require('alt.html.StringUtils');

function writeln(s) {
	response.writer.println(alt.html.StringUtils.escapeHTML(s)+'<br/>');
}
function writeColorln(color) {
	return function(msg) {
		response.writer.println('<span style="color:'+color+'">'+
				alt.html.StringUtils.escapeHTML(msg)+'</span><br/>');
	}
}

// Do tests
tests.Tester.test(this,
	['tests.ScriptableWrapper',
	 'tests.Synchronization',
	 'tests.Modules',
	 'tests.RequestScope',
	 'tests.HashTest',
	 'tests.Iterator',
	 'tests.E4X',
	 'tests.JarJS'],
	writeln, writeColorln('green'), writeColorln('red')
	);

o.print('</body></html>');