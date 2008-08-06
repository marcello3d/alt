/*
 *  Copyright (C) 2005-2006 Marcello Bast�a-Forte and Cellosoft
 * 
 * This software is provided 'as-is', without any express or implied warranty.
 * In no event will the authors be held liable for any damages arising from the
 * use of this software.
 * 
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 * 
 * 1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 * 2. Altered source versions must be plainly marked as such, and must not be
 *    misrepresented as being the original software.
 * 3. This notice may not be removed or altered from any source distribution.
 */

package cello.alt.servlet;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.ContextAction;
import org.mozilla.javascript.ContextFactory;
import org.mozilla.javascript.JavaScriptException;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

import cello.alt.servlet.js.DynamicFactory;
import cello.alt.servlet.js.GlobalScope;
import cello.alt.servlet.js.NamedScriptableObject;
import cello.alt.servlet.js.NativeJavaInterface;
import cello.alt.servlet.script.ContextScriptLoader;
import cello.alt.servlet.script.DirectoryScriptLoader;
import cello.alt.servlet.script.JarScriptLoader;
import cello.alt.servlet.script.JavaScript;
import cello.alt.servlet.script.MultiScriptLoader;
import cello.alt.servlet.script.ScriptLoader;

/**
 * The main Servlet class for serving up JavaScript-based web pages.
 * 
 * @author Marcello
 *
 */

public class AltServlet extends HttpServlet {
    
    private static final long serialVersionUID = 2280866936332806360L;
    private MultiScriptLoader loader = new MultiScriptLoader();
   
    private ContextFactory contextFactory;
    private GlobalScope globalScope;
    
    /** Version string */
    public static final String NAME_VERSION = "AltServlet/0.06a";
    
    private String mainScript = "alt.main.Main";
    
    private int optimization = -1;
    
    /** 
     * Protected access from ScriptableObject (Don't enum, read-only, and
     *  permanent).
     */
    public static final int PROTECTED = ScriptableObject.DONTENUM |
                                         ScriptableObject.PERMANENT |
                                         ScriptableObject.READONLY;
    /**
     * Visible protected access from ScriptableObject (read-only and permanent) 
     */
    public static final int VISIBLE = ScriptableObject.PERMANENT |
                                       ScriptableObject.READONLY;
    /**
     * Visible unprotected access (default)
     */
    public static final int AVAILABLE = ScriptableObject.EMPTY;
    
    /**
     * Constructs a new AltServlet
     */
    public AltServlet() {
        // do nothing
    }
    

    /**
     * Gets an init parameter with a given default.
     * @param name  the name of the parameter
     * @param def   the default value if that parameter is not defined
     * @return the value of the init parameter
     */
    private String getInitParameter(String name, String def) {
        String s = getServletConfig().getInitParameter(name);
        if (s==null)
            return def;
        return s;
    }
    
    /**
     * Initialize this AltServlet.
     */
    @Override
    public void init() {
        globalScope = new GlobalScope(this);
        loader.setModuleProvider(globalScope);
        
        ServletContext context = getServletContext();

        //addScriptLoader(new ResourceScriptLoader(loader, "/"));
        //addScriptLoader(new ContextScriptLoader(loader, context, 
        //		"/WEB-INF/scripts/"));
        
        addScriptLoader(new ContextScriptLoader(loader, context, 
        		getInitParameter("alt.root","/")));

        mainScript = getInitParameter("alt.main", "alt.main.Main");
        optimization = Integer.parseInt(
        		getInitParameter("rhino.optimization","-1"));
        System.out.println("Rhino optimization: "+optimization);
        contextFactory = new DynamicFactory();
        if (!ContextFactory.hasExplicitGlobal())
            ContextFactory.initGlobal(contextFactory);
        
        
    }
    
