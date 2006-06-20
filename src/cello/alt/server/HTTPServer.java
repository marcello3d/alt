package cello.alt.server;

import org.mortbay.jetty.Connector;
import org.mortbay.jetty.Server;
import org.mortbay.jetty.nio.SelectChannelConnector;
import org.mortbay.jetty.servlet.ServletHandler;
import org.mortbay.jetty.servlet.ServletHolder;

public class HTTPServer {
    
    public static final String VERSION = "HTTPServer v0.01 alpha";
    
    public static Server startServer(int port, String scriptpath) throws Exception {

        Server server = new Server();
        SelectChannelConnector connector = new SelectChannelConnector();
        connector.setPort(port);
        server.setConnectors (new Connector[]{connector});        
        ServletHandler handler=new ServletHandler();

        server.setHandler(handler);
        ServletHolder holder = handler.addServletWithMapping("cello.alt.servlet.RhinoServlet", "/");
        holder.setInitParameter("scriptpath", scriptpath);
        
        server.start();
        
        return server;
    }
    /**
     * @param args
     */
    public static void main(String[] args) {
        try {
            String flag = null;
            String scriptpath = "javascript/";
            int port = 4500;
            boolean gui = true;
            for (String arg : args)
                if (flag!=null) {
                    if (flag.equals("-sp") || flag.equals("-scriptpath"))
                        scriptpath = arg;
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
                        System.out.println("    -port n                 set the http port to n (-p, default 4500)");
                        System.out.println("    -gui                    enable gui (default)");
                        System.out.println("    -nogui                  disable gui");
                        System.out.println();
                    }
                }
            if (gui) {
                ServerGUI servergui = new ServerGUI(port, scriptpath);
                servergui.setVisible(true);
            } else {
                startServer(port, scriptpath);
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
