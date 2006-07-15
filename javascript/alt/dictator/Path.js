


function Path(request) {
	/*
	Rhino.log("request.pathInfo = "+request.pathInfo);
	Rhino.log("request.pathTranslated = "+request.pathTranslated);
	Rhino.log("request.contextPath = "+request.contextPath);
	Rhino.log("request.servletPath = "+request.servletPath);
	Rhino.log("request.queryString = "+request.queryString);
	Rhino.log("request.requestURI = "+request.requestURI);
	Rhino.log("request.requestURL = "+request.requestURL);
	*/
	this.servletPath = request.servletPath;
	this.fullPath = request.requestURI;
	this.remainingPath = request.servletPath;
	this.currentPath = '';
	this.lastPath = '';
	this.next = '';
}

Path.prototype.pop = function() {
	this.currentPath += this.next + '/';
	this.lastPath = this.next;
	
	if (this.remainingPath == null) {
		this.next = '';
		return this.lastPath;
	}
		
	// Match /next/remaining
	var match = /^\/*([^\/]+)\/*(.*)$/i.exec(this.remainingPath);
	if (match == null) {
		this.next = '';
		return this.lastPath;
	}
	this.next = match[1];
	this.remainingPath = match[2];
	
	return this.lastPath;
}

Path.prototype.toString = function() {
	return "[alt.dictator.Path "+this.lastPath+","+
								this.next+","+this.remainingPath+"]";
}