



require("test.*");
require("test.test2.*");

//Rhino.debug();

//Rhino.log("inside Main.js...");


var o = response.writer;

if (!global.r) global.r = 0;

function writeln(s) {
	o.println(s+"<br>");
}

var balance1 = 100;
var balance2 = 100;

var session = request.session;

response.contentType = "text/html; charset=UTF-8";
response.status = (response.SC_OK);
o.println("<html>");
o.println("<body>");

o.println("<pre>"+request+"</pre>");

/*

var url = ""+request.requestURI.substring(1).replace('/','.').replace('.js','');
try {
	Rhino.evaluate(url);
	writeln("success?");
} catch (ex) {
	writeln("failure?" + ex);
    //writeln("error:"+ex.toString());
}

*/
var sleep = java.lang.Thread.sleep;
if (!global.lock) global.lock = {};
if (!global.blah) global.blah = 0;
Rhino.synchronize(lock, function() { 
	writeln("blah="+global.blah); 
	o.flush();
	global.blah += 50;
	writeln("blah="+global.blah);
	o.flush();
	//sleep(4000);
	writeln("blah="+global.blah);
});

writeln(request.getRequestURI());

test.foo(this);
test.test2.foo(this);

writeln("r="+global.r++);
writeln("session = "+session);
writeln("date = "+new Date());
for (var i=0; i<10; i++) {
	writeln("hey hey! "+i);
	//java.lang.Thread.sleep(100);
	o.flush();
}
o.println("</body>");
o.println("</html>");

//Rhino.log("OK..........done handling!");


