
Rhino.require('alt.resource.Loader', true);


function StringResource(resource) {
	var isr = new java.io.InputStreamReader(resource.resource.stream);
	var reader = new java.io.BufferedReader(isr);
	var line;
	var str = new java.lang.StringBuffer();
	while ((line = reader.readLine()) != null) {
		str.append(line);
		str.append("\n");
	}
	this.str = str.toString();
}
StringResource.prototype = new ResourceWrapper();

StringResource.prototype.get = function() {
	return this.str;
}
StringResource.prototype.getCopy = function() {
	// Strings are immutable
	return this.str;
}

Loader.defineType(StringResource, 'txt');
