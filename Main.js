java.lang.System.out.println("inside Main.js...");

require("alt.Test");

var r = 0;

function test() {

}
var o = null;

function println(s) {
	o.println(s+"<br>");
}

function handle(req, resp) {
	
//	try {
		o = resp.writer;
		var session = req.session;
		resp.contentType = "text/html; charset=UTF-8";
//		try {
			o.println("<html>");
			o.println("<body>");
			println("r="+r++);
			println("o="+o);
			println("session = "+session);
			for (var i=0; i<100; i++) {
				println("hey hey! "+i);
				o.flush();
			}
			o.println("</body>");
			o.println("</html>");
			java.lang.System.out.println("OK..........");
/*			
		} catch (e) {
			o.println("Exception!!! "+e);
			throw e;
		}
	} catch (e) {
		java.lang.System.err.println("Exception!"+e);
		throw e;
	}
	*/
}

