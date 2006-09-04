
Alt.log("Request: "+request.remoteAddr + " "+request.method+" "+
		request.requestURI);

// Define some paths
dictator.map({
	examples:  'examples.Index',
	tests:     'tests.Index',
	api:       'alt.jsdoc.html.Main',
	debug:     'alt.debug.Main'
});

