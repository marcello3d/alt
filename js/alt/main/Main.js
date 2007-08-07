
var startTime = java.lang.System.nanoTime();
global.split= function(msg) {
	Alt.log("split "+msg+": "+(java.lang.System.nanoTime() - startTime)*1e-6);
}
Alt.require('alt.main.Requires');

split('i0');
alt.main.importClasses(this);

var dictator = new Dictator();
split('i1');
dictator.handle(this);
split('i2');