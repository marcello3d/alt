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

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;

import cello.alt.servlet.script.ScriptLoader;

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
     * @see MutableResource#getVersionTag()
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
