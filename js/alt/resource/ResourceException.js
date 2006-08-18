Alt.require("alt.Exception", true);

function ResourceException(msg) {
	alt.Exception.call(this,msg);
	this.name = "alt.resource.ResourceException";
}

ResourceException.prototype = new alt.Exception;