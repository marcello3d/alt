/**
 * 
 */
package cello.alt.servlet.scripting;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

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
     * Returns a JavaScripty object from this directory based on the specified
     *  module/script name.
     * @param name the module/script name to load
     * @return the script
     * @throws ResourceException 
     */
    @Override
    public JavaScript findScript(String name) throws ScriptNotFoundException {
        try {
            File f = new File(directory, getPath(name));
            if (f.isDirectory())
                return new DirectoryScript(this, getPath(name).replace('/','.'), 
                        f);
            return new FileScript(name, f, this);
        } catch (IOException ex) {
            throw new ScriptNotFoundException("Could not load "+name, ex);
        }
    }
    
    
    /**
     * @see cello.alt.servlet.scripting.ScriptLoader#getResource(java.lang.String)
     */
    @Override
    public URL getResource(String name) {
        try {
            return new URL("file:"+new File(directory,name).getAbsolutePath());
        } catch (MalformedURLException ex) {
            return null;
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