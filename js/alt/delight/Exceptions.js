

Rhino.require('alt.Exception');

/**
 * Constructs a new delight exception
 * @class
 * Base exception class for delight exceptions
 * @constructor
 * @param {String}	msg		exception message
 */
function Exception(msg) {
	this.msg = msg;
}
Exception.prototype = new alt.Exception();
Exception.prototype.toString = function() {
	return "[alt.delight.Exception: "+this.msg+"]";
}

/**
 * Constructs a new ValidationException.
 * @class
 * Exception for when validation fails for a particular field in a {@link Row}.
 * @constructor
 * @param {String}	msg		exception message
 * @param {String}	field	the field name that failed
 */
function ValidationException(msg,field) {
	this.msg = msg;
	this.field = field;
}
ValidationException.prototype = new Exception();
/**
 * Get the field associated with the exception
 * @returns the field name
 */
ValidationException.prototype.getField = function() {
	return this.field;
}
ValidationException.prototype.toString = function() {
	return "[alt.delight.ValidationException: "+this.msg+"]";
}

/**
 * Constructs a new AddException.
 * @class
 * Exception for when there was an error adding a {@link Row}.
 * @constructor
 * @param {String}	msg		exception message
 */
function AddException(msg) {
	this.msg = msg;
}
AddException.prototype = new Exception();
AddException.prototype.toString = function() {
	return "[alt.delight.AddException: "+this.msg+"]";
}

/**
 * Constructs a new SetException.  
 * @class
 * Thrown when attempting to set a field and it cannot be set.  
 * (Undefined or readonly.)
 * @constructor
 * @param {String}	msg		exception message
 * @param {String}	field	the field name
 * @param {Object}	value	the value 
 */
function SetException(msg,field,value) {
	this.msg = msg;
	this.field = field;
	this.value = value;
}
SetException.prototype = new Exception();
SetException.prototype.toString = function() {
	return "[alt.delight.SetException: "+this.msg+" (setting "+this.field+" to "+this.value+")]";
}

/**
 * Constructs a new GetException.  
 * @class
 * Thrown when attempting to get a field and it cannot be found.
 * @param {String}	msg		exception message
 * @param {String}	field	the field name
 */
function GetException(msg,field) {
	this.msg = msg;
	this.field = field;
}
GetException.prototype = new Exception();
GetException.prototype.toString = function() {
	return "[GetException: "+this.msg+" (getting "+this.field+")]";
}

/**
 * Constructs a new InnerTableException.  
 * @class
 * Thrown when attempting access to an incomplete inner table.
 * @param {String}				msg		exception message
 * @param {Table}	table	the table
 */
function InnerTableException(msg,table) {
	this.msg = msg;
	this.table = table;
}
InnerTableException.prototype = new Exception();
InnerTableException.prototype.toString = function() {
	return "[alt.delight.InnerTableException: "+this.msg+" (in "+this.table+")]";
}

