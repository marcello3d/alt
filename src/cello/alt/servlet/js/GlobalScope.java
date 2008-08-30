/*
 *  Copyright (C) 2005-2006 Marcello Bastéa-Forte and Cellosoft
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

package cello.alt.servlet.js;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.ContextAction;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.ImporterTopLevel;
import org.mozilla.javascript.NativeJavaObject;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

import cello.alt.servlet.AltServlet;
import cello.alt.servlet.resource.ResourceException;
import cello.alt.servlet.script.JavaScript;
import cello.alt.servlet.script.ScriptLoader;
import cello.alt.servlet.script.ScriptNotFoundException;

/**
 * Top-level scope object for AltServlet.  This defines the standard objects,
 *  a global static "Rhino" object that gives access for controlling 
 *  AltServlet.  It also adds a self-pointing global property "global", and
 *  makes Rhino.require a protected global variable.
 *  
 * @author Marcello
 *
 */
public class GlobalScope extends ImporterTopLevel implements ModuleProvider {

    /** For Eclipse warning */
    private static final long serialVersionUID = 3328680909322034652L;
    private Map<String,Module> moduleScopes = new HashMap<String,Module>();
    private RootModule rootModule;
    
    /**
     * Constructs a new GlobalScope object referencing a particular AltServlet
     * @param server  the server
     */
    public GlobalScope(AltServlet server) {
    	server.getContextFactory().call(new ContextAction() {
			public Object run(Context cx) {
		        cx.initStandardObjects(GlobalScope.this);
				return null;
			}
        });
        
        /*
        ScriptableObject objectProto = (ScriptableObject)
        							ScriptableObject.getObjectPrototype(this);
        objectProto.defineFunctionProperties(
    		new String[]{"__defineGetter__",
    					 "__defineSetter__"}, 
    		getClass(), 
    		AltServlet.PROTECTED
        );*/

        // Two properties of global: a self pointer
        defineProperty("global", this, AltServlet.PROTECTED);
        //  and a "static" class for managing Rhino
        AltClass altClass = new AltClass(this,server);
        defineProperty("Alt", altClass, AltServlet.PROTECTED);
        
        // Static class for managing servlet
        ServletClass servletClass = new ServletClass(this, server);
        defineProperty("Servlet", servletClass, AltServlet.PROTECTED);
        
        // Add require as a global method
        //defineProperty("require", altClass.get("require",altClass),
          //      AltServlet.PROTECTED);

        rootModule = new RootModule(this);
    }
    
    /**
     * @param cx
     * @param thisObj
     * @param args
     * @param funObj
     * @return null
     */
    /*
    public static Object __defineGetter__(Context cx, Scriptable thisObj, 
    		Object[] args, Function funObj) {
    	if (thisObj instanceof ScriptableObject) {
    		String field = Context.toString(args[0]);
    		ScriptableObject so = (ScriptableObject)thisObj;
    		so.defineProperty("__defineGetter__"+field, args[1], AltServlet.)
    		so.defineProperty(field, null, 
    				GlobalScope.class.getMethod("reflectGetter", 
    											ScriptableObject.class), 
    				null, 
    				ScriptableObject.EMPTY);
    	}
    	return null;
    }*/
    
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
     * @see ModuleProvider#getScriptModule(java.lang.String)
     */
    public Module getScriptModule(String name) {
        int index = name.lastIndexOf('.');
        if (index<=0)
            return rootModule;
        
        // Strip off the script name
        String modulePath = name.substring(0,index); 
            
        // Check if this module has been cached
        if (moduleScopes.containsKey(modulePath))
            return moduleScopes.get(modulePath);
        
        // Start with the global object as the base object and walk down the
        // module tree
        Module module = rootModule;
        for (String moduleName : modulePath.split("\\.")) {
            // Check if there already exists an object with this module name
            Object o = ScriptableObject.getProperty(module,moduleName);

            // If not, create the new scope.
            module = (o == Scriptable.NOT_FOUND) ? new Module(this, module,
                    moduleName) : (Module) o;
                
        }
        
        // Add to cache
        moduleScopes.put(modulePath, module);
        
        return module;
    }
    private static class ServletClass extends ScriptableObject {
        /** For Eclipse warning */
        private static final long serialVersionUID = 7263015886240684296L;

        /**
         * Constructs a new ServletClass object
         * @param scope 
         * @param server  the RhinoServlet
         */
        private ServletClass(GlobalScope scope, AltServlet server) {
        	//setParentScope(scope);
            defineProperty("context", new NativeJavaInterface(scope, 
                    server.getServletContext(), ServletContext.class), 
                    AltServlet.PROTECTED);
            defineProperty("config", new NativeJavaInterface(scope, 
                    server.getServletConfig(), ServletConfig.class), 
                    AltServlet.PROTECTED);
   
        }

