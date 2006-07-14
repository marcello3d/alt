package cello.alt.servlet.resource;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;

import cello.alt.servlet.scripting.ScriptLoader;

/**
 * 
 * @author Marcello
 *
 */
public class FileResource extends URLResource {

    private File file;
    
    /**
     * Constructs a new resource from a File object.  The version tag is based
     *  on the last modification time of the file.
     * 
     * @param loader the loader that loaded this resource
     * @param name  the name of this resource
     * @param file  the File of this resource
     * @throws MalformedURLException if there was a problem creating the url
     * @throws ResourceException if the file could not be read
     */
    public FileResource(ScriptLoader loader, String name, File file) 
                throws MalformedURLException, ResourceException {
        super(loader, name, new URL("file:"+file.getAbsolutePath()));
        if (!file.canRead())
            throw new ResourceException("Cannot read file "+file);
        this.file = file;
    }

    /**
     * @see Resource#getStream()
     */
    @Override
    public InputStream getStream() throws IOException {
        return new FileInputStream(file);
    }

    /**
     * @see cello.alt.servlet.resource.MutableResource#getVersionTag()
     */
    @Override
    public Object getVersionTag() {
        return file.lastModified();
    }
    
    /**
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        return "FileResource["+file+"]";
    }

}
