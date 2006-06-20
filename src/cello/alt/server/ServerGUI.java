package cello.alt.server;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Container;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.io.IOException;
import java.io.PipedInputStream;
import java.io.PipedOutputStream;
import java.io.PrintStream;

import javax.swing.AbstractAction;
import javax.swing.JComponent;
import javax.swing.JEditorPane;
import javax.swing.JFormattedTextField;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.JToggleButton;
import javax.swing.JToolBar;
import javax.swing.text.Document;
import javax.swing.text.MutableAttributeSet;
import javax.swing.text.SimpleAttributeSet;
import javax.swing.text.StyleConstants;

import org.mortbay.jetty.Server;

public class ServerGUI extends JFrame {

    private static final long serialVersionUID = -8748896100821559082L;

    private JFormattedTextField portField;
    private JTextField scriptpathField;
    private JEditorPane console;
    private Server server = null;
    
    private PrintStream oldOut;
    
    public ServerGUI(int port, String scriptpath) {
        super("HTTPServer");
        
        Container c = getContentPane();
        
        c.setLayout(new BorderLayout());
        
        portField = new JFormattedTextField(port);
        scriptpathField = new JTextField(scriptpath);
        
        c.add(makeToolbar(), BorderLayout.NORTH);
        c.add(makeConsole(), BorderLayout.CENTER);
        
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        try {
            oldOut = System.out;
            // Set up System.out
            piOut = new PipedInputStream();
            poOut = new PipedOutputStream(piOut);
            System.setOut(new PrintStream(poOut, true));
    
            // Set up System.err
            piErr = new PipedInputStream();
            poErr = new PipedOutputStream(piErr);
            System.setErr(new PrintStream(poErr, true));

            // Create reader threads
            new ReaderThread(piOut,Color.BLACK).start();
            new ReaderThread(piErr,Color.RED).start();
        } catch (IOException ex) {
            
            ex.printStackTrace();
        }
        
        
        this.pack();

    }
    private JComponent makeToolbar() {
        JToolBar tb = new JToolBar();
        
        tb.add(new JLabel("Port:"));
        tb.add(portField);
        tb.add(new JLabel("Scriptpath:"));
        tb.add(scriptpathField);
        tb.add(new JToggleButton(new StartStopAction()));
        
        return tb;
    }

    private JComponent makeConsole() {
        
        
        console = new JEditorPane("text/html","");
        console.setFont(new Font("monospaced",Font.PLAIN,12));
        console.setEditable(false);
        console.setPreferredSize(new Dimension(600,400));
        
        return new JScrollPane(console);
    }
    private class StartStopAction extends AbstractAction {

        private static final long serialVersionUID = 2620665521873088102L;
        public StartStopAction() {
            super("Start Server");
        }
        public void actionPerformed(ActionEvent ev) {
            try {
                if (server==null) {
                    System.out.println("Attempting to start server on port "+portField.getValue()+"...");
                    server = HTTPServer.startServer(
                            (Integer)portField.getValue(),
                            scriptpathField.getText());
                } else {
                    System.out.println("Stopping server...");
                    server.stop();
                    server = null;
                }
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(ServerGUI.this,
                        "Error! "+ex,
                        ServerGUI.this.getTitle(),
                        JOptionPane.ERROR_MESSAGE);
                
            }
        }
    }
    
    
    // Borrowed from http://javaalmanac.com/egs/javax.swing.text/ta_Console.html
    private PipedInputStream piOut;
    private PipedInputStream piErr;
    private PipedOutputStream poOut;
    private PipedOutputStream poErr;

    class ReaderThread extends Thread {
        private PipedInputStream pi;
        private MutableAttributeSet mas;

        ReaderThread(PipedInputStream pi, Color color) {
            this.pi = pi;
            this.mas = new SimpleAttributeSet();
            StyleConstants.setForeground(mas, color);
            StyleConstants.setFontFamily(mas, "monospaced");
        }

        public void run() {
            byte[] buf = new byte[1024];
            try {
                while (true) {
                    final int len = pi.read(buf);
                    if (len == -1)
                        break;
                    
                    String str = new String(buf, 0, len);
                    oldOut.print(str);
                    
                    Document d = console.getDocument();
                    d.insertString(d.getLength(), str, mas);                    
                    
                    // Make sure the last line is always visible
                    console.setCaretPosition(d.getLength());

                    // Keep the text area down to a certain character size
                    int idealSize = 1000;
                    int maxExcess = 500;
                    int excess = d.getLength() - idealSize;
                    if (excess >= maxExcess)
                        d.remove(0,excess);
                }
            } catch (Exception ex) {
                ex.printStackTrace(oldOut);
            }
        }
    }

}
