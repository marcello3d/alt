/**
 * 
 */
package cello.alt.server.scripting;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;

import cello.alt.server.RhinoServlet;

public abstract class AbstractScript implements Script {


    private Set<Script> dependencies = new HashSet<Script>();
    private Set<Script> cascadeDependencies = new HashSet<Script>();

    /**
     * Loads a script if necessary.
     * 
     * @param cx  javascript Context 
     * @param scope  javascript Scope
     * @returns true if the script was actually reloaded
     * @throws IOException  if there was an error loading
     */
    public boolean update(Context cx, Scriptable scope) throws IOException {
        System.out.println("update : "+this);
        // If file has not been modified, check dependencies.
        //  If any of the dependencies require this file to be reloaded, 
        //  checkDependencies will return true.
        if (!isModified())
            if (!checkDependencies(cx,scope))
                return false;
        
        evaluate(cx, scope);
        return true;
    }
    /**
     * Forces the script to reload (without checking dependencies).  This really
     * is mainly used internally.
     * 
     * @param cx  javascript Context 
     * @param scope  javascript Scope
     * @returns true if the script was actually reloaded
     * @throws IOException  if there was an error loading
     */
    public void evaluate(Context cx, Scriptable scope) throws IOException {
        System.out.println("evaluate : "+this);
        // Set current script
        Script previousScript = RhinoServlet.setCurrentScript(cx,this);
        
        resetDependencies();
        
        doevaluate(cx,scope);
        
        // Restore previous current script
        RhinoServlet.setCurrentScript(cx,previousScript);
    }
    
    /**
     * Returns whether or not the current script needs to be reloaded.
     * @return true if the script is modified
     */
    protected abstract boolean isModified();
    
    /**
     * Evaluates the current script and updates modification date. 
     * @param cx  javascript Context
     * @param scope  javascript Scope
     */
    protected abstract void doevaluate(Context cx, Scriptable scope) 
            throws IOException;
    
    /**
     * Checks dependencies and loads them as needed, returning true if any of
     * the cascading dependecies were reloaded (thus requiring the current
     * script to reload).
     * @param cx  javascript Context
     * @param scope  javascript Scope
     * @return true if a cascading dependency was loaded
     * @throws IOException  if there was a problem loading something
     */
    protected boolean checkDependencies(Context cx, Scriptable scope) 
            throws IOException {
        // Check the regular dependencies
        for (Script s : dependencies)
            s.update(cx, scope);
        // Check cascading dependencies
        boolean loadedSomething = false;
        for (Script s : cascadeDependencies)
            if (s.update(cx, scope))
                loadedSomething = true;
        return loadedSomething;
    }

    /**
     * Adds this script as a parent of this object.  This is used to remove
     * children that are no longer dependent.
     * @param dependency  the parent Script
     */
    public void addDependency(Script dependency, boolean cascadeReload) {
        if (cascadeReload)
            cascadeDependencies.add(dependency);
        else
            dependencies.add(dependency);
    }
    /**
     * Stores the current list of parents for use with synchronizeParents() 
     */
    protected void resetDependencies() {
        dependencies.clear();
        cascadeDependencies.clear();
    }
}