/**
 * 
 */
package cello.alt.servlet.scripting;

import java.io.File;
import java.io.IOException;


public class DirectoryScriptPath implements ScriptPath {
    private File directory;
    public DirectoryScriptPath(File directory) throws IOException {
        if (!directory.isDirectory())
            throw new IOException("DirectoryScriptPath is not a directory!");
        this.directory = directory;
    }
    private File getFile(String name) {
        return new File(directory, name.replace('.','/')+".js");
    }
    public boolean contains(String name) {
        return getFile(name).canRead();
    }
    public Script get(String name) throws IOException {
        return new FileScript(getFile(name));
    }
    public String toString() {
        return "DirectoryScriptPath["+directory+"]";
    }
}