
Rhino.require('alt.squeal.Exception', true);

/**
 * Constructs a new SQLException
 * @class
 * @param {String} msg		the message associated with this exception
 * @param {String} query	the query that caused this exception
 */
function Exception(msg,query) {
	this.msg = msg;
	this.query = query;
}
Exception.prototype = new alt.squeal.Exception();
Exception.prototype.toString = function() {
	return "[alt.squeal.sql.Exception: "+this.msg+" (query: "+this.query+")]";
}