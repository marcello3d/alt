

function TestCore(name,scope,logNeutral,logSuccess,logFail) {
	this.start = java.lang.System.nanoTime();
	this.name = name;
	this.scope = scope;
	this.tests = 0;
	this.failures = 0;
	this.logSuccess = logSuccess;
	this.logNeutral = logNeutral;
	this.logFail = logFail;
	this.logNeutral(this.name+": Starting test");
}
TestCore.prototype.split = function(message) {
	var time = (java.lang.System.nanoTime() - this.start)*1e-9;
	this.logNeutral(this.name+": Time = "+time+"sec"+(message?" ("+message+")":""));
}
TestCore.prototype.assert = function(code) {
	this.tests ++;
	try {
		var result = Rhino.eval(code,this.scope);
		if (result) {
			this.logSuccess("O "+this.name+": Test "+this.tests+" successful : "+code);
			return true;
		} else {
			this.logFail("X "+this.name+": Test "+this.tests+" failed : "+code);
		}
	} catch (ex) {
		this.logFail("X "+this.name+": Test "+this.tests+" failed : "+code+" exception thrown:"+ex);
	}
	this.failures ++;
	return false;
}
TestCore.prototype.assertRun = function(code) {
	this.tests ++;
	try {
		var result = Rhino.eval(code,this.scope);
		this.logSuccess("O "+this.name+": Test "+this.tests+" successful : "+code);
		return true;
	} catch (ex) {
		this.logFail("X "+this.name+": Test "+this.tests+" failed : "+code+" exception thrown:"+ex);
		this.failures ++;
		return false;
	}
}
TestCore.prototype.assertEquals = function(code, correctResult) {
	this.tests ++;
	try {
		var result = Rhino.eval(code,this.scope);
		if (result==correctResult) {
			this.logSuccess("O "+this.name+": Test "+this.tests+" successful : "+code+" = "+correctResult);
			return true;
		} else {
			this.logFail("X "+this.name+": Test "+this.tests+" failed : "+code+" = "+result+" (should be "+correctResult+")");
		}
	} catch (ex) {
		this.logFail("X "+this.name+": Test "+this.tests+" failed : "+code+" exception thrown:"+ex);
	}
	this.failures ++;
	return false;
}
TestCore.prototype.assertNotEquals = function(code, incorrectResult) {
	this.tests ++;
	try {
		var result = Rhino.eval(code,this.scope);
		if (result!=incorrectResult) {
			this.logSuccess("O "+this.name+": Test "+this.tests+" successful : "+code+" = "+result+" (should not be "+incorrectResult+")");
			return true;
		} else {
			this.logFail("X "+this.name+": Test "+this.tests+" failed : "+code+" = "+result+" (should not be!)");
		}
	} catch (ex) {
		this.logFail("X "+this.name+": Test "+this.tests+" failed : "+code+" exception thrown:"+ex);
	}
	this.failures ++;
	return false;
}
TestCore.prototype.end = function() {
	var end = (java.lang.System.nanoTime() - this.start)*1e-9;
	if (this.failures==0)
		this.logSuccess("O "+this.name+": Finished "+this.tests+" test(s) in "+end+"sec");
	else
		this.logFail("X "+this.name+": Failed "+this.failures+"/"+this.tests+" test(s) in "+end+"sec");
}
