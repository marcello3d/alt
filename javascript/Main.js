java.lang.System.out.println("inside Main.js...");

require("module.Test");


var r = 0;


var o = null;
function println(s) {
	o.println(s+"<br>");
}

function handle(req, resp) {
	o = resp.writer;
	var session = req.session;
	resp.contentType = "text/html; charset=UTF-8";
	o.println("<html>");
	o.println("<body>");
	println("r="+r++);
	println("o="+o);
	println("session = "+session);
	println("date = "+new Date());
	for (var i=0; i<10; i++) {
		println("hey hey! "+i);
		o.flush();
	}
	o.println("</body>");
	o.println("</html>");
	java.lang.System.out.println("OK..........done handling!");
}

