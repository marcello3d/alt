/**
 * 
 */
package cello.alt.servlet.scripting;

import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;


/**
 * Default interface for a ScriptLoader loader.  ScriptLoader is intended to
 *  mimic Java's {@link ClassLoader}. 
 *  
 * 
 * @author Marcello
 */
public abstract class ScriptLoader {
    
    private Map<String,JavaScript> cache = new HashMap<String,JavaScript>();
    
    private ScriptLoader parentLoader;
    
    /**
     * Initializes ScriptLoader with no parent loader.
     */
    protected ScriptLoader() {
        this(null);
    }
    /**
     * Initializes ScriptLoader with a parent loader.
     * @param parent
     */
    protected ScriptLoader(ScriptLoader parent) {
        this.parentLoader = parent;
    }
    
    /**
     * Returns the {@link JavaScript} object associated with the named script
     * relative to this ScriptLoader. 
     * @param name  The name of the script to get.
     * @return  the JavaScript object
     * @throws ScriptNotFoundException  if the script was not found
     */
    public JavaScript loadScript(String name) 
            throws ScriptNotFoundException {
        
        // Check if the script has been loaded
        JavaScript script = findLoadedScript(name);
        if (script != null)
            return script;
        
        // Check that the name is valid
        if (!isValidName(name))
            throw new ScriptNotFoundException("Invalid script name: "+name);

        // Check parent loader
        if (parentLoader != null)
            try {
                return parentLoader.loadScript(name);
            } catch (ScriptNotFoundException ex) {
                // nothing
            }
            
        // Find the class
        script = findScript(name);
        
        // Store in cache
        cache.put(name,script);
        return script;
    }
    
    /**
     * Returns a previously (cached) loaded script.  If the script cannot be
     * found, null is returned. 
     * @param name  the name of the script
     * @return the cached script or null
     */
    protected JavaScript findLoadedScript(String name) {
        return cache.get(name);
    }
    
    /**
     * Returns a newly loaded script.  
     * @param name
     * @return the script
     * @throws ScriptNotFoundException if the script could not be loaded (does 
     *  not exist)
     */
    protected abstract JavaScript findScript(String name)
            throws ScriptNotFoundException;

    /**
     * Returns the {@link URL} object associated with the named resource
     * relative to this ScriptLoader. 
     * @param name  The name of the resource to get.
     * @return  the resource
     */
    public URL getResource(String name) {
        return null;
    }


    private static Pattern validName = Pattern.compile(
            "^([a-z_][a-z0-9_]*\\.)*([a-z_][a-z0-9_]*|\\*)",
            Pattern.CASE_INSENSITIVE);
    
    /**
     * Returns whether or not a particular module/script name is valid.  Valid
     *  module/script names are of the following format:
     *  <ul>
     *   <li>abc</li>
     *   <li>abc.*</li>
     *   <li>abc.xyz</li>
     *   <li>abc.xyz123.*</li>
     *  </ul>
     *  
     * @param name  the module/script name to check  
     * @return true if the name is valid
     */
    private static boolean isValidName(String name) {
        return validName.matcher(name).matches();
    }
    
    /**
     * Converts a module/script name into a file system path.  This essentially
     *  replaces '.' with '/', and '.*' with '/'.  Few examples:
     *  <ul>
     *   <li>abc -> abc</li>
     *   <li>abc.* -> abc/</li>
     *   <li>abc.xyz -> abc/xyz.js</li>
     *   <li>abc.xyz123.* -> abc/xyz123/</li>
     *  </ul>
     * @param name   the module/script name
     * @return  the rewritten path
     * @throws RuntimeException  if the module name was invalid
     */
    public static String getPath(String name) throws RuntimeException {
        if (!isValidName(name))
            throw new RuntimeException("Invalid module name: "+name);
        String path = name.replace('.','/');
        if (path.endsWith("*"))
            return path.substring(0,path.length()-1);
        return path+".js";
    }
    /**
     * @return Returns the parentLoader.
     */
    public ScriptLoader getParentLoader() {
        return parentLoader;
    }
    
}