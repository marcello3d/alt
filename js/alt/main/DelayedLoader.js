
function DelayedLoader(scope, name, script) {
	scope[name] = function() {
		Rhino.require(script);
	}
}