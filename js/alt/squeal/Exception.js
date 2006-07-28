
Rhino.require('alt.Exception', true);

/**
 * Constructs a new SQLSchema exception
 * @param {String} msg exception message
 */
function Exception(msg) {
    alt.Exception.call(this,msg);
}
Exception.prototype.getMessage = function() {
    return this.msg;
}
Exception.prototype = new alt.Exception;
Exception.prototype.toString = function() {
	return "[alt.squeal.Exception: "+this.msg+"]";
}