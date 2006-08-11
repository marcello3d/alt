Alt.require("alt.Exception", true);

function LoaderException(msg) {
	alt.Exception.call(this,msg);
	this.name = "alt.resource.LoaderException";
}

LoaderException.prototype = new alt.Exception;