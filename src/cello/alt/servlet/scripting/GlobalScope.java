/**
 * 
 */
package cello.alt.servlet.scripting;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletContext;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.ImporterTopLevel;
import org.mozilla.javascript.NativeJavaObject;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.Wrapper;

import cello.alt.servlet.RhinoServlet;

/**
 * Top-level scope object for RhinoServlet.  This defines the standard objects,
 *  a global static "Rhino" object that gives access for controlling 
 *  RhinoServlet.  It also adds a self-pointing global property "global", and
 *  makes Rhino.require a protected global variable.
 *  
 * @author Marcello
 *
 */
public class GlobalScope extends ImporterTopLevel {

    /** For Eclipse warning */
    private static final long serialVersionUID = 3328680909322034652L;
    private Map<String,Scriptable> moduleScopes;
    
    /**
     * Constructs a new GlobalScope object referencing a particular RhinoServlet
     * @param server  the server
     */
    public GlobalScope(RhinoServlet server) {
        Context cx = Context.enter();
        cx.initStandardObjects(this,false);
        Context.exit();
        
        moduleScopes = new HashMap<String,Scriptable>();

        // Two properties of global: a self pointer
        defineProperty("global", this, RhinoServlet.PROTECTED);
        //  and a "static" class for managing Rhino
        RhinoClass rhinoClass = new RhinoClass(server);
        defineProperty("Rhino", rhinoClass, RhinoServlet.PROTECTED);
        
        // Static class for managing servlet
        ServletClass servletClass = new ServletClass(server);
        defineProperty("Servlet", servletClass, RhinoServlet.PROTECTED);
        
        // Add require as a global method
        defineProperty("require", rhinoClass.get("require",rhinoClass),
                RhinoServlet.PROTECTED);
    }
    /**
     * Converts wrapped Java objects to their native object. 
     * @param o 
     * @return the potentially unwrapped object, or the object itself
     */
    public static Object getJavaObject(Object o) {
        if (o instanceof NativeJavaObject)
            return ((NativeJavaObject)o).unwrap();
        return o;
    }

    /**
     * Each module has its own scope from which its scripts are executed. This
     *  method returns that scope (creating it if necessary).  It also creates
     *  the necessary object hierarchy.  For example, if this method were called
     *  with the argument "module1.module2.Script", a global.module1 would be
     *  created, and within that a module2, global.module1.module2.  
     *  
     * @param name  the module/script name (or .*)
     * @return the scope associated with this module/script name
     */
    public Scriptable getModuleScope(String name) {
        int index = name.lastIndexOf('.');
        if (index<=0)
            return this;
        
        // Strip off the script name
        String modulePath = name.substring(0,index); 
            
        // Check if this module has been cached
        if (moduleScopes.containsKey(modulePath))
            return moduleScopes.get(modulePath);
        
        // Start with the global object as the base object and walk down the
        // module tree
        Scriptable scope = this;
        for (String moduleName : modulePath.split("\\.")) {
            // Check if there already exists an object with this module name
            Object o = scope.get(moduleName, scope);
            // If not, create the new scope.
            if (o == Scriptable.NOT_FOUND) {
                ScriptableObject child = new NamedScriptableObject("Module "+moduleName);
                // Prototype the child scope with the global scope so it has
                // direct access to all its values, to read them, anyway 
                child.setPrototype(this);
                
                // Create a self-pointer
                child.defineProperty("module", child, RhinoServlet.PROTECTED);

                // We want "threadScope" to be a new top-level scope, so set its parent 
                // scope to null. This means that any variables created by assignments
                // will be properties of "threadScope".
                child.setParentScope(null);                

                // Add the child scope as a member of the parent
                scope.put(moduleName, scope, child);
                
                scope = child;
            } else {
                scope = (Scriptable)o;
            }
                
        }
        
        // Add to cache
        moduleScopes.put(modulePath, scope);
        System.out.println("getModuleScope("+name+") : "+scope);
        
        return scope;
    }
    private static class ServletClass extends ScriptableObject {
        /** For Eclipse warning */
        private static final long serialVersionUID = 7263015886240684296L;

        /**
         * Constructs a new ServletClass object
         * @param server  the RhinoServlet
         */
        private ServletClass(RhinoServlet server) {
            defineProperty("context", new NativeJavaInterface(this, 
                    server.getServletContext(), ServletContext.class), 
                    RhinoServlet.PROTECTED);
   
        }

