/**
 * This file should be evaluated, not required
 */

var url = ""+request.requestURI.substring(1).replace('/','.').replace('.js','');
try {
	Alt.evaluate(url);
	writeln("success?");
} catch (ex) {
	writeln("failure?" + ex);
}
