
Alt.require("tests.TestCore");

startTest("ScriptableWrapper");

// Inspector test

var Inspector = Packages.cello.alt.servlet.jsdoc.Inspector;

var script = Alt.require("alt.Exception");
var i = new Inspector(script);

endTest("ScriptableWrapper");
