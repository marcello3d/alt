
Alt.require('alt.resource.Resource', true);


function ReaderResource(resource) {
	this.resource = resource.resource;
}
ReaderResource.prototype = new Resource;

ReaderResource.prototype.get = function() {
	return this.getCopy();
}
ReaderResource.prototype.getCopy = function() {
	return new java.io.InputStreamReader(this.resource.getStream());
}