        /**
         * @see org.mozilla.javascript.ScriptableObject#getClassName()
         */
        @Override
        public String getClassName() {
            return "ServletClass";
        }
        
    }
    private static class RhinoClass extends ScriptableObject {
        /** For Eclipse warning */
        private static final long serialVersionUID = 4816919208983818311L;
        private RhinoServlet server;
        
        /**
         * Constructs a new RhinoClass object
         * @param server
         */
        private RhinoClass(RhinoServlet server) {
            this.server = server;
            defineFunctionProperties( 
                    new String[] {  "require",
                                    "evaluate",
                                    "eval",
                                    "addScriptPath",
                                    "getResource",
                                    "synchronize",
                                    "defineClass",
                                    "debug",
                                    "log"},
                                    RhinoClass.class,
                                    RhinoServlet.PROTECTED);
                                    
        }
        
        /**
         * @see ScriptableObject#getClassName()
         */
        @Override
        public String getClassName() {
            return "Rhino";
        }

        /**
         * JavaScript function "require".  In order to access the current 
         *  JavaScript scope and Context, this static form needs to be used.
         * <ul>
         *  <li>require(scriptname)</li>
         *  <li>require(scriptname,cascadeReload)</li>
         * </ul> 
         * @param cx  javascript Context
         * @param thisObj  javascript "this" object
         * @param args  the arguments passed to the function
         * @param funObj  the function object associated with this method
         * @return  the return value of the JavaScript function
         * @see ScriptableObject#defineFunctionProperties(java.lang.String[], java.lang.Class, int) 
         * @throws ScriptNotFoundException  if the script could not be found
         * @throws IOException if there was an error loading the script
         */
        public static Object require(Context cx, Scriptable thisObj, 
                Object[] args, Function funObj) throws ScriptNotFoundException,
                IOException {

            // Read arguments
            String scriptName = Context.toString(args[0]);
            
            boolean cascade = false;
            if (args.length>=2)
                cascade = (Boolean)args[1];


            // Get the current script (the one that called require())
            JavaScript currentScript = RhinoServlet.getCurrentScript(cx);

            // This should only be null if this method is called from outside of
            // a JavaScript evaluate() method
            if (currentScript == null)
                throw new RuntimeException("Current script is undefined!");
            
            // Get its loader and load the script
            ScriptLoader loader = currentScript.getScriptLoader();
            JavaScript s = loader.loadScript(scriptName);
            // Add the dependency
            currentScript.addDependency(s, cascade);
            // Update the dependency
            s.update(cx, (GlobalScope)cx.getThreadLocal("globalScope"));

            return s;
        }
        /**
         * JavaScript function "evaluate".  In order to access the current 
         *  JavaScript scope and Context, this static form needs to be used.
         * <ul>
         *  <li>evaluate(scriptname)</li>
         *  <li>evaluate(scriptname,scope)</li>
         * </ul> 
         * @param cx  javascript Context
         * @param thisObj  javascript "this" object
         * @param args  the arguments passed to the function
         * @param funObj  the function object associated with this method
         * @return  the return value of the JavaScript function
         * @see ScriptableObject#defineFunctionProperties(java.lang.String[], java.lang.Class, int) 
         * @throws ScriptNotFoundException if the specified script could not be found
         * @throws IOException  if there was a problem evaluating the script
         */
        public static Object evaluate(Context cx, Scriptable thisObj, 
                Object[] args, Function funObj) throws ScriptNotFoundException,
                IOException {

            // Read arguments
            if (args.length==0) return false;
            String scriptName = Context.toString(args[0]);
            
            // Get scope
            Scriptable scope = thisObj;
            if (args.length>=2 && args[1] instanceof Scriptable)
                scope = (Scriptable)args[1];

            // Get the current script (the one that called evaluate())
            JavaScript currentScript = RhinoServlet.getCurrentScript(cx);
            
            // This should never be null
            if (currentScript == null)
                throw new RuntimeException("Current script is undefined!");
            
            // Load and evaluate the script in the current scope
            ScriptLoader loader = currentScript.getScriptLoader();
            JavaScript s = loader.loadScript(scriptName);
            s.evaluate(cx, scope);
            
            return s;
        }
        /**
         * JavaScript function "evaluate".  In order to access the current 
         *  JavaScript scope and Context, this static form needs to be used.
         * <ul>
         *  <li>evaluate(scriptname)</li>
         *  <li>evaluate(scriptname,scope)</li>
         * </ul> 
         * @param cx  javascript Context
         * @param thisObj  javascript "this" object
         * @param args  the arguments passed to the function
         * @param funObj  the function object associated with this method
         * @return  the return value of the JavaScript function
         * @see ScriptableObject#defineFunctionProperties(java.lang.String[], java.lang.Class, int) 
         */
        public static Object eval(Context cx, Scriptable thisObj, 
                Object[] args, Function funObj) {

            // Read arguments
            if (args.length==0) return false;
            String source = Context.toString(args[0]);
            
            // Get scope
            Scriptable scope = thisObj;
            if (args.length>=2 && args[1] instanceof Scriptable)
                scope = (Scriptable)args[1];

            // Get the current script (the one that called evaluate())
            JavaScript currentScript = RhinoServlet.getCurrentScript(cx);
            
            // This should never be null
            if (currentScript == null)
                throw new RuntimeException("Current script is undefined!");
            
            
            return cx.evaluateString(scope,source,currentScript.getName()+"(eval)",1,null);
        }

