



require("test.*");
require("test.test2.*");


Rhino.log("inside Main.js...");


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



var url = ""+request.requestURI.substring(1).replace('/','.').replace('.js','');
try {
	Rhino.evaluate(url);
	writeln("success?");
} catch (ex) {
	writeln("failure?" + ex);
    //writeln("error:"+ex.toString());
}


writeln(request.getRequestURI());

var sleep = java.lang.Thread.sleep;

var b1 = balance1 - 50;
sleep(100);
var b2 = balance2 + 50;
sleep(100);
balance1 = b1;
sleep(100);
balance2 = b2;

writeln("balance1 = "+balance1);
writeln("balance2 = "+balance2);

test.foo(this);
test.test2.foo(this);

writeln("r="+global.r++);
writeln("session = "+session);
writeln("date = "+new Date());
for (var i=0; i<10; i++) {
	writeln("hey hey! "+i);
	java.lang.Thread.sleep(100);
	o.flush();
}
o.println("</body>");
o.println("</html>");

Rhino.log("OK..........done handling!");


