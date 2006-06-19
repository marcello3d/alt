package cello.alt.server;


import org.mortbay.http.HttpContext;
import org.mortbay.http.HttpServer;
import org.mortbay.http.ajp.AJP13Listener;
import org.mortbay.jetty.servlet.ServletHandler;
import org.mortbay.util.InetAddrPort;


public class Server extends Thread {

    private InetAddrPort httpPort = new InetAddrPort(4500);
    private InetAddrPort ajp13Port = new InetAddrPort(8009);
    
    private Server() {
    }
    private static Server server = null;
    
    public static Server getServer() {
        if (server == null)
            server = new Server();
        return server;
    }
    
    private HttpServer http = null;
    private AJP13Listener ajp13 = null;
    private RhinoServer rhino = null;
    
    public RhinoServer getRhinoServer() {
        return rhino;
    }
    
    public void run() {
        try {
            
            // Start HTTP server
            http = new HttpServer();
            http.addListener(httpPort);
            
            
            // Start AJP13 server (for Apache to connect to)
            ajp13 = new AJP13Listener(ajp13Port);
            ajp13.setHttpServer(http);
            ajp13.setRemoteServers(new String[]{"127.0.0.1"});
            
            // Start Rhino server
            
            rhino = new RhinoServer();
            rhino.addScriptPath(".");

            Runtime.getRuntime().addShutdownHook(new Thread() {
                public void run() {
                    try {
                        http.stop(true);
                        ajp13.stop();
                        rhino.stop();
                    } catch (InterruptedException ex) {
                    }
                }
            });
            
            rhino.start();
            
            http.start();
            
            ajp13.start();
            
            HttpContext context = http.addContext("/");

            ServletHandler handler = new ServletHandler();
            handler.addServlet("/*", "cello.alt.server.Servlet");
            
            context.addHandler(handler);
            
            context.start();
            
        } catch (Exception ex) {
            ex.printStackTrace(System.err);
        }
    }
}
