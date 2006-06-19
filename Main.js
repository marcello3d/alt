java.lang.System.out.println("inside Main.js...");

require("alt.Test");

var r = 0;

function test() {

}

function handle(req, resp) {
	var o = resp.getWriter();
	o.println("q="+r++);
	for (var i=0; i<10; i++) {
		o.println("hey hey! "+i);
		resp.flushBuffer();
		test(); 
	}
	java.lang.System.out.println("OK..........");
}

