package cello.alt.server;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Servlet extends HttpServlet {

    /** To satisfy Eclipse warning */
    private static final long serialVersionUID = 8016265161336296740L;

    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Server s = Server.getServer();
        s.getRhinoServer().queueService(req,resp);
    }


}
