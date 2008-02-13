Alt.require('tests.Tester');

response.write('<html><body>');

function writeln(s) {
	response.write(<>{s}<br/></>);
}
function writeColorln(color) {
	return function(msg) {
		response.write(<><span style={'color:'+color}>{msg}</span><br/></>);
	}
}

// Do tests
tests.Tester.test(this,
	['tests.ScriptableWrapper',
	 'tests.ScriptableBean',
	 'tests.Synchronization',
	 'tests.Enclosure',
	 'tests.Modules',
	 'tests.RequestScope',
	 'tests.HashTest',
	 'tests.Iterator',
	 'tests.E4X',
	 'tests.JarJS'],
	writeln, writeColorln('green'), writeColorln('red')
	);

response.write('</body></html>');