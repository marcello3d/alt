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

import cello.alt.servlet.script.ScriptLoader;

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
    public String getPath();

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

    /**
     * Gets a resource relative to this resource.  
     * @see ScriptLoader#getResource(Resource, String)
     * 
     * @param path  the path to this 
     * @return  the resource object
     * @throws ResourceException if the resource could not be loaded
     */
    public Resource getResource(String path) throws ResourceException;
    
}
