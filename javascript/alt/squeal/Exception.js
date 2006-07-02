
Rhino.require('alt.Exception', true);

/**
 * Constructs a new cello.SQLSchema exception
 * @param {String} msg exception message
 */
Exception = function(msg) {
	this.msg = msg;
}
Exception.prototype = new alt.Exception();
Exception.prototype.toString = function() {
	return "[alt.squeal.Exception: "+this.msg+"]";
}
