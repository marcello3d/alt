
Alt.require('alt.dictator.Session');
Alt.require('alt.dictator.Path');
Alt.require('alt.dictator.HTTP');
Alt.require('alt.dictator.Response');

// This should not change per Servlet instance so we can make it global
var mainScript = Servlet.config.getInitParameter('dictator.index') || 'Index';

/**
 * Constructs a new Dictator object.  In general it is a better idea to simply
 *  set RhinoServlet to use 'alt.dictator.Main' as its main entry point, then
 *  you will need to call this directly.
 * 
 */
function Dictator() {
	this.path = null;
	this.handled = false;
	this.index('alt.dictator.IndexPage', true);
	this.defaultErrorScript = 'alt.dictator.ExceptionPage';
	this.error('alt.dictator.ExceptionPage');
}

Dictator.prototype.Redirect = function(path) {
    var thisObj = this;
    return function() {
        thisObj.redirect(path);
    }
}

/**
 * Main entry point/launcher for Dictator module.  There is no need to call this
 *  method directly, it is used by the {@link alt.dictator.Main} script.
 * 
 * @private
 * @param  {Object}   scope      the scope to use
 */
Dictator.prototype.handle = function(scope) {
	this.request = scope.request;
	this.response = scope.response;
	this.scope = scope;
	
	this.session = new Session('alt.dictator', this.request);
	
	// Make path object
	this.path = new Path(this.request);
	
	// Replace response object with our own
	
	this.scope.response = new Response(this); 
	
	// Handle the script
	this.handleScript(mainScript);
	
	// Otherwise, a catch-all filter acts like a 404 page
	this.filter('alt.dictator.NotFoundPage');
	
	// Finish everything
	this.scope.response.finish();
}

/**
 * This function sets the Script to load if there is an exception trying to 
 *  evaluate any other page.  If the exception page itself has an exception, the
 *  default exception page will be used.
 * 
 * By default, this is set to alt.dictator.ExceptionPage
 * 
 * @param {String}   script  the name of the script as used by Alt.require()
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
 * @param {String}   script  the name of the script as used by Alt.require()
 */
Dictator.prototype.index = function(script, recordPaths) {
	this.indexScript = script;
	this.recordPaths = recordPaths;
}


Dictator.prototype.redirect = function(location) {
    this.scope.response.redirect(location);
}

/**
 * This function maps path names to a scripts.  If the next element in the path 
 *  matches anything in the map, the script will be evaluated immediately.  Once
 *  a script is evaluated by this method, any further calls to map or filter 
 *  will be ignored.
 * 
 * Site security tip: only call this method on paths the current user has access
 *  and authentication checking is a snap!
 * 
 * Example:  
 * Main.js:
 * <pre>
 *  dictator.map({archive: 'yoursite.pages.ArchivePage'});
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
 * @param {String}   script  the name of the script as used by Alt.require
 */
Dictator.prototype.map = function(scripts) {
	// Get the next path string
	var script = scripts[this.path.next];
	// Found a path
	if (script != null) {
		this.path.pop();
		this.handleScript(script);
	}
	if (this.recordPaths)
		for (var path in scripts)
			this.recordPath(path,scripts[path]);
}
/**
 * @private
 */
Dictator.prototype.recordPath = function (path,script) {
	if (this.recordedPaths == null)
		this.recordedPaths = {};
	this.recordedPaths[path] = script;
}
/**
 * @private
 */
Dictator.prototype.handleScript = function(script) {
	try {
		// Clear list
		this.recordedPaths = null;
		
		// Is file?
		this.evaluateScript(script);
		
		// Was anything generated?
		if (!this.handled && this.recordedPaths != null) {
			if (this.path.next == '') {
				Alt.evaluate(this.indexScript, this.scope);
				this.setHandled();
			}
		} else
			// Set it as handled
			this.setHandled();
	} catch (ex) {
		this.handleException(ex);
	}
}

Dictator.prototype.evaluateScript = function(script) {
    if (script instanceof Function) {
        script();
    } else if (script.charAt(0)=='/') {
        // Resource...?
        var res = Alt.getResource(script);
        // TODO:
        throw new alt.Exception("Incomplete feature.");
	} else { 
    	// Evaluate script
    	Alt.evaluate(script, this.scope);
    }
    
}
/**
 * Filter evaluates a particular script.  Unlike map, this method does not
 *  take a path variable nor does it prevent other filters or maps from being
 *  evaluated.
 * @param {String} script  the name of the script as used by Alt.require
 */
Dictator.prototype.filter = function(script) {
	try {
		// Evaluate the script (do not set as handled)
		Alt.evaluate(script, this.scope);
	} catch (ex) {
		this.handleException(ex);
	}
}
/**
 * @private
 */
Dictator.prototype.handleException = function(ex) {
	if (ex instanceof DictatorHandledNotification)
		return;
	// Make new scope that prototypes the old scope with exception 
	// as a member of the new scope.
	var exScope = { 
		exception: ex 
	};
	exScope.prototype = this.scope;
	
	// Evaluate the error script
	try {
		Alt.evaluate(this.errorScript, exScope);
	} catch (ex2) {
		if (ex2 instanceof DictatorHandledNotification) return;
	    if (this.errorScript != this.defaultErrorScript) {
	        try {
	           Alt.evaluate(this.defaultErrorScript, exScope);
	        } catch (ex3) {
				if (ex3 instanceof DictatorHandledNotification) return;
	            throw [ex,ex2,ex3];
	        }
	    } else
	       throw ex+","+ex.rhinoException;
	}
	this.setHandled();
}

function DictatorHandledNotification() {}
/**
 * @private
 */
Dictator.prototype.setHandled = function() {
	// Destroy all the functions that do anything
	       this.map = 
	     this.index = 
	    this.filter = 
	this.setHandled = function() {};
	
	// Store handled flag
	this.handled = true;
	
	throw new DictatorHandledNotification;
}

/**
 * Returns a string representation of this Dictator object.
 * @return {String} the string representation
 */
Dictator.prototype.toString = function() {
	return "[alt.dictator.Dictator]";
}
