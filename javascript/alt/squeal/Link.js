
Rhino.require('alt.squeal.Field', true);
Rhino.require('alt.squeal.Exception');
Rhino.require('alt.squeal.Table');


/**
 * Constructor for Link object.
 * @param {String} name the name of the link
 * @param {Node} parent the parent node
 */
function Link(name, parent) {
	this.init(name,parent);
}
Link.prototype = new Field();
Link.prototype.toString = function() {
	return "[alt.squeal.Link: "+this.name+"]";
}

/**
 * Finds the Table object associated with this link.  If the table
 * cannot be found, a Exception will be thrown.
 *
 * @returns table pointed to by this Link
 * @type Table
 * @throws Exception if the table could not be found or link is invalid
 */
 
Link.prototype.getTable = function() {
	var table = this.findType(this.table);
	if (!(table instanceof Table)) 
		throw new Exception("Cannot locate table linked by "+this+".");
	return table;		
}

/**
 * Checks if a Link field has a loop.  A loop is defined by a series of required
 * SQL Schema link tags 
 *
 * @returns true if there is a loop, or false if there is none
 * @type boolean
 * @throws Exception if the table could not be found or link is invalid
 */
Link.prototype.hasLoop = function(table) {
	if (!this.required) return false;
	if (!table) table = this;
	if (this==table) return true;
	var link = this.getTable();
	return link.hasLoop(table) || link.hasLoop();
}