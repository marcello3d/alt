Rhino.require("alt.Exception", true);

function LoaderException(msg) {
	alt.Exception.call(this,msg);
}

LoaderException.prototype = new alt.Exception();

LoaderException.prototype.toString = function() {
	return "[alt.resource.LoaderException:"+this.msg+"]";
}
