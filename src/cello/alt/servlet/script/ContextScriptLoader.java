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

import java.io.File;
import java.net.MalformedURLException;
import java.util.HashSet;
import java.util.Set;

import javax.servlet.ServletContext;

import cello.alt.servlet.resource.FileResource;
import cello.alt.servlet.resource.Resource;
import cello.alt.servlet.resource.ResourceException;
import cello.alt.servlet.resource.URLResource;

/**
 * This class provides a {@link ServletContext} based ScriptLoader.  That
 *  is, it looks for resources by 
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
        System.out.println(context.getResourcePaths(basePath));
    }

    /**
     * @see ScriptLoader#findResource(java.lang.String)
     */
    @Override
    protected Resource findResource(String path) throws ResourceException {
        if (!path.startsWith("/"))
            path = "/"+path;
        
        String fullPath = basePath+path.substring(1);
        String realPath = context.getRealPath(fullPath);
        try {
            if (realPath!=null)
                return new FileResource(this, path, new File(realPath));
            
            return new URLResource(this, path, context.getResource(fullPath));
        } catch (MalformedURLException ex) {
            throw new ResourceException("Error loading resource",ex);
        }
    }
    
    /**
     * @see ScriptLoader#getResourcePaths(java.lang.String)
     */
    @Override
    public Set<String> getResourcePaths(String path) {
        if (path.startsWith("/"))
            path = path.substring(1);
        
        Set paths = context.getResourcePaths(basePath+path);
        if (paths==null)
            return null;
        
        Set<String> newSet = new HashSet<String>();
        for (Object o : paths)
            if (o instanceof String) {
                String s = (String)o;
                if (s.startsWith(basePath))
                    newSet.add(s.substring(basePath.length()-1));
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