
Alt.log("Request: "+request.remoteAddr + " "+request.method+" "+
		request.requestURI);

// Define some paths
dictator.map({
	manage:     'alt.manage.Index',
	examples:   'examples.Index',
	tests:      'tests.Index',
	api:        'alt.jsdoc.html.Main'
});