        /**
         * JavaScript function "getResource".  In order to access the current 
         *  JavaScript scope and Context, this static form needs to be used.
         * <ul>
         *  <li>getResource(resourcename)</li>
         * </ul> 
         * @param cx  javascript Context
         * @param thisObj  javascript "this" object
         * @param args  the arguments passed to the function
         * @param funObj  the function object associated with this method
         * @return  the return value of the JavaScript function
         * @see ScriptableObject#defineFunctionProperties(String[], Class, int)
         */
        public static Object getResource(Context cx, Scriptable thisObj, 
                Object[] args, Function funObj) {

            // Read arguments
            String resourceName = Context.toString(args[0]);
            
            // Get the current script (the one that called require())
            JavaScript currentScript = RhinoServlet.getCurrentScript(cx);

            // This should only be null if this method is called from outside of
            // a JavaScript evaluate() method
            if (currentScript == null)
                throw new RuntimeException("Current script is undefined!");
            
            // Get its loader and then the resource
            ScriptLoader loader = currentScript.getScriptLoader();
            
            return loader.getResource(resourceName);
        }        
        /**
         * The JavaScript function "addScriptPath" has two formats:
         * <ul>
         *  <li>addScriptPath(string)</li>
         *  <li>addScriptPath({@link ScriptLoader})</li>
         * </ul>
         * @param path  the path object
         * @throws IOException  if there was an error adding the script path
         */
        public void addScriptPath(Object path) throws IOException {
            if (path instanceof ScriptLoader)
                server.setScriptPath((ScriptLoader)path);
            else
                server.addScriptPath(Context.toString(path));
        }
        private static Class getClass(Object[] args) 
        throws  ClassNotFoundException {
            Object arg0 = args[0];
            if (arg0 instanceof Wrapper) {
                Object wrapped = ((Wrapper)arg0).unwrap();
                if (wrapped instanceof Class)
                    return (Class)wrapped;
            }
            String className = Context.toString(arg0);
            return Class.forName(className);
        }
        /**
         * Defines a class in the same style as 
         * org.mozilla.javascript.tools.shell
         * @see org.mozilla.javascript.tools.shell.Global#defineClass(org.mozilla.javascript.Context, org.mozilla.javascript.Scriptable, java.lang.Object[], org.mozilla.javascript.Function)
         * @param cx
         * @param thisObj
         * @param args
         * @param funObj
         * @throws ClassNotFoundException if the class wasn't found
         * @throws InvocationTargetException 
         * @throws IllegalAccessException 
         * @throws InstantiationException 
         */
        public static void defineClass(Context cx, Scriptable thisObj, 
                Object[] args, Function funObj) throws ClassNotFoundException, 
                InvocationTargetException, IllegalAccessException, 
                InstantiationException {
            Class clazz = getClass(args);
            ScriptableObject.defineClass(thisObj, clazz);
        }
        /**
         * Starts the Rhino debugger
         */
        public void debug() {
            server.startDebugger();
        }
        /**
         * The JavaScript function "log"
         * @param msg
         */
        public void log(Object msg) {
            System.out.println("Rhino.log: "+msg.toString());
        }
        
        /**
         * The JavaScript function "log"
         * @param cx 
         * @param thisObj 
         * @param args 
         * @param funObj 
         * @return the lock object
         */
        public static Object synchronize(Context cx, Scriptable thisObj, 
                Object[] args, Function funObj) {
            Object lock = args[0];
            Function func = (Function)args[1];
            
            synchronized (lock) {
                func.call(cx, func.getParentScope(), thisObj, new Object[]{cx,lock,func,funObj,thisObj});
            }
            
            return lock;
        }


    }
    

}