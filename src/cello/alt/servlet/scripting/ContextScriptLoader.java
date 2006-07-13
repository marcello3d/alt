/**
 * 
 */
package cello.alt.servlet.scripting;

import java.io.File;
import java.io.IOException;
import java.net.URL;

import javax.servlet.ServletContext;

/**
 * This class provides a standard filesystem directory based ScriptLoader.  That
 *  is, it looks for .js files in its path and returns new {@link FileScript} 
 *  objects.
 *    
 * @author Marcello
 *
 */

public class ContextScriptLoader extends ScriptLoader {

    private ServletContext context;
    private String basePath;
    /**
     * Constructs a new DirectoryScriptLoader object based on a particular file-
     *  system folder.
     * @param context 
     * @param basePath 
     */
    public ContextScriptLoader(ServletContext context, String basePath) {
        this(null,context,basePath);
    }
    /**
     * Constructs a new DirectoryScriptLoader object based on a particular file-
     *  system folder with a parent ScriptLoader.
     *  
     * @param parent a parent ScriptLoader 
     * @param context 
     * @param basePath 
     */
    public ContextScriptLoader(ScriptLoader parent, ServletContext context, 
            String basePath) {
        super(parent);
        this.context = context;
        this.basePath = basePath;
    }

    /**
     * Returns a JavaScripty object from this directory based on the specified
     *  module/script name.
     * @param name the module/script name to load
     * @return the script
     * @throws ScriptNotFoundException 
     */
    @Override
    public JavaScript findScript(String name) throws ScriptNotFoundException {
        try {
            String path = getPath(name);
            String realPath = context.getRealPath(basePath+'/'+path);
            File f = new File(realPath);
            if (f.isDirectory())
                return new DirectoryScript(this, getPath(name).replace('/','.'), 
                        f);
            if (f.canRead())
                return new FileScript(name, f, this);
            return null;
        } catch (IOException ex) {
            throw new ScriptNotFoundException("Could not load "+name, ex);
        }
    }
    
    
    /**
     * @see cello.alt.servlet.scripting.ScriptLoader#getResource(java.lang.String)
     */
    @Override
    public URL getResource(String name) {
        return null;
    }
    /**
     * Returns a string representation of this object
     * @return the string representation
     */
    @Override
    public String toString() {
        return "ContextScriptLoader["+context+","+basePath+"]";
    }
}