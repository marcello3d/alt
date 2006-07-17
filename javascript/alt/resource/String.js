
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
	return str.toString();
}

Loader.defineType(StringResource, 'txt');