    /**
     * Adds a string-based script path to list of supported script paths. This
     *  may construct a DirectoryScriptLoader or JarScriptLoader depending on 
     *  the type of the file.
     * @param path  the path to add
     * @throws IOException  if there is an error reading the path
     */
    public void addScriptPath(String path) throws IOException {
        File file = new File(path);
        if (file.isDirectory()) {
            addScriptLoader(new DirectoryScriptLoader(loader, file));
        } else if (file.isFile()) {
            String lowercase = path.toLowerCase();
            if (lowercase.endsWith(".jar") || lowercase.endsWith(".zip")) 
                addScriptLoader(new JarScriptLoader(loader, file));
        } else {
            throw new IOException("Cannot add scriptpath : "+path);
        }
    }
    /**
     * Adds a ScriptLoader object to the list of script paths.  New scripts are 
     *  loaded by traversing the script path in order.  
     * @param sl  the ScriptLoader to add
     */
    public void addScriptLoader(ScriptLoader sl) {
        if (sl.getParentLoader() != loader)
            throw new RuntimeException("Cannot add loader that does not "+
                                         "parent the multi loader");
        loader.add(sl);
    }
    /**
     * Clears the list of script paths (this does not unload any classes).
     */
    public void clearScriptPath() {
        loader = null;
    }
    /**
     * Adds a folder to the class path loader.
     * @param path
     */
    public void addClassPath(String path) {
        throw new RuntimeException("Cannot add classpath : "+path);
    }
    
    /**
     * Gets the current thread's AltServer from a Context
     * @param cx  the javascript Context
     * @return  the AltServer, or null
     */
    public static AltServlet getServlet(Context cx) {
        Object o = cx.getThreadLocal("altServlet");
        if (o==null || !(o instanceof AltServlet)) return null;
        return (AltServlet)o;
    }
    /**
     * Gets the current thread's script from a Context.
     * @param cx  the javascript Context
     * @return the current JavaScript, or null
     */
    public static JavaScript getCurrentScript(Context cx) {
        Object o = cx.getThreadLocal("currentScript");
        if (o==null || !(o instanceof JavaScript)) return null;
        return (JavaScript)o;
    }
    /**
     * Sets the current JavaScript and returns the old one.
     * @param cx  the javascript Context
     * @param script  the JavaScript
     * @return  the previous JavaScript
     */
    public static JavaScript setCurrentScript(Context cx, JavaScript script) {
        JavaScript oldScript = getCurrentScript(cx);
        if (script != null)
            cx.putThreadLocal("currentScript",script);
        return oldScript;
    }
    /**
     * Gets the current thread's script from a Context.
     * @param cx  the javascript Context
     * @return the current JavaScript, or null
     */
    public static Scriptable getRequestScope(Context cx) {
        Object o = cx.getThreadLocal("requestScope");
        if (o==null || !(o instanceof Scriptable)) return null;
        return (Scriptable)o;
    }

    /**
     * Helper function to print out error messages.
     * @param resp  the HTTP Server response object
     * @param ex  the error to handle
     */
    private void handleError(HttpServletResponse resp, Throwable ex) {
        try {
            if (resp.isCommitted()) {
                PrintWriter out = resp.getWriter();
                ex.printStackTrace(out);
                return;
            }
            resp.reset();
            resp.setStatus(500);
            resp.setContentType("text/html");
            PrintWriter out = resp.getWriter();
            out.println("<html>");
            out.println(" <head><title>Execution Error: 500</title></head>");
            out.println(" <body>");
            out.println("  <h2>Uncaught "+
            		ex.getClass().getSimpleName()+"</h2>");
            if (ex instanceof JavaScriptException) {
                JavaScriptException jse = (JavaScriptException)ex;
                out.println("  <p>JavaScript Exception: "+
                		Context.toString(jse.getValue())+"</p>");
            }
            out.println("  <p>Stack trace:</p>");
            out.print("  <blockquote><pre>");
            ex.printStackTrace(out);
            out.println("</pre></blockquote>");
            out.println(" <p><address>"+NAME_VERSION+"</address></p>");
            out.println(" </body>");
            out.println("</html>");
        } catch (Throwable ex2) {
            ex.printStackTrace(System.err);
            ex2.printStackTrace(System.err);
        }
    }
    
    
    /**
     * Constructs a child scope from another scope.  
     * 
     * @param name  the name of the scope
     * @param scope  
     * @return the new scope
     */
    private ScriptableObject makeChildScope(String name, Scriptable scope) {
        // Make new object for scope base. 
        ScriptableObject child = new NamedScriptableObject(name);
        
        // Set the prototype to the scope (so we have access to all its methods 
        // and members). 
        child.setPrototype(scope);
        
        return child;
    }
    
