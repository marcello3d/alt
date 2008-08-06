
function Session(id,request) {
	if (!request) request = Alt.getRequestScope();
	this.id = id;
	this._data = null;
	this.request = request;
	
	if (request.session)
	    this._data = request.session.getAttribute(id);
	    
    // Scriptable bean allows response.foo act like response.getFoo()
    return new alt.util.ScriptableBean(this);
}
Session.prototype.getData = function() {
	if (!this._data) 
		this.setData({});
	return this._data;
}
Session.prototype.setData = function(data) {
	this._data = data;
	this.request.session.setAttribute(this.id, this._data);
}
Session.prototype.end = function() {
	this.setData(null);
	this.request.session.invalidate();
}
	    