/**
 * 
 */
package cello.alt.server.scripting;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;

import cello.alt.server.RhinoServer;

public class FileScript extends AbstractScript {
    private File file;
    private long lastModified = 0;
    public FileScript(File file) throws IOException {
        if (!file.canRead())
            throw new IOException("Cannot read "+file);
        this.file = file;
    }
    public boolean load(Context cx, Scriptable scope) throws IOException {

        System.out.println("Checking "+this+"...");
        // If file has not been modified, check parents, if none of them 
        //  updated, then return false.
        if (!isModified())
            if (!checkParents(cx,scope))
                return false;
        
        reload(cx, scope);
        return true;
    }
    public void reload(Context cx, Scriptable scope) throws IOException {
        System.out.println("Loading "+this+"...");
        // Set current script
        Script previousScript = RhinoServer.setCurrentScript(cx,this);
        
        // Clear previous requires (so we can remove children if necessary) 
        resetParents();
        
        // update last modified
        lastModified = file.lastModified();
        
        // Load file
        cx.evaluateReader(scope,new FileReader(file),file.getPath(),1,null);
        
        // Unhook orphaned parents
        synchronizeParents();
        
        // Restore previous current script
        RhinoServer.setCurrentScript(cx,previousScript);

        // Reload child classes
        //reloadChildren(cx, scope);
    }
    public boolean isModified() {
        return lastModified != file.lastModified();
    }
    public int hashCode() {
        return file.hashCode();
    }
    public boolean equals(Object o) {
        return o instanceof FileScript &&
                file.equals(((FileScript)o).file);
    }
    public String toString() {
        return "FileScript["+file+"]";
    }
}