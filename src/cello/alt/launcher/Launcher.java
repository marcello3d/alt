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
import java.lang.reflect.Method;


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
                    new File(base, "jetty/lib"),
                    new File(base, "jetty/lib/ext")
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
