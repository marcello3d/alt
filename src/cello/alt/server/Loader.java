package cello.alt.server;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.HashSet;
import java.util.Set;

/**
 * A dynamic class loader (based off helma.main.launcher from http://helma.org/)
 * @author Marcello
 *
 */
public class Loader {

    /**
     * Loader entry point
     * @param args
     */
    public static void main(String[] args) {
        
        try {
            // Get base directory
            File base = new File(System.getProperty("alt.home","."));
            File libdir = new File(base, "lib");
            
            // Construct a loader
            ClassLoader loader = new DynamicJarClassLoader(libdir);
            Thread.currentThread().setContextClassLoader(loader);
            
            // Initialize HTTP server
            Class c = loader.loadClass("cello.alt.server.HTTPServer");
            Method main = c.getMethod("main", String[].class);
            
            // Go!
            main.invoke(null, new Object[]{args});
            
        } catch (Throwable t) {
            System.err.println("Cannot start cello.alt.server.HTTPServer:");
            t.printStackTrace(System.err);
        }
    }
    
    private static class DynamicJarClassLoader extends URLClassLoader {
        private File base; 
        private Set<File> seenFiles;
        /**
         * Constructs a new DynamicClassLoader with a particular folder to 
         *  search for jar/zip files within.
         * @param base
         * @throws IOException
         */
        public DynamicJarClassLoader(File base) throws IOException {
            super(new URL[]{});
            this.base = base;
            this.seenFiles = new HashSet<File>();
            checkFolder();
        }
        /**
         * Just overridden for debugging...
         */
        public void addURL(URL url) {
            super.addURL(url);
            System.out.println("Adding URL... "+url);
        }
        /**
         * If we have trouble finding a class, check the if the folder has been 
         * updated and try again, otherwise fail.
         */
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
         * Checks if a file is updated
         * @return
         */
        private boolean checkFolder() {
            File[] libs = base.listFiles();
            
            boolean addedSomething = false;
            for (File f : libs) 
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
}
