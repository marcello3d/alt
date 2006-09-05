Alt.require('tests.Tester');

response.write('<html><body>');

function writeln(s) {
	response.writeln(<>{s}<br/></>);
}
function writeColorln(color) {
	return function(msg) {
		response.writeln(<><span style={'color:'+color}>{msg}</span><br/></>);
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