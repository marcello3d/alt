package cello.alt.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.Reader;

import cello.alt.servlet.scripting.JavaScript;

/**
 * Scans a JavaScript file and finds methods and stuff.  Grossly incomplete.
 * Probably should use some rhino internals, but I have not found any good 
 * methods for doing such. 
 * @author Marcello
 *
 */
public class Inspector {

    /**
     * Constructs a new Inspector object and parses the script
     * @param reader reader
     * @throws IOException
     */
    public Inspector(Reader reader) throws IOException {
        parse(reader);
    }
    
    private void parse(Reader reader) throws IOException {
        Reader r = new BufferedReader(reader);
        int i;
        String comment = null;
        while ((i = r.read()) > 0) {
            char c = (char)i;
            if (comment == null) {
                if (c == '/' && r.read() == '*' && r.read() == '*') {
                    // Start new comment
                    comment = "";
                } 
                // else skip
            } else {
                if (c=='*') {
                    i=r.read();
                    if (i<0)
                        throw new IOException("Unexpected EOF");
                    c = (char)i;
                    if (c == '/') {
                        parseComment(r,comment);
                        comment = null;
                    } else {
                        comment += "*"+c;
                    }
                } else {
                    comment += c;
                }                    
            }
        }
    }
    private void parseComment(Reader r, String comment) {
        System.out.println("Parse comment [");
        //BufferedReader br = new BufferedReader(new StringReader(comment));
        for (String line : comment.split("\\s*\\n\\s*(\\*\\s*)?"))
            if (line.length()>0) {
                System.out.println("line = "+line);
            }
        System.out.println("]");
    }
    

}
