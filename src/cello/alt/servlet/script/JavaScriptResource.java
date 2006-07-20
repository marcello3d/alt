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

package cello.alt.servlet.script;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.HashSet;
import java.util.Set;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Script;
import org.mozilla.javascript.Scriptable;

import cello.alt.servlet.RhinoServlet;
import cello.alt.servlet.js.Module;
import cello.alt.servlet.resource.MutableResource;
import cello.alt.servlet.resource.Resource;
import cello.alt.servlet.resource.ResourceException;

/**
 * This AbstractJavaScript class a useful basis for creating cached JavaScript
 *  classes.  It implements all the necessary dependency loading/updating and
 *  only requires two methods to be implemented (isModified and evaluate).  
 * 
 * @author Marcello
 */
public class JavaScriptResource implements JavaScript,MutableResource {


    private Module module;
    private Resource resource;
    private String scriptName;
    private Set<JavaScript> dependencies = new HashSet<JavaScript>();
    private Set<JavaScript> cascadeDependencies = new HashSet<JavaScript>();
    private Script compiledScript = null;
        
    /**
     * Constructs a new JavaScriptResource from a particular Resource with a 
     * given script name.
     * 
     * @param module      the module
     * @param resource    the resource
     * @param scriptName  the script name
     */
    public JavaScriptResource(Module module, Resource resource, 
            String scriptName) {
        this.module = module;
        this.resource = resource;
        this.scriptName = scriptName;
    }

    /**
     * @see Resource#getPath()
     */
    public String getPath() {
        return resource.getPath();
    }

    /**
     * @see Resource#getScriptLoader()
     */
    public ScriptLoader getScriptLoader() {
        return resource.getScriptLoader();
    }

    
    /**
     * @see Resource#getResource(java.lang.String)
     */
    public Resource getResource(String path) throws ResourceException {
        return resource.getResource(path);
    }


    /**
     * @see Resource#getStream()
     */
    public InputStream getStream() throws IOException {
        return resource.getStream();
    }
    /**
     * @see Resource#getURL()
     */
    public URL getURL() {
        return resource.getURL();
    }
    /**
     * @see MutableResource#getVersionTag()
     */
    public Object getVersionTag() {
        if (resource instanceof MutableResource)
            return ((MutableResource)resource).getVersionTag();
        return "";
    }
    

    /**
     * Loads a script if necessary.
     * 
     * @param cx  javascript Context 
     * @return true if the script was actually reloaded
     * @throws IOException  if there was an error loading
     */
    public synchronized boolean update(Context cx) throws IOException {
        //System.out.println("update : "+this);
        
        // If script has been modified, or if any of the cascading dependencies 
        //  were modified, evaluate this script.
        if (isModified() || checkDependencies(cx)) {
            evaluate(cx, getModule());
            return true;
        }
        return false;
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
        
        // Clear any current dependencies
        resetDependencies();
        
        // Compile file if necessary
        if (compiledScript==null || isModified()) {
            //System.out.println("compile : "+this);
            compiledScript = compile(cx);
        }
        
        // Update modification time.
        evaluationTime = System.currentTimeMillis();
        
        // Evaluate the script
        Object returnValue = evaluate(cx, scope, compiledScript);
        
        
        // Restore previous current script
        RhinoServlet.setCurrentScript(cx,previousScript);
        
        return returnValue;
    }
    
    
    
    private long evaluationTime = 0;
    /**
     * @see JavaScript#getEvaluationTime()
     */
    public long getEvaluationTime() {
        return evaluationTime;
    }
    
    private Object versionTag = null;

    /**
     * Returns whether or not the current script needs to be reloaded.
     * @return true if the script is modified
     */
    protected boolean isModified() {
        return versionTag==null || !versionTag.equals(getVersionTag());
    }
    
    /**
     * Compile and return the current script for use by evaluate().  This method
     *  can return null if there is no actual Script (only dependencies).
     * @param cx  the javascript Context
     * @return the compiled script
     * @throws IOException if there was a problem compiling the script
     */
    protected Script compile(Context cx) throws IOException {
        versionTag = getVersionTag();
        return cx.compileReader(new InputStreamReader(getStream()), getPath(), 
                1, null);
    }
    
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
     * @return true if a cascading dependency was loaded
     * @throws IOException  if there was a problem loading something
     */
    protected boolean checkDependencies(Context cx) 
            throws IOException {
        // Check the regular dependencies
        for (JavaScript s : dependencies)
            s.update(cx);
        
        // Check cascading dependencies
        boolean loadedSomething = false;
        for (JavaScript s : cascadeDependencies) {
            s.update(cx);
            if (s.getEvaluationTime() >= getEvaluationTime())
                loadedSomething = true;
        }
        
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
     * @see JavaScript#getName()
     */
    public String getName() {
        return scriptName;
    }


    /**
     * @see JavaScript#getModule()
     */
    public Module getModule() {
        return module;
    }

    /**
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        return "JavaScriptResource["+resource+"]";
    }
    
    

}
