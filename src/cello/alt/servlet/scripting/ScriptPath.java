/**
 * 
 */
package cello.alt.servlet.scripting;

import java.io.IOException;


public interface ScriptPath {
    /**
     * Returns whether or not this ScriptPath object contains a particular
     * script
     * @param name  The name of the script.
     * @return true if this ScriptPath contains the named script 
     */
    public boolean contains(String name);
    
    /**
     * Returns the {@link Script} object associated with the named script
     * relative to this ScriptPath. 
     * @param name  The name of the script to get.
     * @return  the Script object
     * @throws IOException  if there was a problem getting the script
     */
    public Script get(String name) throws IOException;
}