/**
 * 
 */
package cello.alt.server.scripting;

import java.io.IOException;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;

public interface Script {
    /**
     * Loads this script if it was modified. Also loads any child scripts, if 
     * necessary.
     * @param cx  The JavaScript Context
     * @param scope  The JavaScript Scope
     * @throws IOException if there is a problem loading the script.
     */
    public boolean load(Context cx, Scriptable scope) throws IOException;
    
    /**
     * Forces this script to be reloaded.
     * @param cx  The JavaScript Context
     * @param scope  The JavaScript Scope
     * @throws IOException if there is a problem loading the script.
     */
    public void reload(Context cx, Scriptable scope) throws IOException;

    
    /**
     * Adds this script as a parent of this object.  This is used to remove
     * children that are no longer dependent.
     * @param parent  the parent Script
     * @param cascadeReload  specifies whether the current script needs to 
     *  reload when the dependency does
     */
    public void addDependency(Script parent, boolean cascadeReload);
}