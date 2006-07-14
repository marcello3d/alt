package cello.alt.launcher;

import java.io.File;
import java.lang.reflect.Method;

import cello.alt.util.DynamicJarClassLoader;

/**
 * A dynamic class loader (based off helma.main.launcher from http://helma.org/)
 * @author Marcello
 *
 */
public class Launcher {

    /**
     * Loader entry point
     * @param args
     */
    public static void main(String[] args) {
        
        try {
            // Get base directory
            File base = new File(System.getProperty("alt.home","."));
            File libdirs[] = {
                    new File(base, "lib/core"),
                    new File(base, "lib/jetty"),
                    new File(base, "lib/ext")
            };
            
            // Construct a loader
            DynamicJarClassLoader loader = new DynamicJarClassLoader(libdirs,
                    Launcher.class.getClassLoader());
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
}
