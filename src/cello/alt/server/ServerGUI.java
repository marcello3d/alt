package cello.alt.server;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Container;
import java.awt.Dimension;
import java.awt.Event;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.KeyEvent;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintStream;
import java.nio.channels.Channels;
import java.nio.channels.Pipe;

import javax.swing.AbstractAction;
import javax.swing.Action;
import javax.swing.BorderFactory;
import javax.swing.InputMap;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JEditorPane;
import javax.swing.JFormattedTextField;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.JToolBar;
import javax.swing.KeyStroke;
import javax.swing.UIManager;
import javax.swing.text.DefaultEditorKit;
import javax.swing.text.Document;
import javax.swing.text.MutableAttributeSet;
import javax.swing.text.SimpleAttributeSet;
import javax.swing.text.StyleConstants;

import org.mortbay.jetty.Server;

/**
 * The ServerGUI is a simple graphical shell for running the HTTPServer class. 
 * 
 * @author Marcello
 */
public class ServerGUI extends JFrame {

    private static final long serialVersionUID = -8748896100821559082L;

    private JFormattedTextField portField;
    private JTextField scriptpathField;
    private JTextField entryPointField;
    private JEditorPane console;
    private Server server = null;
    
    /**
     * Constructs a new ServerGUI
     * 
     * @param port default port
     * @param scriptpath  default scriptpath
     * @param entryPoint the entry point javascript file
     */
    public ServerGUI(int port, String scriptpath, String entryPoint) {
        super(HTTPServer.VERSION);

        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception e) {
            // do nothing
        }
        Container c = getContentPane();
        
        c.setLayout(new BorderLayout());
        
        portField = new JFormattedTextField(port);
        scriptpathField = new JTextField(scriptpath);
        entryPointField = new JTextField(entryPoint);
        
        c.add(makeToolbar(), BorderLayout.NORTH);
        c.add(makeConsole(), BorderLayout.CENTER);
        
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        

        try {
            // Create reader threads
            RerouteThread rtout = new RerouteThread(System.out,Color.BLACK);
            System.setOut(rtout.getPrintStream());
            rtout.start();
            
            RerouteThread rterr = new RerouteThread(System.err,Color.RED);
            System.setErr(rterr.getPrintStream());
            rterr.start();

        } catch (IOException ex) {
            
            ex.printStackTrace();
        }
        
        
        this.pack();

    }
    private JComponent makeToolbar() {
        JToolBar tb = new JToolBar();
        
        JLabel label;
        label = new JLabel("Port:");
        label.setBorder(BorderFactory.createEmptyBorder(2,2,2,2));
        tb.add(label);
        tb.add(portField);
        label = new JLabel("ScriptPath:");
        label.setBorder(BorderFactory.createEmptyBorder(2,2,2,2));
        tb.add(label);
        tb.add(scriptpathField);
        label = new JLabel("Entry point:");
        label.setBorder(BorderFactory.createEmptyBorder(2,2,2,2));
        tb.add(label);
        tb.add(entryPointField);
        JButton button = new JButton(new StartStopAction());
        tb.add(button);
        
        return tb;
    }

    private JComponent makeConsole() {
        
        
        console = new JEditorPane("text/html","");
        console.setFont(new Font("monospaced",Font.PLAIN,12));
        console.setEditable(false);
        console.setPreferredSize(new Dimension(600,400));
        InputMap im = console.getInputMap();
        im.put(KeyStroke.getKeyStroke(KeyEvent.VK_C, Event.CTRL_MASK),
                DefaultEditorKit.copyAction);
        
        return new JScrollPane(console);
    }
    private class StartStopAction extends AbstractAction {

        private static final long serialVersionUID = 2620665521873088102L;
        /**
         * 
         */
        private StartStopAction() {
            super("Start Server");
        }
        
        /**
         * @see java.awt.event.ActionListener#actionPerformed(java.awt.event.ActionEvent)
         */
        public void actionPerformed(ActionEvent ev) {
            boolean starting = true;
            try {
                if (server==null) {
                    System.out.println("Attempting to start server on port "+portField.getValue()+"...");
                    System.out.flush();
                    server = HTTPServer.startServer(
                            (Integer)portField.getValue(),
                            scriptpathField.getText(), 
                            entryPointField.getText()
                           );
                    server.start();
                    this.putValue(Action.NAME, "Stop Server");
                } else {
                    starting = false;
                    System.out.println("Stopping server...");
                    System.out.flush();
                    server.stop();
                    server = null;
                    this.putValue(Action.NAME, "Start Server");
                }
            } catch (Exception ex) {
                System.err.println("Exception "+(starting?"starting":"stopping")+" server:");
                ex.printStackTrace(System.err);
            }
        }
    }
    
    
    /**
     * This class takes a PrintStream and "tees" it to the graphical console
     * @author Marcello
     */
    // Modified from http://javaalmanac.com/egs/javax.swing.text/ta_Console.html
    private class RerouteThread extends Thread {
        private InputStream pi;
        private OutputStream po;
        private PrintStream oldOut;
        private MutableAttributeSet mas;

        /**
         * Constructs a new RerouteThread object
         * @param oldOut
         * @param color
         * @throws IOException
         */
        private RerouteThread(PrintStream oldOut, Color color) 
                throws IOException {
            this.oldOut = oldOut;
            
            Pipe pipe = Pipe.open();
            pi = Channels.newInputStream(pipe.source());
            po = Channels.newOutputStream(pipe.sink());
            
            this.mas = new SimpleAttributeSet();
            StyleConstants.setForeground(mas, color);
            StyleConstants.setFontFamily(mas, "monospaced");
        }
        private PrintStream getPrintStream() {
            return new PrintStream(po,true);
        }

        /**
         * Thread execution
         */
        @Override
        public void run() {
            byte[] buf = new byte[1024];
            try {
                while (true) {
                    int len = pi.read(buf);
                    if (len == -1)
                        break;
                    

                    synchronized (console) {
                        String str = new String(buf, 0, len);
                        oldOut.print(str);
                        
                        Document d = console.getDocument();
                        d.insertString(d.getLength(), str, mas);                    
                        
                        // Make sure the last line is always visible
                        console.setCaretPosition(d.getLength());
    
                        // Keep the text area down to a certain character size
                        int idealSize = 1024*100;
                        int maxExcess = idealSize / 100;
                        int excess = d.getLength() - idealSize;
                        if (excess >= maxExcess)
                            d.remove(0,excess);
                    }
                }   
            } catch (Exception ex) {
                ex.printStackTrace(oldOut);
            }
        }
    }

}
