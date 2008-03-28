
function Session(request,id,defaults) {
	this.id = id;
	this.data = {};
	this.initialize = function(values) {
		this.data = values || {};
		request.session.setAttribute(id, this.data);
   }
	
	if (request.session) {
	    this.data = request.session.getAttribute(id);
	    if (this.data == null) {
	    	this.data = defaults;
	    }
	}
}
