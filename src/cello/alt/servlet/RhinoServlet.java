package cello.alt.servlet;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.ContextFactory;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.RhinoException;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

import cello.alt.servlet.scripting.DirectoryScriptPath;
import cello.alt.servlet.scripting.DynamicFactory;
import cello.alt.servlet.scripting.JarScriptPath;
import cello.alt.servlet.scripting.Script;
import cello.alt.servlet.scripting.ScriptPath;
import cello.alt.servlet.scripting.SharedScriptableObject;

public class RhinoServlet extends HttpServlet {
    
    private static final long serialVersionUID = 2280866936332806360L;
    private Map<String,Script> scripts;
    private List<ScriptPath> scriptpaths;
   
    private SharedScriptableObject sharedScope;
    
    public static final String VERSION = "RhinoServlet v0.01 alpha";

    /**
     * Constructs a new RhinoServer
     */
    public RhinoServlet() {
        ContextFactory.initGlobal(new DynamicFactory());
        scriptpaths = new LinkedList<ScriptPath>();
        sharedScope = new SharedScriptableObject(this);
        scripts = new HashMap<String,Script>();
    }
    

    /**
     * Initialize this RhinoServlet.
     * @param config the Servlet configuration object
     * @throws ServletException if there was a problem initializing
     */
    public void init(ServletConfig config) throws ServletException {
        try {
            addScriptPath(config.getInitParameter("scriptpath"));
        } catch (IOException ex) {
            throw new ServletException("Error initializing",ex);
        }
    }
    
    /**
     * Adds a string-based script path to list of supported script paths. This
     *  may construct a DirectoryScriptPath or JarScriptPath depending on the
     *  type of the file.
     * @param path  the path to add
     * @throws IOException  if there is an error reading the path
     */
    public void addScriptPath(String path) throws IOException {
        File file = new File(path);
        if (file.isDirectory()) {
            addScriptPath(new DirectoryScriptPath(file));
        } else if (file.isFile()) {
            String lowercase = path.toLowerCase();
            if (lowercase.endsWith(".jar") || lowercase.endsWith(".zip")) 
                addScriptPath(new JarScriptPath(file));
        } else {
            throw new IOException("Cannot add scriptpath : "+path);
        }
    }
    /**
     * Adds a ScriptPath object to the list of script paths.  New scripts are 
     *  loaded by traversing the script path in order.  
     * @param sp  the ScriptPath to add
     */
    public void addScriptPath(ScriptPath sp) {
        scriptpaths.add(sp);
        System.out.println("added scriptpath: "+sp);
    }
    /**
     * Clears the list of script paths (this does not unload any classes).
     */
    public void clearScriptPath() {
        scriptpaths.clear();
    }
    /**
     * Adds a folder to the class path loader.
     * @param path
     * @throws IOException
     */
    public void addClassPath(String path) throws IOException {
        throw new IOException("Cannot add classpath : "+path);
    }
    
    /**
     * Gets the current thread's RhinoServer from a Context
     * @param cx  the javascript Context
     * @return  the RhinoServer, or null
     */
    public static RhinoServlet getServer(Context cx) {
        Object o = cx.getThreadLocal("rhinoServer");
        if (o==null || !(o instanceof RhinoServlet)) return null;
        return (RhinoServlet)o;
    }
    /**
     * Gets the current thread's script from a Context.
     * @param cx  the javascript Context
     * @return the current Script, or null
     */
    public static Script getCurrentScript(Context cx) {
        Object o = cx.getThreadLocal("currentScript");
        if (o==null || !(o instanceof Script)) return null;
        return (Script)o;
    }
    /**
     * Sets the current Script and returns the old one.
     * @param cx  the javascript Context
     * @param script  the Script
     * @return  the previous Script
     */
    public static Script setCurrentScript(Context cx, Script script) {
        Script oldScript = getCurrentScript(cx);
        if (script != null)
            cx.putThreadLocal("currentScript",script);
        return oldScript;
    }
    
    /**
     * Requires a script of this RhinoServer.  The cascade reload feature allows
     *  a script to automatically be reloaded when the script it depends on is
     *  updated, even if the current script has not been updated.  
     * @param cx  the javascript Context
     * @param scope  the javascript Scope
     * @param scriptName  the name of the script
     * @param cascadeReload  whether or not the script is loading with cascade 
     *  reload
     * @throws IOException if there was a problem loading a script
     */
    public void requireScript(Context cx, Scriptable scope, String scriptName, 
            boolean cascadeReload) throws IOException {
        Script s = null;
        // Check if we've loaded this file already
        if (scripts.containsKey(scriptName)) {
            s = scripts.get(scriptName);
        } else {
            // Otherwise, look through the script path for a path that contains
            //  the requested name...
            for (ScriptPath sp : scriptpaths)
                if (sp.contains(scriptName)) {
                    // Get the Script and put it in the loaded list
                    s = sp.get(scriptName);
                    scripts.put(scriptName, s);
                    break;
                }
        }
        // Failed to load anything!
        if (s == null)
            throw new IOException("Could not load script "+scriptName);

        // Get the current script (the one that called require())
        Script currentScript = getCurrentScript(cx);
        
        // Add the dependency (if there is a currentScript) 
        if (currentScript!=null)
            currentScript.addDependency(s, cascadeReload);
        
        // Load the required file
        try {
            s.update(cx, scope);
        } catch (IOException ex) {
            // Perhaps file was removed?  Try reloading...
            scripts.remove(scriptName);
            requireScript(cx,scope,scriptName,cascadeReload);
        }
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
            resp.setStatus(500);
            resp.setContentType("text/html");
            PrintWriter out = resp.getWriter();
            out.println("<html>");
            out.println(" <head><title>Execution Error: 500</title></head>");
            out.println(" <body>");
            out.println("  <h2>Execution Error: "+ex.getClass().getSimpleName()+"</h2>");
            out.println("  <p>Stack trace:</p>");
            out.print("  <blockquote><pre>");
            if (ex instanceof RhinoException) {
                RhinoException rex = (RhinoException)ex;
                rex.printStackTrace(out);
            } else {
                ex.printStackTrace(out);
            }
            out.println("</pre></blockquote>");
            out.println(" <p><address>Powered by Alt Framework</address></p>");
            out.println(" </body>");
            out.println("</html>");
        } catch (IOException ex2) {
            ex2.printStackTrace(System.err);
        }
    }
    
    /**
     * The main Servlet method. 
     * @param req
     * @param resp
     */
    public void service(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        Context cx = Context.enter();
        //cx.setOptimizationLevel(-1);
        cx.putThreadLocal("rhinoServer",RhinoServlet.this);
        try {
            // We can share the scope.
            Scriptable threadScope = cx.newObject(sharedScope);
            threadScope.setPrototype(sharedScope);

            // We want "threadScope" to be a new top-level
            // scope, so set its parent scope to null. This
            // means that any variables created by assignments
            // will be properties of "threadScope".
            threadScope.setParentScope(null);
            
            requireScript(cx,sharedScope,"Main",false);

            // Create a JavaScript property of the thread scope named
            // 'x' and save a value for it.
            Object f = ScriptableObject.getProperty(threadScope,"handle");
            if (!(f instanceof Function))
                throw new RuntimeException("Function handle not defined.");

            ((Function)f).call(cx, threadScope, null, new Object[] { req, resp });
        } catch (Throwable ex) {
            handleError(resp,ex);
        } finally {
            Context.exit();
        }
    }


}
