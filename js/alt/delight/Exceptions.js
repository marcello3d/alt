

Rhino.require('alt.Exception');

/**
 * Constructs a new delight exception
 * @class
 * Base exception class for delight exceptions
 * @constructor
 * @param {String}	msg		exception message
 */
function Exception(msg) {
    alt.Exception.call(this,msg);
    
	this.name = "alt.delight.Exception";
}
Exception.prototype = new alt.Exception;

/**
 * Constructs a new ValidationException.
 * @class
 * Exception for when validation fails for a particular field in a {@link Row}.
 * @constructor
 * @param {String}	msg		exception message
 * @param {String}	field	the field name that failed
 */
function ValidationException(msg,field) {
    Exception.call(this,msg);
	this.field = field;
	this.name = "alt.delight.ValidationException";
}
ValidationException.prototype = new Exception;
/**
 * Get the field associated with the exception
 * @returns the field name
 */
ValidationException.prototype.getField = function() {
	return this.field;
}
/**
 * Constructs a new AddException.
 * @class
 * Exception for when there was an error adding a {@link Row}.
 * @constructor
 * @param {String}	msg		exception message
 */
function AddException(msg) {
    Exception.call(this,msg);
	this.name = "alt.delight.AddException";
}
AddException.prototype = new Exception;

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
    Exception.call(this,msg);
	this.field = field;
	this.value = value;
	this.name = "alt.delight.SetException";
}
SetException.prototype = new Exception;
SetException.prototype.toString = function() {
	return this.name+": "+this.msg+" (setting "+this.field+" to "+this.value+")";
}

/**
 * Constructs a new GetException.  
 * @class
 * Thrown when attempting to get a field and it cannot be found.
 * @param {String}	msg		exception message
 * @param {String}	field	the field name
 */
function GetException(msg,field) {
    Exception.call(this,msg);
	this.field = field;
	this.name = "alt.delight.GetException";
}
GetException.prototype = new Exception;
GetException.prototype.toString = function() {
	return this.name+": "+this.msg+" (getting "+this.field+")";
}

/**
 * Constructs a new InnerTableException.  
 * @class
 * Thrown when attempting access to an incomplete inner table.
 * @param {String}				msg		exception message
 * @param {Table}	table	the table
 */
function InnerTableException(msg,table) {
    Exception.call(this,msg);
	this.table = table;
	this.name = "alt.delight.InnerTableException";
}
InnerTableException.prototype = new Exception;
InnerTableException.prototype.toString = function() {
	return this.name+": "+this.msg+" (in "+this.table+")";
}

