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

package cello.alt.servlet.script;

import java.net.URL;
import java.util.Set;

import cello.alt.servlet.resource.Resource;
import cello.alt.servlet.resource.ResourceException;
import cello.alt.servlet.resource.URLResource;

/**
 * This class provides a {@link Class} based ScriptLoader.  That is, it looks 
 *  for resources by using Java's {@link Class#getResource(String)}  
 *    
 * @author Marcello
 *
 */

public class ResourceScriptLoader extends ScriptLoader {

    private String basePath;
    private Class clazz;
    
    /**
     * Constructs a new ResourceScriptLoader object based on a particular file-
     *  system folder.  The base path must end with /.

     * @param basePath   the base path 
     */
    public ResourceScriptLoader(String basePath) {
        this(null,basePath);
    }
    
    /**
     * Constructs a new DirectoryScriptLoader object based on a particular file-
     *  system folder with a parent ScriptLoader.  The path must end with /.
     *  
     * @param parent a parent ScriptLoader
     * @param basePath   the base path
     */
    public ResourceScriptLoader(ScriptLoader parent, String basePath) {
        super(parent);
        if (!basePath.endsWith("/"))
            throw new RuntimeException("basePath must end with /");
        
        this.clazz = getClass();
        this.basePath = basePath;
    }

    /**
     * @see ScriptLoader#findResource(java.lang.String)
     */
    @Override
    protected Resource findResource(String path) throws ResourceException {
        if (!path.startsWith("/"))
            path = "/"+path;
        
        String fullPath = basePath+path.substring(1);
        URL url = clazz.getResource(fullPath);
        if (url==null)
        	throw new ResourceException("Resource not found: "+path);
        return new URLResource(this, path, url);
    }
    
    /**
     * @see ScriptLoader#getResourcePaths(java.lang.String)
     */
    @Override
    public Set<String> getResourcePaths(String path) {
    	return null;
    }
    
    /**
     * Returns a string representation of this object
     * @return the string representation
     */
    @Override
    public String toString() {
        return "ResourceScriptLoader["+clazz+","+basePath+"]";
    }
}