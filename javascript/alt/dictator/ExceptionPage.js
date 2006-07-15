


if (response.committed) {
    var out = response.writer;
    exception.printStackTrace(out);
} else {
	response.contentType = "text/html; charset=UTF-8";
	response.status = response.SC_INTERNAL_SERVER_ERROR;
	var out = response.writer;
	out.println("<html>");
	out.println(" <head><title>Execution Error: 500</title></head>");
	out.println(" <body>");
	out.println("  <h2>Uncaught "+exception.name+"</h2>");
    out.println("  <p><code>"+exception.fileName + ":" + 
    					exception.lineNumber+ "</code>: " + exception+"</p>");
    
    for (var x in exception) {
    	out.println(x+" = "+exception[x]+"<br>");
    }
	if (exception.rhinoException) {
		var sw = new java.io.StringWriter();
		exception.rhinoException.printStackTrace(new java.io.PrintWriter(sw));
		var stack = sw.toString();
		out.println("  <p>JavaScript stack trace:</p>");
		out.print("  <blockquote><pre>");
		out.println(exception);
		var match;
		var index = 0;
		while (match = /at script\(([^:]+.js:[^)]+)\)/g.exec(stack,index)) {
			index = match.index;
			out.println('    '+match[1]);
		}
		out.println("</pre></blockquote>");
		out.println("  <p>Java stack trace:</p>");
		out.print("  <blockquote><pre>"+stack+"</pre></blockquote>");
	}
	out.println(" <p><address>Alt Framework</address></p>");
	out.println(" </body>");
	out.println("</html>");
}

dictator.setHandled();