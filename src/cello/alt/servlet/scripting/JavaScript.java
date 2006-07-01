/**
 * 
 */
package cello.alt.servlet.scripting;

import java.io.IOException;
import java.io.Reader;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;

/**
 * Interface defining a module Script used in Rhino.  It provides methods to
 *  check for updates (update method), evaluate the script in a particular
 *  scope, and to add another script as a dependency.
 *     
 * @author Marcello
 *
 */
public interface JavaScript {
    /**
     * Evaluates this script if it was modified. Also evaluates any child 
     *  scripts, if necessary.
     * @param cx  javascript Context
     * @param global  javascript Scope
     * @return whether the script was actually updated
     * @throws IOException if there is a problem loading the script.
     */
    public boolean update(Context cx, GlobalScope global)  throws IOException;
    
    /**
     * Forces this script to be evaluated.
     * @param cx  The JavaScript Context
     * @param scope  The JavaScript Scope
     * @return the result of evaluation
     * @throws IOException if there is a problem loading the script.
     */
    public Object evaluate(Context cx, Scriptable scope) throws IOException;

    
    /**
     * Adds this script as a parent of this object.  This is used to remove
     * children that are no longer dependent.
     * @param parent  the parent JavaScript
     * @param cascadeReload  specifies whether the current script needs to 
     *  reload when the dependency does
     */
    public void addDependency(JavaScript parent, boolean cascadeReload);
    
    /**
     * Gets a reader for this JavaScript (used for analyzing the source itself).
     * 
     * @return the reader
     * @throws IOException  if there was an error getting the reader.
     */
    public Reader getReader() throws IOException;
    
    /**
     * Get the script loader associated with this script. 
     * @return the ScriptLoader
     */
    public ScriptLoader getScriptLoader();
    
    /**
     * Returns the script's full name in module.Script format.
     * 
     * @return the script name
     */
    public String getName();
    
    /**
     * Get the script's module name.
     * @return the module
     */
    //public Module getModule();
    
}