
Alt.require('alt.dictator.Exception');
Alt.require('alt.util.ScriptableBean');

var NoBodyOutputStream = Packages.cello.alt.servlet.NoBodyOutputStream;

/**
 * Constructs a new response object for a particular Dictator object.
 * @constructor
 * This class is constructed by Dictator to serve as a global object for 
 *  handling responses.
 * 
 * @private
 * @param {Dictator} dictator   the dictator object
 */
function Response(dictator) {
    this.dictator = dictator;
    this.request = dictator.request;
    this.response = dictator.response;
    
    this.echo = true;
	this.started = false;
	this.finished = false;
	this.allowed = {};
	this.allow(HTTP.GET, HTTP.POST, HTTP.HEAD, HTTP.OPTIONS);
	
    this.setContentType('text/html; charset=UTF-8');
    this.setStatus(HTTP.OK);
  
    // Scriptable bean allows response.foo act like response.getFoo()
    return new alt.util.ScriptableBean(this);
}

Response.CACHE_PRIVATE  = 'private';
Response.CACHE_PUBLIC   = 'public';

Response.prototype.setContentType = function(ct) {
    this.response.contentType = ct;
}
Response.prototype.setStatus = function(s) {
    this.response.status = s;
}

Response.prototype.getCache = function() {
    if (!this.cache)
    	this.cache = {
    	    type: Response.CACHE_PRIVATE,
    	    seconds: 300,
    	    store: true
    	};
    return this.cache;
}
Response.prototype.redirect = function(u) {
	this.response.sendRedirect(u);
}



/**
 * This function tells Dictator to allow certain HTTP methods by your script.
 *  By default the methods GET, HEAD, and OPTIONS are allowed.  If you want to 
 *  allow form input, you need to allow POST.  If you want to support other 
 *  methods (PUT, DELETE, TRACE), call this method.
 * You can check the 
 * 
 * @param {String}  method  the name of the method (should be all-caps)
 */
Response.prototype.allow = function(method) {
    for (var x=0; x<arguments.length; x++)
        this.allowed[arguments[x]] = true;
}

Response.prototype.sendError = function(status, message) {
    if (!this.response.committed) {
        this.response.status = status;
        this.response.contentType = 'text/plain; charset=UTF-8';
    }
    this.writeln(status+" "+HTTP.codeToString(status));
    this.writeln(message);
    this.finish();
}




/**
 * This function initiates the response.  This method is called when you are
 *  ready to start writing. 
 * 
 * @param {String}  contentType the content type for the response
 * @param {int}     statusCode  the status code for the response
 * @see alt.dictator.HTTP 
 */
Response.prototype.start = function(contentType, statusCode) {
    if (this.started)
        throw new Exception('Dictator already started!');
    this.started = true;
    
    if (!this.allowed[this.request.method]) {
        this.sendError(this.request.protocol.match(/1.1$/) ? 
                                 HTTP.METHOD_NOT_ALLOWED :
                                 HTTP.BAD_REQUEST,
                       this.request.method+' not allowed.');
        return;
    }
    if (contentType)
        this.response.contentType = contentType;
    if (statusCode)
        this.response.status      = statusCode;
    switch (this.request.method) {
        case HTTP.HEAD:
            this.echo = false;
            break;
        case HTTP.OPTIONS:
            var allow = "";
            for each (var method in this.allowed)
                allow = (allow ? allow+', ' : '')+method;
	        this.response.setHeader("Allow", allow);
	        this.finish();
	        return;
    }
    this.response.setDateHeader("Date", java.lang.System.currentTimeMillis());
    if (this.cache === false) {
        // No caching at all
        this.response.setHeader("Cache-Control","no-cache,no-store,max-age=-1");
    } else if (this.cache instanceof Number) {
        // Cache for x seconds, assume private
        this.response.setHeader("Cache-Control","private,max-age="+this.cache);
    } else if (this.cache instanceof String) {
        // Cache specific string
        this.response.setHeader("Cache-Control",this.cache);
    }
}

Response.prototype.getWriter = function() {
    if (this.outputStream)
        throw new Exception('Cannot get writer after output stream.');
    if (!this.writer) {
        
        if (!this.started)
            this.start();
        if (this.finished)
            throw new Exception('Attempting to write data after finish.');
            
        if (this.echo) {
            this.writer = this.response.getWriter();
        } else {
	        var w = new java.io.OutputStreamWriter(this.getOutputStream(), 
	                                  this.response.getCharacterEncoding());
	        this.writer = new java.io.PrintWriter(w);
        }
        
    }
    return this.writer;
}
Response.prototype.getOutputStream = function() {
    if (this.writer)
        throw new Exception('Cannot get output stream after writer.');
    if (!this.outputStream) {
        if (!this.started)
            this.start();
        if (this.finished)
            throw new Exception('Attempting to write data after finish.');
        
        if (this.echo)
            this.outputStream = this.response.getOutputStream();
        else
            this.outputStream = new NoBodyOutputStream();       
    }
    return this.outputStream;
}
    
Response.prototype.finish = function() {
    this.finished = true;
    this.flush();
    if (!this.echo)
        this.response.contentLength = this.outputStream.writtenBytes;
    if (this.writer)
        this.writer.close();
    if (this.outputStream)
        this.outputStream.close();
    this.dictator.setHandled();
}
Response.prototype.write = function(o) {
    if (o) this.writer.print(o);  
}
Response.prototype.writeln = function(o) {
    this.writer.println(o);
}
Response.prototype.flush = function() {
    this.response.flushBuffer();
}
