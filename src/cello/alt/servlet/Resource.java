package cello.alt.servlet;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

import cello.alt.servlet.scripting.ScriptLoader;

/**
 * This interface is used to wrap the concept of Resources from servlets.
 * 
 * @author Marcello
 *
 */
public interface Resource {
    
    
    /**
     * Get the ScriptLoader associated with this resource.
     * @return  the script loader
     */
    public ScriptLoader getScriptLoader();
    
    /**
     * Returns the name of this resource
     * @return  the resource name
     */
    public String getName();

    /**
     * Returns the URL associated with this Resource.
     * @return  the URL
     */
    public URL getURL();
    
    /**
     * Opens and returns a new input stream for accessing this resource.
     * @return  the stream
     * @throws IOException if there was an error opening the stream
     */
    public InputStream getStream() throws IOException;
    
}
