
function Session(id,request) {
	if (!request) request = Alt.getRequestScope();
	this.id = id;
	this.data = null;
	this.request = request;
	
	if (request.session)
	    this.data = request.session.getAttribute(id);
	    
    // Scriptable bean allows response.foo act like response.getFoo()
    return new alt.util.ScriptableBean(this);
}

Session.prototype.setData = function(data) {
	this.data = data;
	this.request.session.setAttribute(this.id, this.data);
}
Session.prototype.end = function() {
	this.setData(null);
	this.request.session.invalidate();
}
	    