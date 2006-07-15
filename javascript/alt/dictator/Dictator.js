
Rhino.require('alt.dictator.Path');

// This should not change per Servlet instance
var mainScript = Servlet.config.getInitParameter('dictator.index');
if (mainScript == null)
	mainScript = 'Index';

var nopFunction = function() {};

/**
 * Constructs a new Dictator object.  In general it is a better idea to simply
 *  set RhinoServlet to use 'alt.dictator.Main' as its main entry point, then
 *  you will need to call this directly.
 * 
 */
function Dictator() {
	this.requestPath = null;
	this.handled = false;
	this.index('alt.dictator.IndexPage', true);
	this.error('alt.dictator.ExceptionPage');
}

/**
 * Main entry point/launcher for Dictator module.  There is no need to call this
 *  method directly, it is used by the {@link alt.dictator.Main} script.
 * @param {javax.servlet.http.HttpServletRequest}  request    the http request
 * @param {javax.servlet.http.HttpServletResponse} response   the http response
 * @param                                   scope      the scope to use
 */
Dictator.prototype.handle = function(request, response, scope) {
	// Make path object
	this.requestPath = new Path(request);
	this.scope = scope;
	
	// Handle the script
	this.handleScript(mainScript);
	
	// Otherwise, a catch-all filter acts like a 404 page
	this.filter('alt.dictator.NotFoundPage');
}

/**
 * This function sets the Script to load if there is an exception trying to 
 *  evaluate any other page.  If the exception page itself has an exception, the
 *  default exception page will be used.
 * 
 * By default, this is set to alt.dictator.ExceptionPage
 * 
 * @param {String}   script  the name of the script as used by Rhino.require()
 */
Dictator.prototype.error = function(script) {
	this.errorScript = script;
}

/**
 * This function sets the catch-all Script to load if there are no paths to 
 *  follow as one might expect of a directory listing.  This function is 
 *  similar to calling path('', script) with the difference that this function
 *  affects all pages recursively, and path('',script) will only act on the 
 *  current path. 
 * 
 * @param {String}   script  the name of the script as used by Rhino.require()
 */
Dictator.prototype.index = function(script, recordPaths) {
	this.indexScript = script;
	this.recordPaths = recordPaths;
}

/**
 * This function maps a single path name to a particular script name.  If the
 *  next element in the path matches path, the script will be executed 
 *  immediately.  
 * 
 * The recommendation is to use the paths() method instead of calling this 
 *  method because paths() is optimized to handle multiple paths efficently.
 * 
 * Site security tip: only call this method on paths the current user has access
 *  and authentication checking is a snap!
 * 
 * Example:  
 * Main.js:
 * <pre>
 *  dictator.path('archive', 'yoursite.pages.ArchivePage');
 * </pre>
 * ArchivePage.js:
 * <pre>
 *  dictator.path('subpage', 'yoursite.pages.ArchiveSubPage');
 * </pre>
 * If the user enters /archive/subpage into their browser, it will load 
 *  ArchivePage.js, which will then load ArchiveSubPage.js.
 * 
 * 
 * @param {String}   path    the path that loads this script
 * @param {String}   script  the name of the script as used by Rhino.require()
 */
Dictator.prototype.path = function(path, script) {
	// Get the next path string
	if (this.requestPath.next == path)
		this.handleScript(script);
	if (this.recordPaths)
		this.recordPath(path,script);
}
Dictator.prototype.paths = function(scripts) {
	// Get the next path string
	var script = scripts[this.requestPath.next];
	// Found a path
	if (script != null)
		this.handleScript(script);
	if (this.recordPaths)
		for (var path in scripts)
			this.recordPath(path,scripts[path]);
}
Dictator.prototype.recordPath = function (path,script) {
	if (this.recordedPaths == null)
		this.recordedPaths = {};
	this.recordedPaths[path] = script;
}
Dictator.prototype.handleScript = function(script) {
	try {
		var lastPath = this.requestPath.pop();
		
		// Clear list
		this.recordedPaths = null;
		
		// Evaluate script
		Rhino.evaluate(script, this.scope);
		
		// Try index page (this will do nothing is a subpage handled this)
		if (!this.handled && 
				this.recordedPaths != null && 
				this.requestPath.next == '')
			Rhino.evaluate(this.indexScript, this.scope);
		
		// Set it as handled
		this.setHandled();
	} catch (ex) {
		this.handleException(ex);
	}
}
Dictator.prototype.filter = function(script) {
	try {
		// Evaluate the script (do not set as handled)
		Rhino.evaluate(script, this.scope);
	} catch (ex) {
		this.handleException(ex);
	}
}
Dictator.prototype.handleException = function(ex) {
	// Make new scope that prototypes the old scope with exception 
	// as a member of the new scope.
	var exScope = { 
		exception: ex 
	};
	exScope.prototype = this.scope;
	
	// Evaluate the error script
	//try {
		Rhino.evaluate(this.errorScript, exScope);
		/*
	} catch (ex2) {
		// Error in error script, try fail-safe
		exScope.nestedException = ex2;
		try {
			Rhino.evaluate('alt.dictator.ExceptionPageError', exScope);
		} catch (ex3) {
			throw [ex,ex2,ex3];
		}
	}*/
}
Dictator.prototype.setHandled = function() {
	// Destroy all the functions that do anything
	      this.path = 
	     this.paths = 
	     this.index = 
	    this.filter = 
	this.setHandled = nopFunction;
	
	// Store handled flag
	this.handled = true;
}

Dictator.prototype.toString = function() {
	return "[alt.dictator.Dictator]";
}
