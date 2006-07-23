
Rhino.log("Request: "+request.remoteAddr + " "+request.method+" "+
		request.requestURI);

// Define some paths
dictator.paths({
	manage:     'alt.manage.Index',
	examples:   'examples.Index',
	tests:      'tests.Index'
});

