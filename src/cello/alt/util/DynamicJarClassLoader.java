/**
 * 
 */
package cello.alt.util;

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