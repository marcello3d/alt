package cello.alt.servlet;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;

/**
 * Defines a default implementation for MutableResources.  getTag() is based on 
 *  URL is not necessarily efficient (involves calling 
 *  {@link java.net.URL#openConnection()}), so it may be wise to override this 
 *  class with a more  
 * 
 * @author Marcello
 *
 */
public class URLResource implements MutableResource {

    
    private String name;
    private URL url;
    
    /**
     * Constructs a new MutableResource object based on a resource name and a
     * URL.
     * @param name
     * @param url
     */
    protected URLResource(String name, URL url) {
        this.name = name;
        this.url = url;
    }
    
    /**
     * @see cello.alt.servlet.Resource#getName()
     */
    public String getName() {
        return name;
    }
    
    /**
     * @see cello.alt.servlet.Resource#getURL()
     */
    public URL getURL() {
        return url;
    }
    /**
     * @see cello.alt.servlet.Resource#getStream()
     */
    public InputStream getStream() throws IOException {
        return url.openConnection().getInputStream();
    }
    
    /**
     * This method simply calls {@link URLConnection#getLastModified()} from
     * {@link URL#openConnection()}.
     * 
     * @see cello.alt.servlet.MutableResource#getVersionTag()
     */
    public Object getVersionTag() {
        try {            
            return url.openConnection().getLastModified();
        } catch (IOException ex) {
            return url; 
        }
    }
    
}
