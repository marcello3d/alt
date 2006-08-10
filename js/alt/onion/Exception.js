
Alt.require('alt.Exception', true);

/**
 * Constructs a new Onion exception
 * @param {String} msg exception message
 */
function Exception(msg) {
    alt.Exception.call(this,msg);
	this.name = "alt.Exception";
}
Exception.prototype = new alt.Exception;