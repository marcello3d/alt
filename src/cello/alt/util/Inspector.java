package cello.alt.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PushbackReader;
import java.io.Reader;
import java.io.StringReader;

import cello.alt.servlet.scripting.JavaScript;

public class Inspector {

    private JavaScript script;
    public Inspector(JavaScript script) throws IOException {
        this.script = script;
        parse();
    }
    
    private void parse() throws IOException {
        Reader r = new BufferedReader(script.getReader());
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
        BufferedReader br = new BufferedReader(new StringReader(comment));
        for (String line : comment.split("\\s*\\n\\s*(\\*\\s*)?"))
            if (line.length()>0) {
                System.out.println("line = "+line);
            }
        System.out.println("]");
    }
    
    

}
