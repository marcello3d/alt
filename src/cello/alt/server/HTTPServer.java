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

package cello.alt.server;

import java.awt.GraphicsEnvironment;
import java.io.FileInputStream;
import java.util.Map;

import org.mortbay.jetty.Connector;
import org.mortbay.jetty.Server;
import org.mortbay.xml.XmlConfiguration;

/**
 * A simple Jetty6 wrapper for running AltServlet.  Features commandline
 *  customization (port and initial scriptpath) 
 * 
 * @author Marcello
 *
 */
public class HTTPServer {
    
    /** The name version information of the HTTPServer */
    public static final String NAME = "HTTPServer";
    /** The version number information of the HTTPServer */
    public static final String VERSION = "v0.05 alpha";
    /** The combined version information of the HTTPServer */
    public static final String NAME_VERSION = NAME+" "+VERSION;
    
    /**
     * Starts a new Jetty6 server and adds the AltServlet to the default path.
     * 
     * @param host  the host:port to listen on
     * @param root  the initial scriptpath to load scripts from
     * @param main  the initial script to load
     * @return  the newly created server object.
     * @throws Exception  if there was a problem creating the server.
     */
    public static Server startServer(String host, String root, String main) throws Exception {

    	XmlConfiguration xml = new XmlConfiguration(new FileInputStream("jetty/etc/jetty.xml"));
    	xml.configure();
    	Map<?,?> map = xml.getIdMap();
    	Object o = map.get("connector");
    	if (o != null && o instanceof Connector) {
	    	Connector connector = (Connector)o;
	        int colon = host.lastIndexOf(':');
	        if (colon<0) {
	            connector.setPort(Integer.parseInt(host));
	        } else {
	            connector.setHost(host.substring(0,colon));
	            connector.setPort(Integer.parseInt(host.substring(colon+1)));
	        }
    	}
    	return (Server)map.get("Server");
    }
    /**
     * @param args
     */
    public static void main(String[] args) {
        try {
            String flag = null;
            String root = "/js/";
            String main = "alt.main.Main";
            String host = "4500";
            boolean gui = !GraphicsEnvironment.isHeadless();
            for (String arg : args)
                if (flag!=null) {
                    if (flag.equals("-r") || flag.equals("-root"))
                        root = arg;
                    if (flag.equals("-m") || flag.equals("-main"))
                        main = arg;
                    else if (flag.equals("-h") || flag.equals("-host"))
                        host = arg;
                    flag = null;
                } else {
                    if (arg.equals("-nogui"))
                        gui = false;
                    else if (arg.equals("-gui"))
                        gui = true;
                    else if (arg.equals("-v") || arg.equals("-version")) {
                        System.out.println("HTTPServer: "+getVersion(HTTPServer.class) + 
                                " (Jetty: "+getVersion(Server.class)+", "+
                                "Java: "+System.getProperty("java.version")+")"
                              );
                    } else if (arg.equals("-h") || arg.equals("-help")) {
                        System.out.println("HTTP Server commandline help");
                        System.out.println("---------------------------------");
                        System.out.println("  java -jar altlauncher.jar [options]");
                        System.out.println("  Options: ");
                        System.out.println("    -help             this help (-h)");
                        System.out.println("    -version          version information (-v)");
                        System.out.println("    -root path        set the default script path to path (-r, default /)");
                        System.out.println("    -main script      the initial script to load (-m, default Main)");
                        System.out.println("    -host host:port   set the http host:port (-p, default 4500)");
                        System.out.println("    -gui              enable gui (default)");
                        System.out.println("    -nogui            disable gui");
                        System.out.println();
                    } else {
                        flag = arg;
                    }
                }
            if (gui) {
                ServerGUI servergui = new ServerGUI(host, root, main);
                servergui.setVisible(true);
                servergui.start();
                
            } else {
                Server server = startServer(host, root, main);
                server.start();
            }
        } catch (Exception ex) {
            ex.printStackTrace(System.err);
        }
    }
    private static String getVersion(Class<?> c) {
        Package p = c.getPackage();
        return p.getImplementationTitle()+" "+p.getImplementationVersion();
    }

}
