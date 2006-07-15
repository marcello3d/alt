
Rhino.require('alt.resource.Loader', true);


function String(resource) {
	var reader = new java.io.BufferedReader(
						new java.io.InputStreamReader(resource.stream));
	var line;
	var str = "";
	while ((line = reader.readLine()) != null)
		str += line;
	return str;
}

Loader.defineType(String, 'txt');
