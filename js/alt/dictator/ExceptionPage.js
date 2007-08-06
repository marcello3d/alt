
/*
 * This code accesses the response information and prints raw html, in case 
 *  things are really messed up.
 */
if (dictator.response.committed) {
    var out = response.writer;
    exception.printStackTrace(out);
} else {
    dictator.response.status = 500;
    dictator.response.contentType = "text/html; charset=UTF-8";
    
	var out = dictator.response.writer;
	out.println("<html>");
	out.println(" <head><title>Execution Error: 500</title></head>");
	out.println(" <body>");
	out.println("  <h2>Uncaught "+(exception.name||"Exception")+"</h2>");
	var str = exception;
	if (exception.javaException)
		str = exception.javaException.getClass().simpleName+ ": "+
			exception.javaException.message;
    out.println("  <p><code>"+(exception.fileName + (exception.lineNumber? ":" + 
    					exception.lineNumber :""))+"</code>: " + str + "</p>");

	if (exception.rhinoException) {
		var sw = new java.io.StringWriter();
		exception.rhinoException.printStackTrace(new java.io.PrintWriter(sw));
		var stack = sw.toString();
		out.println("  <p>JavaScript stack trace:</p>");
		out.print("  <blockquote><pre>");
		//out.print(exception.rhinoException.scriptStackTrace);
		
		out.println(exception.toString ? exception.toString() : exception);
		var match;
		var index = 0;
		while (match = /at (?:(script[^)]*)|org\.mozilla\.javascript\.gen\.[^)]\
		               *)\(([^:]+.js:[^)]+)\)/g.exec(stack,index)) {
			index = match.index;
			out.println('    '+(match[1]||'')+" "+match[2]);
		}
		out.println("</pre></blockquote>");
		out.println("  <p>Java stack trace:</p>");
		out.print("  <blockquote><pre>"+stack+"</pre></blockquote>");
	}
	out.println(" <p><address>Alt Framework</address></p>");
	out.println(" </body>");
	out.println("</html>");
}