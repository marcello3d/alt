/**
 * 
 */
package cello.alt.server.scripting;

import java.io.IOException;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;

public interface Script {
    /**
     * Evaluates this script if it was modified. Also evaluates any child 
     *  scripts, if necessary.
     * @param cx  The JavaScript Context
     * @param scope  The JavaScript Scope
     * @throws IOException if there is a problem loading the script.
     */
    public boolean update(Context cx, Scriptable scope) throws IOException;
    
    /**
     * Forces this script to be evaluated.
     * @param cx  The JavaScript Context
     * @param scope  The JavaScript Scope
     * @throws IOException if there is a problem loading the script.
     */
    public void evaluate(Context cx, Scriptable scope) throws IOException;

    
    /**
     * Adds this script as a parent of this object.  This is used to remove
     * children that are no longer dependent.
     * @param parent  the parent Script
     * @param cascadeReload  specifies whether the current script needs to 
     *  reload when the dependency does
     */
    public void addDependency(Script parent, boolean cascadeReload);
}