package cello.alt.servlet.resource;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;

import cello.alt.servlet.scripting.ScriptLoader;

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

    
    private ScriptLoader loader;
    private String name;
    private URL url;
    
    /**
     * Constructs a new MutableResource object based on a resource name and a
     * URL.
     * @param loader  the loader that loaded this resource
     * @param name  the name of this resource
     * @param url  the url of this resource
     */
    public URLResource(ScriptLoader loader, String name, URL url) {
        this.name = name;
        this.url = url;
    }
    
    /**
     * @see cello.alt.servlet.resource.Resource#getScriptLoader()
     */
    public ScriptLoader getScriptLoader() {
        return loader;
    }
    
    /**
     * @see cello.alt.servlet.resource.Resource#getPath()
     */
    public String getPath() {
        return name;
    }
    
    /**
     * @see cello.alt.servlet.resource.Resource#getURL()
     */
    public URL getURL() {
        return url;
    }
    /**
     * @see cello.alt.servlet.resource.Resource#getStream()
     */
    public InputStream getStream() throws IOException {
        return url.openConnection().getInputStream();
    }
    
    /**
     * This method simply calls {@link URLConnection#getLastModified()} from
     * {@link URL#openConnection()}.
     * 
     * @see cello.alt.servlet.resource.MutableResource#getVersionTag()
     */
    public Object getVersionTag() {
        try {            
            return url.openConnection().getLastModified();
        } catch (IOException ex) {
            return url; 
        }
    }

    /**
     * @see cello.alt.servlet.resource.Resource#getResource(java.lang.String)
     */
    public Resource getResource(String path) throws ResourceException {
        return getScriptLoader().getResource(this,path);
    }
    
    
    
}
