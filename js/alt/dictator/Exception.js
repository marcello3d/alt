
Alt.require('alt.Exception', true);

/**
 * Constructs a new Dictator exception
 * @param {String} msg exception message
 */
function Exception(msg) {
    alt.Exception.call(this,msg);
	this.name = "alt.dictator.Exception";
}
Exception.prototype = new alt.Exception;