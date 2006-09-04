//
// This file is separated from Main.js so that it runs in module scope instead
// of request scope.
//
Alt.require('alt.dictator.Dictator',	true);
Alt.require('alt.squeal.SQLSchema',	    true);
Alt.require('alt.delight.Delight',	     true);
Alt.require('alt.onion.Onion',		    true);
Alt.require('alt.resource.Resources',	true);

function importClasses(scope) {
    scope.Dictator =    alt.dictator.Dictator;
    scope.HTTP =        alt.dictator.HTTP;
    scope.SQLSchema =   alt.squeal.SQLSchema;
    scope.Delight = 	alt.delight.Delight;
    scope.Onion =		alt.onion.Onion;
    scope.Resources =	alt.resource.Resources;
}
