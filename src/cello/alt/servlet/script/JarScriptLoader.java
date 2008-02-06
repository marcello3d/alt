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
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import cello.alt.servlet.resource.MutableResource;
import cello.alt.servlet.resource.Resource;
import cello.alt.servlet.resource.ResourceException;
import cello.alt.servlet.resource.URLResource;

/**
 * A ScriptLoader object that uses a compressed archive (.jar/.zip) to look for
 *  resources.  The current implementation opens and closes the file every time
 *  it is needed (once for each file).  This allows for hot-swapping of 
 *  compressed files, at the expense of overhead.  Once the scripts are loaded
 *  and compiled, the file will not be accessed unless it is modified.  This 
 *  could be improved by a time-lapse closing (potentially all the necessary
 *  files will be loaded within a certain timeframe of each other).
 * 
 * @author Marcello
 */

public class JarScriptLoader extends ScriptLoader {
    
    private File file;
    private ZipFile zipFile;
    
    private long lastModified = 0;

    /**
     * Constructs a new JarScriptLoader
     * @param file
     * @throws IOException
     */
    public JarScriptLoader(File file) 
            throws IOException {
        this(null,file);
    }
    /**
     * Constructs a new JarScriptLoader with a parent ScriptLoader
     * @param parent parent ScriptLoader
     * @param file
     * @throws IOException
     */
    public JarScriptLoader(ScriptLoader parent, File file) throws IOException {
        super(parent);
        this.file = file;
        openZip();
    }
    
    /**
     * Loads the zip file for reading if it needs to be.
     * @throws IOException
     */
    private void openZip() throws IOException {
        if (zipFile!=null && !isModified()) return;
        lastModified = file.lastModified();
        this.zipFile = new ZipFile(file);
    }
    /**
     * Closes the zip file from reading (releases locks and whatnot).
     */
    private void closeZip() {
        if (zipFile!=null)
            try {
                zipFile.close();
            } catch (IOException ex) {
                // do nothing
            }
        zipFile = null;
    }
    
    /**
     * Returns whether ot not the file has been modified.
     * @return  true if the file was modified
     */
    private boolean isModified() {
        return lastModified != file.lastModified();
    }

    /**
     * @see ScriptLoader#findResource(java.lang.String)
     */
    @Override
    protected Resource findResource(String name) throws ResourceException {
        String path = getPath(name);
        try {
            openZip();
            ZipEntry ze = zipFile.getEntry(path);
            if (ze == null)
                throw new ResourceException("Cannot find ZipEntry");
            return new JarResource(name, path);
        } catch (IOException ex) {
            throw new ResourceException("Cannot open zip", ex);
        } finally {
            closeZip();
        }
    }

    /**
     * @see ScriptLoader#getResourcePaths(java.lang.String)
     */
    @Override
    public Set<String> getResourcePaths(String basePath) {
        try {
            openZip();
        } catch (IOException ex) {
            return null;
        }
        Set<String> set = new HashSet<String>();
        
        // Enumeration...meh
        Enumeration<?> e = zipFile.entries();
        while (e.hasMoreElements()) {
            // Get filename
            String file = ((ZipFile)e.nextElement()).getName();
            // If it starts with path, and is not a sub-file (that is,
            // there are no /s after the base path)
            if (file.startsWith(basePath) && 
                    file.indexOf('/', basePath.length()) < 0)
                set.add(basePath);
        }
        if (set.size()==0)
            return null;
        return set;
    }
    /**
     * Returns a string representation of this JarScriptLoader.
     * @return the string representation
     */
    @Override
    public String toString() {
        return "JarScriptLoader["+file+"]";
    }

    /**
     * A JavaScript wrapper for this JarScriptLoader.
     *   
     * @author Marcello
     *
     */
    private class JarResource extends URLResource {
        /**
         * Constructs a new JarScript with a given path
         * @param scriptName the name of this script
         * @param path
         * @throws MalformedURLException if there was a problem
         */
        private JarResource(String scriptName, String path) throws
                MalformedURLException {
            super(JarScriptLoader.this, path, 
                    new URL("jar:file:"+file.getAbsolutePath()+"!"+path));
        }
        /**
         * @see MutableResource#getVersionTag()
         */
        @Override
        public Object getVersionTag() {
            return file.lastModified();
        }
        /**
         * @see Resource#getStream()
         */
        @Override
        public InputStream getStream() throws IOException {
            openZip();
            ZipEntry ze = zipFile.getEntry(getPath());
            return zipFile.getInputStream(ze);
        }

        /**
         * Returns a string representation of this JarScript
         * @return the string representation
         */
        @Override
        public String toString() {
            return "JarScript["+file+"!"+getPath()+"]";
        }
    }

}
