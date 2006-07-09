package cello.alt.server;

import java.awt.GraphicsEnvironment;

import org.mortbay.jetty.Connector;
import org.mortbay.jetty.Server;
import org.mortbay.jetty.nio.SelectChannelConnector;
import org.mortbay.jetty.servlet.ServletHandler;
import org.mortbay.jetty.servlet.ServletHolder;

/**
 * A simple Jetty6 wrapper for running RhinoServlet.  Features commandline
 *  customization (port and initial scriptpath) 
 * 
 * @author Marcello
 *
 */
public class HTTPServer {
    
    /** The name version information of the HTTPServer */
    public static final String NAME = "HTTPServer";
    /** The version number information of the HTTPServer */
    public static final String VERSION = "v0.03 alpha";
    /** The combined version information of the HTTPServer */
    public static final String NAME_VERSION = NAME+" "+VERSION;
    
    /**
     * Starts a new Jetty6 server and adds the RhinoServlet to the default path.
     * 
     * @param port  the port to listen on
     * @param scriptpath  the initial scriptpath to load scripts from
     * @param entryPoint  the initial script to load
     * @return  the newly created server object.
     * @throws Exception  if there was a problem creating the server.
     */
    public static Server startServer(int port, String scriptpath, String entryPoint) throws Exception {

        final Server server = new Server();
        SelectChannelConnector connector = new SelectChannelConnector();
        connector.setPort(port);
        server.setConnectors (new Connector[]{connector});        
        ServletHandler handler=new ServletHandler();

        server.setHandler(handler);
        ServletHolder holder = handler.addServletWithMapping("cello.alt.servlet.RhinoServlet", "/");
        holder.setInitParameter("scriptpath", scriptpath);
        holder.setInitParameter("entryPoint", entryPoint);
        
        return server;
    }
    /**
     * @param args
     */
    public static void main(String[] args) {
        try {
            String flag = null;
            String scriptpath = "javascript/";
            String entryPoint = "Main";
            int port = 4500;
            boolean gui = !GraphicsEnvironment.isHeadless();
            for (String arg : args)
                if (flag!=null) {
                    if (flag.equals("-sp") || flag.equals("-scriptpath"))
                        scriptpath = arg;
                    if (flag.equals("-s") || flag.equals("-script"))
                        entryPoint = arg;
                    else if (flag.equals("-p") || flag.equals("-port"))
                        try { 
                            port = Integer.valueOf(arg);
                        } catch (NumberFormatException ex) {
                            // nothing
                        }
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
                        System.out.println("    -help                   this help (-h)");
                        System.out.println("    -version                version information (-v)");
                        System.out.println("    -scriptpath path        set the default script path to path (-sp)");
                        System.out.println("    -script script          the initial script to load (-s, default Main)");
                        System.out.println("    -port n                 set the http port to n (-p, default 4500)");
                        System.out.println("    -gui                    enable gui (default)");
                        System.out.println("    -nogui                  disable gui");
                        System.out.println();
                    } else {
                        flag = arg;
                    }
                }
            if (gui) {
                ServerGUI servergui = new ServerGUI(port, scriptpath, entryPoint);
                servergui.setVisible(true);
                servergui.start();
                
            } else {
                Server server = startServer(port, scriptpath, entryPoint);
                server.start();
            }
        } catch (Exception ex) {
            ex.printStackTrace(System.err);
        }
    }
    private static String getVersion(Class c) {
        Package p = c.getPackage();
        return p.getImplementationTitle()+" "+p.getImplementationVersion();
    }

}
