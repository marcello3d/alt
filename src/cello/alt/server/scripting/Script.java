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
     * Adds a child to this script.  Child scripts need to be reloaded when 
     * their parent script is reloaded.
     * @param child the child Script to add
     */
    public void addChild(Script child);
    
    /**
     * Returns whether or not a particular Script is a child of this Script. 
     * @param child  the child Script
     * @return true if the script is a child of this Script
     */
    public boolean isChild(Script child);
    
    /**
     * Removes a child from this script.
     * @param child  the child Script to remove
     */
    public void removeChild(Script child);
    
    /**
     * Adds this script as a parent of this object.  This is used to remove
     * children that are no longer dependent.
     * @param parent  the parent Script
     */
    public void addParent(Script parent);
}