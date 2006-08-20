/**
 * @fileoverview
 * File for base exception class for the Alt Framework
 */

/**
 * Constructs a new Exception
 * @class
 * Base exception class used by SQLSchema and Delight
 * @param {String} msg The message for this exception
 */
function Exception(msg) {
    Error.call(this,msg);
	this.msg = msg;
	this.name = "alt.Exception";
	// FIXME: Hack to get a decent stack trace
	try {
	    Alt.throwMessage(msg);
	} catch (ex) {
	    for (var x in ex)
	        this[x] = ex[x];
	}
}
Exception.prototype = new Error;
/**
 * Returns the message associated with this exception
 * @returns the message of this exception
 * @type String
 */
Exception.prototype.getMessage = function() {
	return this.msg;
}
/**
 * Returns a string representation of this exception.
 * @returns string representation of this exception
 * @type String
 */
Exception.prototype.toString = function() {
	return this.name+": "+this.getMessage();
}

