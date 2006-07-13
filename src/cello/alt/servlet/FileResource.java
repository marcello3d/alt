package cello.alt.servlet;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;

/**
 * 
 * @author Marcello
 *
 */
public class FileResource extends URLResource {

    private File file;
    
    /**
     * Constructs a new File resource
     * @param name
     * @param file
     * @throws MalformedURLException
     */
    public FileResource(String name, File file) throws MalformedURLException {
        super(name, new URL("file:"+file.getAbsolutePath()));
        this.file = file;
    }

    /**
     * @see Resource#getStream()
     */
    @Override
    public InputStream getStream() throws IOException {
        return new FileInputStream(file);
    }

}
