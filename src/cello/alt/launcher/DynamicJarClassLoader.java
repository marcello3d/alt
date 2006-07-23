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

package cello.alt.launcher;

import java.io.File;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.HashSet;
import java.util.Set;

/**
 * This ClassLoader allows a directory of jars to be used as a class path.
 * Currently this allows for dynamically loading .jar files added after the
 * class loader is initialized, although it currently does not support reloading 
 * of modified .jar files. 
 * 
 * @author Marcello
 *
 */
public class DynamicJarClassLoader extends URLClassLoader {
    private File bases[]; 
    private Set<File> seenFiles;
    /**
     * Constructs a new DynamicClassLoader with a particular folder to 
     *  search for jar/zip files within.
     * @param bases  bases path to look for jar files
     */
    public DynamicJarClassLoader(File bases[]) {
        super(new URL[]{});
        this.bases = bases;
        this.seenFiles = new HashSet<File>();
        checkFolder();
    }
    /**
     * Constructs a new DynamicClassLoader with a particular folder to 
     *  search for jar/zip files within.
     * @param bases  bases path to look for jar files
     * @param parent parent class loader
     */
    
    public DynamicJarClassLoader(File bases[], ClassLoader parent) {
        super(new URL[]{}, parent);
        this.bases = bases;
        this.seenFiles = new HashSet<File>();
        checkFolder();
    }
    /**
     * Overridden to make public.
     * @param url  url to add
     * @see java.net.URLClassLoader#addURL(java.net.URL)
     */
    @Override
    public void addURL(URL url) {
        System.out.println("Adding URL... "+url);
        super.addURL(url);
    }
    /**
     * If we have trouble finding a class, check the if the folder has been 
     * updated and try again, otherwise fail.
     * 
     * @param name the name of the class
     * @return the class
     * @throws ClassNotFoundException if the class was not found
     */
    @Override
    public Class<?> findClass(String name) throws ClassNotFoundException {
        try {
            return super.findClass(name);
        } catch (ClassNotFoundException ex) {
            if (checkFolder())
                return super.findClass(name);
            throw ex;
        }
    }
    /**
     * Checks if a folder is updated
     * @return true if the folder is updated
     */
    private boolean checkFolder() {
        boolean addedSomething = false;
        for (File base : this.bases)
            if (base.isDirectory())
                for (File f : base.listFiles()) 
                    if (!seenFiles.contains(f))
                        try {
                            seenFiles.add(f);
                            String name = f.getName().toLowerCase();
                            if (name.endsWith(".jar") || name.endsWith(".zip")) {
                                addURL(new URL("file:"+f.getCanonicalPath()));
                                addedSomething = true;
                            }
                        } catch (Exception ex) {
                            // continue
                            System.err.println("cannot add "+f+":"+ex);
                        }
        return addedSomething;
    }
}