/**
 * 
 */
package cello.alt.servlet.scripting;

import java.io.File;
import java.net.MalformedURLException;
import java.util.HashSet;
import java.util.Set;

import javax.servlet.ServletContext;

import cello.alt.servlet.FileResource;
import cello.alt.servlet.Resource;
import cello.alt.servlet.URLResource;

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
     *  system folder.  The base path must end with /.
     * @param context   the servlet context to look for resources in
     * @param basePath   the base path 
     */
    public ContextScriptLoader(ServletContext context, String basePath) {
        this(null,context,basePath);
    }
    
    /**
     * Constructs a new DirectoryScriptLoader object based on a particular file-
     *  system folder with a parent ScriptLoader.  The path must end with /.
     *  
     * @param parent a parent ScriptLoader
     * @param context   the servlet context to look for resources in
     * @param basePath   the base path
     */
    public ContextScriptLoader(ScriptLoader parent, ServletContext context, 
            String basePath) {
        super(parent);
        if (!basePath.endsWith("/"))
            throw new RuntimeException("basePath must end with /");
        
        this.context = context;
        this.basePath = basePath;
    }

    /**
     * @see cello.alt.servlet.scripting.ScriptLoader#getResource(java.lang.String)
     */
    @Override
    public Resource getResource(String path) throws MalformedURLException {
        String fullPath = basePath+path;
        String realPath = context.getRealPath(fullPath);
        if (realPath!=null)
            return new FileResource(this, path, new File(realPath));
        
        return new URLResource(this, path, context.getResource(fullPath));
    }
    
    /**
     * @see cello.alt.servlet.scripting.ScriptLoader#getResourcePaths(java.lang.String)
     */
    @Override
    public Set<String> getResourcePaths(String path) {
        Set paths = context.getResourcePaths(basePath+path);
        if (paths==null)
            return null;
        
        Set<String> newSet = new HashSet<String>();
        for (Object o : paths)
            if (o instanceof String) {
                String s = (String)o;
                if (s.startsWith(basePath))
                    newSet.add(s.substring(basePath.length()));
            }
        return newSet;
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