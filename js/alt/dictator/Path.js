

/**
 * Constructs a new Path object based on a HttpServletRequest.  This method has
 * several member variables to look at the current state of the path.
 * 
 * The path starts at the servlet root, that is, if the servlet is bound to 
 * /js/*, then a request of example.com/js/foo/bar will start at /foo/bar.
 * 
 * @param {HttpServletRequest} request the request object
 */

function Path(request) {
	/*
	Alt.log("request.pathInfo = "+request.pathInfo);
	Alt.log("request.pathTranslated = "+request.pathTranslated);
	Alt.log("request.contextPath = "+request.contextPath);
	Alt.log("request.servletPath = "+request.servletPath);
	Alt.log("request.queryString = "+request.queryString);
	Alt.log("request.requestURI = "+request.requestURI);
	Alt.log("request.requestURL = "+request.requestURL);
	*/
	this.uri = request.requestURI;
	this.remaining = request.pathInfo || request.servletPath || this.uri;
	this.full = this.remaining;
	this.current = '';
	this.last = '';
	this.next = '';
	
	this.pop();
}

/**
 * Pops the next name off the path and returns it.  The previous item can be
 * access via the member variable 'last'.
 * 
 * If there are no more items this method returns ''.  This method will ignore
 * multiple slashes, so a request uri of ///foo///bar will function the same as
 * /foo/bar.
 * 
 * @return {String}  the next item on the path.
 */
Path.prototype.pop = function() {
	this.current += this.next + '/';
	this.last = this.next;
	
	if (this.remaining == null) {
		this.next = '';
		return this.last;
	}
		
	// Match /next/remaining
	var match = /^\/*([^\/]+)\/*(.*)$/i.exec(this.remaining);
	if (match == null) {
		this.next = '';
		return this.last;
	}
	this.next = match[1];
	this.remaining = match[2];
	
	return this.last;
}
/**
 * Returns a string representation of this path object.
 * @return {String} the string representation
 */
Path.prototype.toString = function() {
	return "[alt.dictator.Path "+this.last+","+
								this.next+","+this.remaining+"]";
}