        /**
         * @see org.mozilla.javascript.ScriptableObject#getClassName()
         */
        @Override
        public String getClassName() {
            return "ServletClass";
        }
        
    }
    private static class AltClass extends ScriptableObject {
        /** For Eclipse warning */
        private static final long serialVersionUID = 4816919208983818311L;
        private AltServlet server;
        
        /**
         * Constructs a new RhinoClass object
         * @param global 
         * @param server
         */
        private AltClass(GlobalScope global, AltServlet server) {
            this.server = server;
            setParentScope(global);
            defineFunctionProperties( 
                    new String[] {  "require",
                                    "evaluate",
                                    "eval",
                                    "addScriptPath",
                                    "getResource",
                                    "getRequestScope",
                                    "synchronize",
                                    "throwMessage",
                                    "log"},
                                    AltClass.class,
                                    AltServlet.PROTECTED);
                                    
        }
        
        /**
         * @see ScriptableObject#getClassName()
         */
        @Override
        public String getClassName() {
            return "Alt";
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
            boolean oldMeasure = AltServlet.measure(true);
            
            //long t = System.nanoTime();

            // Read arguments
            String scriptName = Context.toString(args[0]);
            
            boolean cascade = false;
            if (args.length>=2)
                cascade = (Boolean)args[1];

                      // Get the current script (the one that called require())
            JavaScript currentScript = AltServlet.getCurrentScript(cx);

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
            AltServlet.measure(false);
        	s.update(cx);
            AltServlet.measure(oldMeasure);


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
            boolean oldMeasure = AltServlet.measure(true);

            // Read arguments
            if (args.length==0) return false;
            String scriptName = Context.toString(args[0]);

            // Get the current script (the one that called evaluate())
            JavaScript currentScript = AltServlet.getCurrentScript(cx);

            // This should never be null
            if (currentScript == null)
                throw new RuntimeException("Current script is undefined!");

            // Load and evaluate the script in the current scope
            ScriptLoader loader = currentScript.getScriptLoader();
            JavaScript s = loader.loadScript(scriptName);

            // Get scope
            Scriptable scope = s.getModule();
            if (args.length>=2 && args[1] instanceof Scriptable)
                scope = (Scriptable)args[1];

            try {
                AltServlet.measure(false);
            	return s.evaluate(cx, scope);
            } finally {
                AltServlet.measure(oldMeasure);
            }
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
            boolean oldMeasure = AltServlet.measure(true);

            // Read arguments
            if (args.length==0) return false;
            String source = Context.toString(args[0]);
            
            // Get scope
            Scriptable scope = thisObj;
            if (args.length>=2 && args[1] instanceof Scriptable)
                scope = (Scriptable)args[1];

            // Get the current script (the one that called evaluate())
            JavaScript currentScript = AltServlet.getCurrentScript(cx);
            
            // This should never be null
            if (currentScript == null)
                throw new RuntimeException("Current script is undefined!");
            
            try {
                AltServlet.measure(false);
	            return cx.evaluateString(scope,source,
	            						currentScript.getName()+"(eval)",1,null);
            } finally {
                AltServlet.measure(oldMeasure);
            }
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
         * @throws ResourceException if there was a problem getting the resource
         */
        public static Object getResource(Context cx, Scriptable thisObj, 
                Object[] args, Function funObj) throws ResourceException {

            // Read arguments
            String resourceName = Context.toString(args[0]);
            
            // Get the current script (the one that called require())
            JavaScript currentScript = AltServlet.getCurrentScript(cx);

            // This should only be null if this method is called from outside of
            // a JavaScript evaluate() method
            if (currentScript == null)
                throw new RuntimeException("Current script is undefined!");
            
            
            
            // Get the resource relative to the current script
            return Context.javaToJS(currentScript.getResource(resourceName),
                    thisObj);
        }        
        /**
         * JavaScript function "getRequestScope".  This returns the current
         *  scope of execution, unique to every request. 
         *   
         * @param cx  javascript Context
         * @param thisObj  javascript "this" object
         * @param args  the arguments passed to the function
         * @param funObj  the function object associated with this method
         * @return  the return value of the JavaScript function
         * @see ScriptableObject#defineFunctionProperties(String[], Class, int)
         */
        public static Object getRequestScope(Context cx, Scriptable thisObj, 
                Object[] args, Function funObj) {

            return AltServlet.getRequestScope(cx);
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
                server.addScriptLoader((ScriptLoader)path);
            else
                server.addScriptPath(Context.toString(path));
        }
        /**
         * The JavaScript function "log"
         * @param msg
         */
        public void log(Object msg) {
            System.out.println("Alt.log: "+Context.toString(msg));
        }
        
        /**
         * The JavaScript function "synchronize"
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
                func.call(cx, func.getParentScope(), thisObj, 
                		new Object[]{lock, thisObj});
            }
            
            return lock;
        }
        /**
         * The JavaScript function "throwMessage" 
         * @param message 
         */
        public void throwMessage(String message) {
        	throw new RuntimeException(message);
        }


    }
    

}