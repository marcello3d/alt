/**
 * 
 */
package cello.alt.server.scripting;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;

public class FileScript extends AbstractScript {
    private File file;
    private long lastModified = 0;
    public FileScript(File file) throws IOException {
        if (!file.canRead())
            throw new IOException("Cannot read "+file);
        this.file = file;
    }
    protected void doevaluate(Context cx, Scriptable scope) throws IOException {
        // update last modified
        lastModified = file.lastModified();
        
        // Load file
        FileReader reader = new FileReader(file);
        cx.evaluateReader(scope,reader,file.getPath(),1,null);
        reader.close();
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