/*
 *  Copyright (C) 2005-2006 Marcello Bastéa-Forte and Cellosoft
 * 
 * This software is provided 'as-is', without any express or implied warranty.
 * In no event will the authors be held liable for any damages arising from the
 * use of this software.
 * 
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 * 
 * 1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 * 2. Altered source versions must be plainly marked as such, and must not be
 *    misrepresented as being the original software.
 * 3. This notice may not be removed or altered from any source distribution.
 */

package cello.alt.server;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Container;
import java.awt.Dimension;
import java.awt.Event;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintStream;
import java.nio.channels.Channels;
import java.nio.channels.Pipe;
import java.util.Properties;

import javax.swing.AbstractAction;
import javax.swing.Action;
import javax.swing.BorderFactory;
import javax.swing.InputMap;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JEditorPane;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
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

import cello.alt.servlet.AltServlet;

/**
 * The ServerGUI is a simple graphical shell for running the HTTPServer class. 
 * 
 * @author Marcello
 */
public class ServerGUI extends JFrame  {

    private static final long serialVersionUID = -8748896100821559082L;

    private JTextField hostField;
    private JTextField rootField;
    private JTextField mainField;
    private JEditorPane console;
    private File preferenceFile;
    private Properties properties;
    private Server server = null;
    private StartStopAction startStopAction = null;
    
    /**
     * Constructs a new ServerGUI
     * 
     * @param host default host:port
     * @param root  default scriptpath
     * @param main the entry point javascript file
     */
    public ServerGUI(String host, String root, String main) {
        super(HTTPServer.NAME_VERSION+" - "+AltServlet.NAME_VERSION);

        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception e) {
            // do nothing
        }
        Container c = getContentPane();
        
        c.setLayout(new BorderLayout());
        
        preferenceFile = new File("servergui.properties");
      
        properties = new Properties();
        
        
        if (preferenceFile.exists())
        	try {
	        	loadPreferences();
			} catch (IOException ie) {
				System.err.println( "Error loading configuration: " + ie);
			}
        
        hostField = new JTextField(properties.getProperty("host", host));
        rootField = new JTextField(properties.getProperty("root", root));
        mainField = new JTextField(properties.getProperty("main", main));
        
        startStopAction = new StartStopAction();
        
        c.add(makeToolbar(), BorderLayout.NORTH);
        c.add(makeConsole(), BorderLayout.CENTER);
        
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
       
        addWindowListener(new WindowAdapter(){
        	@Override
			public void windowClosing(WindowEvent e) {
        		try {
        			savePreferences();
	    		} catch (IOException ie) {
	    			System.err.println("Error saving configuration: " + ie);
	    		}
        	}
        });

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
    /**
     * Starts the server
     *
     */
    public void start() {
        // First time login or no existing preference file (Wizard)
    	if (!preferenceFile.exists()) {   
        	// Option Box asking for Port Number 
			String s = (String)JOptionPane.showInputDialog(this, 
					"Enter Port Number and Click 'OK' to Start Server", 
					"Port Number Entry", JOptionPane.PLAIN_MESSAGE, null, null, 
					properties.getProperty("host", "4500"));
			if ((s != null) && (s.length() > 0))
				hostField.setText(s);
        }
    	// If on then auto start
    	if (properties.getProperty("server_state","on").equals("on"))  
    		startStopAction.actionPerformed(new ActionEvent(this,0,null));
   }
    
    private void savePreferences() throws IOException {
    	properties.setProperty("host", hostField.getText());
        properties.setProperty("root", rootField.getText());
        properties.setProperty("main", mainField.getText());
    	properties.setProperty("server_state", server==null ? "off" : "on");
		properties.store(new FileOutputStream(preferenceFile), 
				"Alt Framework Server GUI configuration");
    }
    
    private void loadPreferences() throws IOException {
        properties.load(new FileInputStream(preferenceFile));
    }
    private JComponent makeToolbar() {
        JToolBar tb = new JToolBar();
        
        JLabel label;
        String desc;
        
        desc = "The port to listen on.";
        label = new JLabel("Port:");
        label.setBorder(BorderFactory.createEmptyBorder(2,2,2,2));
        label.setToolTipText(desc);
        hostField.setToolTipText(desc);
        tb.add(label);
        tb.add(hostField);
        
        
        desc = "The root directory to look for scripts.";
        label = new JLabel("rhino.root:");
        label.setBorder(BorderFactory.createEmptyBorder(2,2,2,2));
        label.setToolTipText(desc);
        rootField.setToolTipText(desc);
        tb.add(label);
        tb.add(rootField);
        
        desc = "The script to load with every page request.";
        label = new JLabel("rhino.main:");
        label.setBorder(BorderFactory.createEmptyBorder(2,2,2,2));
        label.setToolTipText(desc);
        mainField.setToolTipText(desc);
        tb.add(label);
        tb.add(mainField);
        
        JButton button = new JButton(startStopAction);
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
         * @see ActionListener#actionPerformed(java.awt.event.ActionEvent)
         */
        public void actionPerformed(ActionEvent ev) {
            boolean starting = true;
            try {
                if (server==null) {
                    System.out.println("Attempting to start server on "+ 
                    		hostField.getText()+"...");
                    System.out.flush();
                    server = HTTPServer.startServer(
                            hostField.getText(),
                            rootField.getText(), 
                            mainField.getText()
                           );
                    server.start();
                    this.putValue(Action.NAME, "Stop Server");
                    System.out.flush();
                    System.err.flush();
                    System.out.println("\nStarted server.");
                } else {
                    starting = false;
                    System.out.println("Stopping server...");
                    System.out.flush();
                    server.stop();
                    server = null;
                    System.out.flush();
                    System.err.flush();
                    this.putValue(Action.NAME, "Start Server");
                    System.out.println("Stopped server.");
                }
            } catch (Exception ex) {
                if (starting)
                    server = null;
                System.err.println("Exception "+(starting?"starting":"stopping")
                		+" server:");
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
