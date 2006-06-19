package cello.alt.server.scripting;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;

public class JarScriptPath implements ScriptPath {
    
    private File file;
    private ZipFile zipFile;
    
    private long lastModified = 0;
    
    /**
     * Constructs a new JarScriptPath
     * @param file
     * @throws IOException
     */
    public JarScriptPath(File file) throws IOException {
        this.file = file;
        openZip();
    }
    
    /**
     * Loads the zip file for reading if it needs to be.
     * @throws IOException
     */
    private void openZip() throws IOException {
        if (zipFile!=null && !isModified()) return;
        lastModified = file.lastModified();
        this.zipFile = new ZipFile(file);
    }
    /**
     * Closes the zip file from reading (releases locks and whatnot).
     * @throws IOException
     */
    private void closeZip() throws IOException {
        if (zipFile!=null)
            zipFile.close();
        zipFile = null;
    }
    
    /**
     * Returns whether ot not the file has been modified.
     * @return  true if the file was modified
     */
    private boolean isModified() {
        return lastModified != file.lastModified();
    }
    /**
     * Converts a script name to a path
     * @param name script name
     * @return
     */
    private String getPath(String name) {
        return name.replace('.','/')+".js";
    }
    /**
     * Gets a particular ZipEntry, loading and closing the zip file as 
     * necessary.
     * @param path  the path to the file
     * @return the ZipEntry for that file.
     */
    private ZipEntry getEntry(String path) throws IOException {
        try {
            openZip();
            return zipFile.getEntry(path);
        } finally {
            try {
                closeZip();
            } catch (IOException ex) {
                // do nothing.
            }
        }
    }

    /**
     * Returns whether or not this jar/zip file contains the specified script.
     * @param name the name of the script
     * @return true if the jar file contains the script
     */
    public boolean contains(String name) {
        try {
            return getEntry(getPath(name)) != null;
        } catch (IOException ex) {
            return false;
        }
    }

    /**
     * Returns a specified script fromt he jar/zip file.  
     * @param name the name of the script
     * @return the Script
     * @throws IOException if there was a problem getting the script
     */
    public Script get(String name) throws IOException {
        return new JarScript(getPath(name));
    }

    /**
     * Returns a string representation of this JarScriptPath.
     */
    @Override
    public String toString() {
        return "JarScriptPath["+file+"]";
    }

    /**
     * A Script wrapper for this JarScriptPath.
     *   
     * @author Marcello
     *
     */
    private class JarScript extends AbstractScript {
        private String path;
        private long lastModified = 0;
        private JarScript(String path) {
            this.path = path;
        }
        /**
         * Evaluates the script from within the jar file.
         */
        @Override
        protected void doevaluate(Context cx, Scriptable scope) throws IOException {
            // update last modified
            openZip();
            lastModified = JarScriptPath.this.lastModified;
            // evaluate
            InputStream is = zipFile.getInputStream(zipFile.getEntry(path));
            cx.evaluateReader(scope,new InputStreamReader(is),file.getPath()+"!"+path,1,null);
            closeZip();
        }

        /**
         * Returns whether or not this JarScript has been modified.
         */
        @Override
        protected boolean isModified() {
            return lastModified != file.lastModified();
        }
        /**
         * Returns a string representation of this JarScript
         */
        @Override
        public String toString() {
            return "JarScript["+file+"!"+path+"]";
        }
        
    }

}
