/*
 *  Copyright (C) 2005-2006 Marcello Bastéa-Forte and Cellosoft
 * 
 * This software is provided 'as-is', without any express or implied warranty.
 * In no event will the authors be held liable for any damages arising from the
 * use of this software.
 * 
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 * 
 * 1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 * 2. Altered source versions must be plainly marked as such, and must not be
 *    misrepresented as being the original software.
 * 3. This notice may not be removed or altered from any source distribution.
 */

package cello.alt.servlet.resource;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;

import cello.alt.servlet.script.ScriptLoader;

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
    private String path;
    private URL url;
    
    /**
     * Constructs a new MutableResource object based on a resource path and a
     * URL.
     * @param loader  the loader that loaded this resource
     * @param path  the path to this resource
     * @param url  the url of this resource
     */
    public URLResource(ScriptLoader loader, String path, URL url) {
        this.loader = loader;
        this.path = path;
        this.url = url;
        if (url==null) {
        	System.err.println("path="+path);
        }
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
        return path;
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

    /**
     * @see java.lang.Object#equals(java.lang.Object)
     */
    @Override
    public boolean equals(Object o) {
        if (o==null || !(o instanceof URLResource))
            return false;
        URLResource r = (URLResource)o;
        return url.equals(r.url);
    }

    /**
     * @see java.lang.Object#hashCode()
     */
    @Override
    public int hashCode() {
        return url.hashCode();
    }

    /**
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        return "URLResource["+url+"]";
    }
    
    
    
    
}
