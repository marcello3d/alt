/**
 * 
 */
package cello.alt.servlet.scripting;

import java.io.File;
import java.io.IOException;
import java.io.Reader;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;
/**
 * This class is a pseudo-script.  It pretends to be a script that requires all
 *  scripts in its module, and is used when you write require('module.*').
 *  
 * @author Marcello
 *
 */

public class DirectoryScript implements JavaScript {
    private ScriptLoader loader;
    private String moduleName;
    private File directory;
    private long lastModified = 0;
    private int fileCount = 0;
    
    /**
     * Constructs a new DirectoryScript, using a particular module, and a
     *  directory to look for scripts in.
     *   
     * @param loader the ScriptLoader for this script
     * @param moduleName  a dot-separated module path (e.g. "module.submodule")
     * @param directory  a link to the filesystem folder to look inside 
     * @throws IOException  if the directory is not actually a directory
     */
    public DirectoryScript(ScriptLoader loader, String moduleName, 
            File directory) throws IOException {
        if (!directory.isDirectory())
            throw new IOException(directory+" is not a directory");

        this.loader = loader;
        // This should end with a .
        this.moduleName = moduleName;
        this.directory = directory;
    }
    
    /**
     * In this case, the class rereads the directory and rebuilds the dependency 
     *  list from any subscripts in the directory.  Then it calls the super 
     *  checkDependencies method to actually load them.
     * @param cx javascript Context
     * @param global  the global Object
     * @return true if something was loaded
     */
    public boolean update(Context cx, GlobalScope global)  {
        if (fileCount>0 && (!AbstractJavaScript.AUTO_UPDATES || !isModified())) 
            return false;
        // update last modified
        lastModified = directory.lastModified();
        fileCount = directory.list().length;
        
        boolean somethingLoaded = false;
        
        for (String name : directory.list()) {
            System.out.println (this+" looking at "+name);
            if (name.endsWith(".js"))
                try {
                    // Get the script name
                    String scriptName = moduleName + 
                                      name.substring(0, name.lastIndexOf('.'));
                    // Load the script and try to get a dependency
                    JavaScript s = getScriptLoader().loadScript(scriptName);
                    s.update(cx, global);
                    if (evaluationTime < s.getEvaluationTime())
                        evaluationTime = s.getEvaluationTime();
                } catch (ScriptNotFoundException ex) {
                    ex.printStackTrace(System.err);
                    continue;
                } catch (IOException ex) {
                    ex.printStackTrace(System.err);
                    continue;
                }
        }
        return somethingLoaded;
    }

    
    private long evaluationTime = 0;
    /**
     * @see cello.alt.servlet.scripting.JavaScript#getEvaluationTime()
     */
    public long getEvaluationTime() {
        return evaluationTime;
    }

    /**
     * @see cello.alt.servlet.scripting.JavaScript#getReader()
     */
    public Reader getReader() {
        return null;
    }


    /**
     * Checks if the directory has been modified (files added/removed).
     *  Currently this is only checked by the last modification date on the 
     *  directory, and if that is the same (I do not believe windows updates 
     *  this value for directories when a file is added/removed), the number of 
     *  files in the directory.
     *  
     * @return true if the directory has been modified.
     */
    public boolean isModified() {
        return lastModified != directory.lastModified() ||
            fileCount != directory.list().length;
    }
    /**
     * @see java.lang.Object#hashCode()
     */
    @Override
    public int hashCode() {
        return directory.hashCode();
    }
    /**
     * @see java.lang.Object#equals(java.lang.Object)
     */
    @Override
    public boolean equals(Object o) {
        return o instanceof DirectoryScript &&
                directory.equals(((DirectoryScript)o).directory);
    }
    /**
     * Returns the string representation of this object
     * @return the string representation
     */
    @Override
    public String toString() {
        return "DirectoryScript["+directory+"]";
    }

    /**
     * Does nothing
     * @see cello.alt.servlet.scripting.JavaScript#addDependency(JavaScript, boolean)
     */
    public void addDependency(JavaScript parent, boolean cascadeReload) {
        // does nothing
    }

    /**
     * Does nothing
     * @see cello.alt.servlet.scripting.JavaScript#evaluate(Context, Scriptable)
     */
    public Object evaluate(Context cx, Scriptable scope) {
        return null;
    }

    /**
     * @see cello.alt.servlet.scripting.JavaScript#getName()
     */
    public String getName() {
        return moduleName;
    }

    /**
     * @see cello.alt.servlet.scripting.JavaScript#getScriptLoader()
     */
    public ScriptLoader getScriptLoader() {
        return loader;
    }

}