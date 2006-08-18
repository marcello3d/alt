Alt.require('alt.main.Requires');

var Dictator	= alt.dictator.Dictator;
var SQLSchema	= alt.squeal.SQLSchema;
var Delight		= alt.delight.Delight;
var Onion		= alt.onion.Onion;
var Resources	= alt.resource.Resources;

var dictator = new Dictator();

dictator.handle(request, response, this);