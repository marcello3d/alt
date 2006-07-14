package cello.alt.server;

import java.awt.GraphicsEnvironment;

import org.mortbay.jetty.Connector;
import org.mortbay.jetty.Server;
import org.mortbay.jetty.bio.SocketConnector;
import org.mortbay.jetty.handler.ContextHandler;
import org.mortbay.jetty.handler.ContextHandlerCollection;
import org.mortbay.jetty.servlet.ServletHandler;
import org.mortbay.jetty.servlet.ServletHolder;
import org.mortbay.jetty.servlet.SessionHandler;

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
     * @param host  the host:port to listen on
     * @param root  the initial scriptpath to load scripts from
     * @param main  the initial script to load
     * @return  the newly created server object.
     * @throws Exception  if there was a problem creating the server.
     */
    public static Server startServer(String host, String root, String main) throws Exception {

        
        Server server = new Server();
        
        SocketConnector connector = new SocketConnector();
        int colon = host.lastIndexOf(':');
        if (colon<0)
            connector.setPort(Integer.parseInt(host));
        else
        {
            connector.setHost(host.substring(0,colon));
            connector.setPort(Integer.parseInt(host.substring(colon+1)));
        }
        server.setConnectors(new Connector[]{connector});
        
        server.setConnectors (new Connector[]{connector});   

        // Make servlet
        ServletHandler servlet = new ServletHandler();
        ServletHolder holder = 
            servlet.addServletWithMapping("cello.alt.servlet.RhinoServlet", "/");
        holder.setInitParameter("rhino.root", root);
        holder.setInitParameter("rhino.main", main);
        
        // Make session handler
        SessionHandler session = new SessionHandler();
        session.setHandler(servlet);

        // Make context handler
        ContextHandler context = new ContextHandler();
        context.setContextPath("/");
        context.setResourceBase(".");
        
        context.setHandler(session);
        

        // Add handler
        ContextHandlerCollection contexts = new ContextHandlerCollection();
        contexts.addHandler(context);
        server.setHandler(contexts);
        
        return server;
        
        
        
        
        
        /*
        

        
        // Create the server
        Server server = new Server();
        ContextHandlerCollection contexts = new ContextHandlerCollection();
        server.setHandler(contexts);
        
        SocketConnector connector = new SocketConnector();
        int colon = host.lastIndexOf(':');
        if (colon<0)
            connector.setPort(Integer.parseInt(host));
        else
        {
            connector.setHost(host.substring(0,colon));
            connector.setPort(Integer.parseInt(host.substring(colon+1)));
        }
        server.setConnectors(new Connector[]{connector});
        
        if (args.length<3)
        {
            ContextHandler context = new ContextHandler();
            context.setContextPath("/");
            context.setResourceBase(args.length==1?".":args[1]);
            ServletHandler servlet = new ServletHandler();
            servlet.addServletWithMapping("org.mortbay.jetty.servlet.DefaultServlet", "/");
            context.setHandler(servlet);
            contexts.addHandler(context);
        }
        else if ("-webapps".equals(args[1]))
        {
            WebAppContext.addWebApplications(server, args[2], WebAppContext.WEB_DEFAULTS_XML, true, true);
        }
        else if ("-webapp".equals(args[1]))
        {
            WebAppContext webapp = new WebAppContext();
            webapp.setResourceBase(args[2]);
            webapp.setContextPath("/");
            contexts.addHandler(webapp);
            
        }
            
        server.start();
        
        */
        
        
        
        
        
        
        
        
        
        
    }
    /**
     * @param args
     */
    public static void main(String[] args) {
        try {
            String flag = null;
            String root = "/javascript/";
            String main = "Main";
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
    private static String getVersion(Class c) {
        Package p = c.getPackage();
        return p.getImplementationTitle()+" "+p.getImplementationVersion();
    }

}
