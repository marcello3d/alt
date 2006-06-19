package cello.alt.server;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.ContextFactory;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.RhinoException;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

import cello.alt.server.scripting.DirectoryScriptPath;
import cello.alt.server.scripting.DynamicFactory;
import cello.alt.server.scripting.Script;
import cello.alt.server.scripting.ScriptPath;
import cello.alt.server.scripting.SharedScriptableObject;

public class RhinoServer {
    
    private Map<String,Script> scripts;
    private List<ScriptPath> scriptpath;
   
    private SharedScriptableObject sharedScope;
    private ExecutorService pool;

    public RhinoServer() {
        ContextFactory.initGlobal(new DynamicFactory());
        scriptpath = new LinkedList<ScriptPath>();
        scripts = new HashMap<String,Script>();
        pool = Executors.newCachedThreadPool();
    }
    
    public void addScriptPath(String path) throws IOException {
        File file = new File(path);
        if (file.isDirectory())
            addScriptPath(new DirectoryScriptPath(file));
        else {
            throw new IOException("Cannot add scriptpath : "+path);
        }
    }
    public void addScriptPath(ScriptPath sp) {
        scriptpath.add(sp);
        System.out.println("added scriptpath: "+sp);
    }
    public void addClassPath(String path) throws IOException {
        throw new IOException("Cannot add classpath : "+path);
    }
    public static RhinoServer getServer(Context cx) {
        Object o = cx.getThreadLocal("rhinoServer");
        if (o==null || !(o instanceof RhinoServer)) return null;
        return (RhinoServer)o;
    }
    public static Script getCurrentScript(Context cx) {
        Object o = cx.getThreadLocal("currentScript");
        if (o==null || !(o instanceof Script)) return null;
        return (Script)o;
    }
    public static Script setCurrentScript(Context cx, Script script) {
        Script oldScript = getCurrentScript(cx);
        if (script != null)
            cx.putThreadLocal("currentScript",script);
        return oldScript;
    }
    public void requireScript(Context cx, Scriptable scope, String scriptName, boolean cascadeReload) throws IOException {
        Script s = null;
        // Check if we've loaded this file already
        if (scripts.containsKey(scriptName)) {
            s = scripts.get(scriptName);
        } else {
            // Otherwise, look through the script path for a path that contains
            //  the requested name...
            for (ScriptPath sp : scriptpath)
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
        s.load(cx, scope);
    }
    
    public void start() {
        sharedScope = new SharedScriptableObject(this);
    }
    public void stop() {
        // TODO: halt running javascripts
    }

    private class Request implements Runnable {
        //private Date queued;
        private HttpServletRequest req;
        private HttpServletResponse resp;
        Request(HttpServletRequest req, HttpServletResponse resp) {
            //this.queued = new Date();
            this.req = req;
            this.resp = resp;
        }
        public void run() {
            Context cx = Context.enter();
            cx.setOptimizationLevel(-1);
            cx.putThreadLocal("rhinoServer",RhinoServer.this);
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
                handleError(ex);
            } finally {
                Context.exit();
            }
        }
        private void handleError(Throwable ex) {
            try {
                if (resp.isCommitted()) {
                    PrintWriter out = resp.getWriter();
                    out.println("error!");
                    ex.printStackTrace(out);
                }
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
    }
    public void queueService(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //pool.execute(new Request(req,resp));
        Request r = new Request(req,resp);
        r.run();
    }


}
