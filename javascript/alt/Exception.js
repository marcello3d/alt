/**
 * @fileoverview
 * File for base exception class used by {@link cello.SQLSchema} and {@link cello.Delight}
 */

/**
 * Constructs a new Exception
 * @class
 * Base exception class used by SQLSchema and Delight
 * @param {String} msg The message for this exception
 */
function Exception(msg) {
	this.msg = msg;
}
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
	return "[cello.Exception: "+this.msg+"]";
}

