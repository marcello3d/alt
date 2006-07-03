package cello.alt.servlet.scripting;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Script;
import org.mozilla.javascript.Scriptable;

import cello.alt.servlet.RhinoServlet;

/**
 * This AbstractJavaScript class a useful basis for creating cached JavaScript
 *  classes.  It implements all the necessary dependency loading/updating and
 *  only requires two methods to be implemented (isModified and evaluate).  
 * 
 * @author Marcello
 */
public abstract class AbstractJavaScript implements JavaScript {


    private Set<JavaScript> dependencies = new HashSet<JavaScript>();
    private Set<JavaScript> cascadeDependencies = new HashSet<JavaScript>();
    private Script compiledScript = null;
    
    private ScriptLoader scriptLoader = null;
    private String scriptName;
    
    /**
     * Defines whether files are automatically checked for updates
     */
    public static boolean AUTO_UPDATES = true;
    
    /**
     * Initializes the script
     * @param scriptName the name of the script
     * @param scriptLoader  the loader that loaded the script
     */
    protected AbstractJavaScript(String scriptName, ScriptLoader scriptLoader) {
        this.scriptLoader = scriptLoader;
        this.scriptName = scriptName;
    }

    /**
     * Loads a script if necessary.
     * 
     * @param cx  javascript Context 
     * @param global  javascript Scope
     * @return true if the script was actually reloaded
     * @throws IOException  if there was an error loading
     */
    public boolean update(Context cx, GlobalScope global, Set<JavaScript> loaded) throws IOException {
        System.out.println("update : "+this);
        if (loaded.contains(this))
            return false;
        loaded.add(this);
        // If file has not been modified, check dependencies.
        //  If any of the dependencies require this file to be reloaded, 
        //  checkDependencies will return true.
        if (!isModified())
            if (!checkDependencies(cx,global, loaded))
                return false;
        
        evaluate(cx, global.getModuleScope(getName()));
        return true;
    }
    /**
     * Forces the script to reload (without checking dependencies).  This really
     * is mainly used internally.
     * 
     * @param cx  javascript Context 
     * @param scope  javascript Scope
     * @return the return value of the script evaluation
     * @throws IOException  if there was an error loading
     */
    public Object evaluate(Context cx, Scriptable scope) throws IOException {
        //System.out.println("evaluate : "+this);
        // Set current script
        JavaScript previousScript = RhinoServlet.setCurrentScript(cx,this);
        
        // Clear any dependencies
        resetDependencies();
        
        // Compile file if necessary
        if (compiledScript==null || (AUTO_UPDATES && isModified())) {
            System.out.println("compile : "+this);
            compiledScript = compile(cx);
        }
        
        // Evaluate the script
        Object returnValue = evaluate(cx, scope, compiledScript);
        
        // Restore previous current script
        RhinoServlet.setCurrentScript(cx,previousScript);
        
        return returnValue;
    }
    
    /**
     * Returns whether or not the current script needs to be reloaded.
     * @return true if the script is modified
     */
    protected abstract boolean isModified();
    
    /**
     * Compile and return the current script for use by evaluate().  This method
     *  can return null if there is no actual Script (only dependencies).
     * @param cx  the javascript Context
     * @return the compiled script
     * @throws IOException if there was a problem compiling the script
     */
    protected abstract Script compile(Context cx) throws IOException;
    
    /**
     * Evaluates a script on a particular Context/Scope 
     * @param cx  javascript Context
     * @param scope  javascript Scope
     * @param script the script to evaluate.
     * @return the script
     */
    protected Object evaluate(Context cx, Scriptable scope, Script script) {
        return script.exec(cx,scope);
    }

    /**
     * Adds this script as a dependency of this object.  The dependency can be
     *  added as a "cascade" dependency.  When a cascade dependency is modified,
     *  the current script is also reevaluated (even if it is not modified).  
     * @param dependency  the JavaScript you depend on
     * @param cascadeReload  whether or not to cascade the reload
     */
    public void addDependency(JavaScript dependency, boolean cascadeReload) {
        if (cascadeReload)
            cascadeDependencies.add(dependency);
        else
            dependencies.add(dependency);
    }
    
    /**
     * Checks dependencies and loads them as needed, returning true if any of
     * the cascading dependecies were reloaded (thus requiring the current
     * script to reload).
     * @param cx  javascript Context
     * @param global  javascript Scope
     * @param loaded TODO
     * @return true if a cascading dependency was loaded
     * @throws IOException  if there was a problem loading something
     */
    protected boolean checkDependencies(Context cx, GlobalScope global, Set<JavaScript> loaded) 
            throws IOException {
        // Check the regular dependencies
        for (JavaScript s : dependencies)
            s.update(cx, global, loaded);
        
        // Check cascading dependencies
        boolean loadedSomething = false;
        for (JavaScript s : cascadeDependencies)
            if (s.update(cx, global, loaded))
                loadedSomething = true;
        
        return loadedSomething;
    }
    /**
     * Stores the current list of parents for use with synchronizeParents() 
     */
    protected void resetDependencies() {
        dependencies.clear();
        cascadeDependencies.clear();
    }

    /**
     * @see cello.alt.servlet.scripting.JavaScript#getScriptLoader()
     */
    public ScriptLoader getScriptLoader() {
        return scriptLoader;
    }

    /**
     * @see cello.alt.servlet.scripting.JavaScript#getName()
     */
    public String getName() {
        return scriptName;
    }
    
    

}
