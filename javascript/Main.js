


var session = request.getSession();

response.contentType = "text/html; charset=UTF-8";
response.status = (response.SC_OK);

var o = response.writer;
o.println("<html>");
o.println("<body>");
o.println("<pre>"+request+"</pre>");


function writeln(s) {
	response.writer.println(s+'<br/>');
}
function writeColorln(color) {
	return function(msg) {
		response.writer.println('<span style="color:'+color+'">'+msg+'</span><br/>');
	}
}


// Do tests
Rhino.require('tests.Tester');

tests.Tester.test(this,
	['tests.ScriptableWrapper',
	 'tests.Synchronization',
	 'tests.Modules'],
	writeln, writeColorln('green'), writeColorln('red')
	);

Rhino.require('alt.squeal.SQLSchema');
Rhino.require('alt.squeal.sql.SQL');
Rhino.require('alt.squeal.sql.Synchronize');
Rhino.require('alt.squeal.toHTML');

writeln(request.getRequestURI());

writeln("session = "+session);
writeln("date = "+new Date());
o.println("</body>");
o.println("</html>");



