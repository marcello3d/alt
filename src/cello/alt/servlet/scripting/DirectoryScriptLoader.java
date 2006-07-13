/**
 * 
 */
package cello.alt.servlet.scripting;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.HashSet;
import java.util.Set;

import cello.alt.servlet.resource.FileResource;
import cello.alt.servlet.resource.Resource;
import cello.alt.servlet.resource.ResourceException;

/**
 * This class provides a standard filesystem directory based ScriptLoader.  That
 *  is, it looks for .js files in its path and returns new {@link FileScript} 
 *  objects.
 *    
 * @author Marcello
 *
 */

public class DirectoryScriptLoader extends ScriptLoader {
    
    private File directory;
    /**
     * Constructs a new DirectoryScriptLoader object based on a particular file-
     *  system folder.
     *   
     * @param directory  the filesystem directory to look in
     * @throws IOException  if the directory is not a directory
     */
    public DirectoryScriptLoader(File directory) throws IOException {
        this(null,directory);
    }
    /**
     * Constructs a new DirectoryScriptLoader object based on a particular file-
     *  system folder with a parent ScriptLoader.
     *  
     * @param parent a parent ScriptLoader 
     * @param directory  the filesystem directory to look in
     * @throws IOException  if the directory is not a directory
     */
    public DirectoryScriptLoader(ScriptLoader parent, File directory) throws IOException {
        super(parent);
        
        if (!directory.isDirectory())
            throw new IOException(directory + " is not a directory!");
        this.directory = directory;
    }
    
    /**
     * @see ScriptLoader#getResourcePaths(java.lang.String)
     */
    @Override
    public Set<String> getResourcePaths(String basePath) {
        if (!basePath.endsWith("/"))
            basePath += "/";
        
        Set<String> paths = new HashSet<String>();
        
        for (String name : new File(directory,basePath).list()) {
            paths.add(basePath+name);
        }
        if (paths.size()>0)
            return paths;
        
        return null;
    }
    /**
     * @see ScriptLoader#getResource(java.lang.String)
     */
    @Override
    public Resource getResource(String path) throws ResourceException {
        try {
            return new FileResource(this, path, new File(directory,path));
        } catch (MalformedURLException ex) {
            throw new ResourceException("Cannot find resource",ex);
        }
    }
    /**
     * Returns a string representation of this object
     * @return the string representation
     */
    @Override
    public String toString() {
        return "DirectoryScriptLoader["+directory+"]";
    }
}