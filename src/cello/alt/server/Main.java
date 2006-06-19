package cello.alt.server;

public class Main {

    /**
     * @param args
     */
    public static void main(String[] args) {

        Server serv = Server.getServer();
        serv.start();
    }

}