    private int requestCount = 1;
    
    private static long startTime = 0;
    private static long totalScriptTime = 0;
    private static long totalOverheadTime = 0;
    private static boolean measuringOverhead = false;//String lastMessage = "";
    /**
     * Not used?
     * @param m
     * @return last measure flag
     */
    public static boolean measure(boolean m) {
    	if (measuringOverhead == m) return m;
    	measuringOverhead = m;
    	long nt = System.nanoTime();
		long time = nt - startTime;
    	if (measuringOverhead) {
    		totalScriptTime += time;
    	} else {
    		totalOverheadTime += time;
    	}
		startTime = nt;
		return !m;
    }/*
    public static void record() {
    	//long time = System.nanoTime() - startTime;
        //System.out.println("<<< ("+lastMessage+") in "+(time*1e-9)+"sec");
        startTime = System.nanoTime();
    }
    public static void stopRecord(String str) {
    	long time = System.nanoTime() - startTime;
    	totalTime += time;
        //System.out.println(">>> ("+str+") in "+(time*1e-9)+"sec");
        startTime = System.nanoTime();
    }*/
    /**
     * The main Servlet method. 
     * @param request  the HTTP request object
     * @param response  the HTTP response object
     */
    @Override
    public void service(final HttpServletRequest request, 
            			final HttpServletResponse response) {
    	System.out.println(">>> "+request.getMethod()+" "+request.getRequestURL());
        final long startTime = AltServlet.startTime = System.nanoTime();
        totalScriptTime = 0;
        totalOverheadTime = 0;
        measure(true);
        response.setHeader("Server", NAME_VERSION);
        contextFactory.call(new ContextAction() {
        	public Object run(Context cx ) {
		        cx.setOptimizationLevel(optimization);
		        cx.putThreadLocal("altServlet",AltServlet.this);
		        // Convert Java objects to JavaScript objects...
		        cx.getWrapFactory().setJavaPrimitiveWrap(false);
		        try {
		            // retrieve JavaScript...
		            JavaScript s = loader.loadScript(mainScript);
		            
		            // Isolate the request from the module namespace
		            ScriptableObject requestScope = makeChildScope("RequestScope-" +
		                    (requestCount++), globalScope);
		            
		            cx.putThreadLocal("globalScope", globalScope);
		            cx.putThreadLocal("requestScope", requestScope);
		            // Define thread-local variables
		            requestScope.defineProperty("request", 
		                    new NativeJavaInterface(requestScope, request, 
		                            HttpServletRequest.class), AVAILABLE);
		            
		            requestScope.defineProperty("response", 
		                    new NativeJavaInterface(requestScope, response, 
		                            HttpServletResponse.class), AVAILABLE);
		            
		            measure(false);
		            // Evaluate the script in this scope
		            s.evaluate(cx, requestScope);
		            measure(true);
		        } catch (Throwable ex) {
		            handleError(response,ex);
		        }
		        
		        return null;
        	}
        });
        long time = System.nanoTime() - startTime;
        measure(false);
        System.out.println("--- total overhead = "+(totalOverheadTime*1e-6)+"ms");
        System.out.println("--- total script = "+(totalScriptTime*1e-6)+"ms");
        System.out.println("<<< handled in "+(time*1e-6)+"ms");
    }


    /**
     * @return this servlet's contextfactory
     */
	public ContextFactory getContextFactory() {
		return contextFactory;
	}
}
