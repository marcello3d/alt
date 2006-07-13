package cello.alt.servlet.scripting;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.HashSet;
import java.util.Set;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Script;
import org.mozilla.javascript.Scriptable;

import cello.alt.servlet.MutableResource;
import cello.alt.servlet.Resource;
import cello.alt.servlet.RhinoServlet;

/**
 * This AbstractJavaScript class a useful basis for creating cached JavaScript
 *  classes.  It implements all the necessary dependency loading/updating and
 *  only requires two methods to be implemented (isModified and evaluate).  
 * 
 * @author Marcello
 */
public class JavaScriptResource implements JavaScript,MutableResource {

    
    private Resource resource;
    private Set<JavaScript> dependencies = new HashSet<JavaScript>();
    private Set<JavaScript> cascadeDependencies = new HashSet<JavaScript>();
    private Script compiledScript = null;
    
    /**
     * Defines whether files are automatically checked for updates
     */
    public static boolean AUTO_UPDATES = true;
    
    /**
     * 
     * @param resource
     */
    public JavaScriptResource(Resource resource) {
        this.resource = resource;
    }
    
    
    /**
     * @see cello.alt.servlet.scripting.JavaScript#getName()
     */
    public String getName() {
        return resource.getName();
    }

    /**
     * @see cello.alt.servlet.Resource#getScriptLoader()
     */
    public ScriptLoader getScriptLoader() {
        return resource.getScriptLoader();
    }

    /**
     * @see cello.alt.servlet.Resource#getStream()
     */
    public InputStream getStream() throws IOException {
        return resource.getStream();
    }
    /**
     * @see cello.alt.servlet.Resource#getURL()
     */
    public URL getURL() {
        return resource.getURL();
    }
    /**
     * @see cello.alt.servlet.MutableResource#getVersionTag()
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
     * @param global  javascript Scope
     * @return true if the script was actually reloaded
     * @throws IOException  if there was an error loading
     */
    public boolean update(Context cx, GlobalScope global) throws IOException {
        //System.out.println("update : "+this);
        // If script has been modified, or if any of the cascading dependencies 
        //  were modified, evaluate this script.
        if (isModified() || checkDependencies(cx,global)) {
            evaluate(cx, global.getModuleScope(getName()));
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
        if (compiledScript==null || (AUTO_UPDATES && isModified())) {
            System.out.println("compile : "+this);
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
     * @see cello.alt.servlet.scripting.JavaScript#getEvaluationTime()
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
        return versionTag==null || versionTag.equals(getVersionTag());
    }
    
    /**
     * Compile and return the current script for use by evaluate().  This method
     *  can return null if there is no actual Script (only dependencies).
     * @param cx  the javascript Context
     * @return the compiled script
     * @throws IOException if there was a problem compiling the script
     */
    protected Script compile(Context cx) throws IOException {
        return cx.compileReader(new InputStreamReader(resource.getStream()),
                    getName(), 1, null);
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
     * @param global  javascript Scope
     * @return true if a cascading dependency was loaded
     * @throws IOException  if there was a problem loading something
     */
    protected boolean checkDependencies(Context cx, GlobalScope global) 
            throws IOException {
        // Check the regular dependencies
        for (JavaScript s : dependencies)
            s.update(cx, global);
        
        // Check cascading dependencies
        boolean loadedSomething = false;
        for (JavaScript s : cascadeDependencies) {
            s.update(cx, global);
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

}
