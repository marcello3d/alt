/**
 * This class should not be constructed directly, instead, use the  {@link Table.View}
 * class.
 * @class
 * Default view class for   
 * @constructor
 */
function View() {
}
/**
 * Returns a string representation of this class
 * @returns a string resprentation of this class
 * @type String
 */
View.prototype.toString = function() {
	return "[alt.delight.View {unlinked!}]";
}
/**
 * Performs the view on the database
 * @returns Results object with view results
 * @type Results
 * @throws ViewException if there was an error performing this view
 * @throws Exception when trying to use this abstract call
 */
View.prototype.get = function() {
	throw new Exception("Attempting to get an unlinked view.");
}
