/**
 * This class should not be constructed directly, instead, use the  {@link View#get}
 * method.
 * @class
 * Default results class for 
 * @constructor
 */
function Results() {
}
/**
 * Returns a string representation of this class
 * @returns a string resprentation of this class
 * @type String
 */
Results.prototype.toString = function() {
	return "[alt.delight.Results {unlinked!}]";
}
/**
 * Get the next row from the results set
 * @returns Row for this particular results set
 * @type Row
 * @throws Exception when trying to use this abstract call
 */
Results.prototype.next = function() {
	throw new Exception("Attempting to use an unlinked results object.");
}
