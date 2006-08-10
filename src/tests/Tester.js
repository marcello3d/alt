
Alt.require("tests.TestCore");

var Tester = {
	test: function(scope, scripts, logNeutral, logSuccess, logFail) {
		if (logNeutral==null)
			logNeutral = Alt.log;
		if (logSuccess==null)
			logSuccess = logNeutral;
		if (logFail == null)
			logFail = logNeutral;
		var tests = 0;
		var failures = 0;
		for (var x in scripts) {
			scope.tc = new TestCore(scripts[x], scope, logNeutral, logSuccess, logFail);
			Alt.evaluate(scripts[x], scope);
			scope.tc.end();
			tests += scope.tc.tests;
			failures += scope.tc.failures;
		}
		if (failures == 0)
			logSuccess("Successfully passed "+tests+" test(s)");
		else
			logFail("Failed "+failures+"/"+tests+" test(s).");
	}
};