package cello.alt.server;

import java.awt.GraphicsEnvironment;

import org.mortbay.jetty.Connector;
import org.mortbay.jetty.Server;
import org.mortbay.jetty.bio.SocketConnector;
import org.mortbay.jetty.handler.ContextHandler;
import org.mortbay.jetty.handler.ContextHandlerCollection;
import org.mortbay.jetty.servlet.HashSessionIdManager;
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
     * @param root  the initial scriptpath to load scripts from
     * @param main  the initial script to load
     * @return  the newly created server object.
     * @throws Exception  if there was a problem creating the server.
     */
    public static Server startServer(int port, String root, String main) throws Exception {

        Server server = new Server();
        
        SocketConnector connector = new SocketConnector();
        connector.setPort(port);
        
        server.setConnectors (new Connector[]{connector});   
        server.setSessionIdManager(new HashSessionIdManager());

        ServletHandler servlet = new ServletHandler();
        ServletHolder holder = 
           servlet.addServletWithMapping("cello.alt.servlet.RhinoServlet", "/");
        holder.setInitParameter("rhino.root", root);
        holder.setInitParameter("rhino.main", main);
        
        ContextHandler context = new ContextHandler();
        context.setContextPath("/");
        context.setResourceBase(".");
        context.setHandler(servlet);
        
        ContextHandlerCollection contexts = new ContextHandlerCollection();
        contexts.addHandler(context);
        server.setHandler(contexts);
        
        return server;
    }
    /**
     * @param args
     */
    public static void main(String[] args) {
        try {
            String flag = null;
            String root = "/javascript/";
            String main = "Main";
            int port = 4500;
            boolean gui = !GraphicsEnvironment.isHeadless();
            for (String arg : args)
                if (flag!=null) {
                    if (flag.equals("-r") || flag.equals("-root"))
                        root = arg;
                    if (flag.equals("-m") || flag.equals("-main"))
                        main = arg;
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
                        System.out.println("    -help             this help (-h)");
                        System.out.println("    -version          version information (-v)");
                        System.out.println("    -root path        set the default script path to path (-r, default /)");
                        System.out.println("    -main script      the initial script to load (-m, default Main)");
                        System.out.println("    -port n           set the http port to n (-p, default 4500)");
                        System.out.println("    -gui              enable gui (default)");
                        System.out.println("    -nogui            disable gui");
                        System.out.println();
                    } else {
                        flag = arg;
                    }
                }
            if (gui) {
                ServerGUI servergui = new ServerGUI(port, root, main);
                servergui.setVisible(true);
                servergui.start();
                
            } else {
                Server server = startServer(port, root, main);
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
