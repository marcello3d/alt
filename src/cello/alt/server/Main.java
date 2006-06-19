package cello.alt.server;

import org.mortbay.jetty.Connector;
import org.mortbay.jetty.Server;
import org.mortbay.jetty.nio.SelectChannelConnector;
import org.mortbay.jetty.servlet.ServletHandler;
import org.mortbay.jetty.servlet.ServletHolder;

public class Main {

    /**
     * @param args
     */
    public static void main(String[] args) {
        try {
            Server server = new Server();
            SelectChannelConnector connector = new SelectChannelConnector();
            connector.setPort(4500);
            server.setConnectors (new Connector[]{connector});        
            ServletHandler handler=new ServletHandler();

            server.setHandler(handler);
            ServletHolder holder = handler.addServletWithMapping("cello.alt.server.RhinoServlet", "/");
            holder.setInitParameter("scriptpath", ".");
            
            server.start();
            server.join();

        } catch (Exception ex) {
            ex.printStackTrace(System.err);
        }
    }

}
