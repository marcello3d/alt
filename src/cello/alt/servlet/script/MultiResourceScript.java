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

package cello.alt.servlet.script;

import java.io.IOException;
import java.util.Set;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;

import cello.alt.servlet.js.Module;
import cello.alt.servlet.resource.Resource;
import cello.alt.servlet.resource.ResourceException;
/**
 * This class is a pseudo-script.  It pretends to be a script that requires all
 *  scripts in its module, and is used when you write require('module.*').
 *  
 * @author Marcello
 *
 */

public class MultiResourceScript implements JavaScript {
    private ScriptLoader loader;
    private String basePath;
    private String moduleName;
    private Module module;
    
    /**
     * Constructs a new MultiResourceScript, using a particular module, and 
     * loader to pull files from.
     *   
     * @param loader the ScriptLoader for this script
     * @param basePath  the base path of this resource path
     * @param moduleName  a dot-separated module basePath (e.g. "module.submodule")
     */
    public MultiResourceScript(ScriptLoader loader, String basePath, 
            String moduleName) {
        this.loader = loader;
        // This should end with a .
        this.moduleName = moduleName.substring(0,moduleName.lastIndexOf('.'));
        if (!basePath.startsWith("/"))
            basePath = "/"+basePath;
        this.basePath = basePath;
    }
    
    /**
     * @return Returns the module.
     */
    public Module getModule() {
        return module;
    }

    /**
     * @param module The module to set.
     */
    public void setModule(Module module) {
        this.module = module;
    }

    /**
     * In this case, the class rereads the directory and rebuilds the dependency 
     *  list from any subscripts in the directory.  Then it calls the super 
     *  checkDependencies method to actually load them.
     * @param cx javascript Context
     * @return true if something was loaded
     */
    public boolean update(Context cx)  {
        // update last modified
        Set<String> paths = loader.getResourcePaths(basePath);
        
        boolean somethingLoaded = false;
        
        for (String path : paths)
            if (path.endsWith(".js"))
                try {
                    // Get the script name
                    String scriptName = moduleName + '.' + 
                               path.substring(path.lastIndexOf('/')+1, 
                                              path.lastIndexOf('.'));
                    // Load the script and try to get a dependency
                    JavaScript s = getScriptLoader().loadScript(scriptName);
                    s.update(cx);
                    if (evaluationTime < s.getEvaluationTime())
                        evaluationTime = s.getEvaluationTime();
                } catch (ScriptNotFoundException ex) {
                    ex.printStackTrace(System.err);
                    continue;
                } catch (IOException ex) {
                    ex.printStackTrace(System.err);
                    continue;
                }
        return somethingLoaded;
    }

    
    private long evaluationTime = 0;
    /**
     * @see JavaScript#getEvaluationTime()
     */
    public long getEvaluationTime() {
        return evaluationTime;
    }

    /**
     * @see java.lang.Object#hashCode()
     */
    @Override
    public int hashCode() {
        return loader.hashCode()+basePath.hashCode();
    }
    /**
     * @see java.lang.Object#equals(java.lang.Object)
     */
    @Override
    public boolean equals(Object o) {
        return o instanceof MultiResourceScript &&
                basePath.equals(((MultiResourceScript)o).basePath);
    }
    /**
     * Returns the string representation of this object
     * @return the string representation
     */
    @Override
    public String toString() {
        return "MultiResourceScript["+loader+","+basePath+"]";
    }

    /**
     * Does nothing
     * @see JavaScript#addDependency(JavaScript, boolean)
     */
    public void addDependency(JavaScript parent, boolean cascadeReload) {
        // does nothing
    }

    /**
     * Does nothing
     * @see JavaScript#evaluate(Context, Scriptable)
     */
    public Object evaluate(Context cx, Scriptable scope) {
        return null;
    }

    /**
     * @see JavaScript#getName()
     */
    public String getName() {
        return moduleName;
    }

    /**
     * @see JavaScript#getResource(java.lang.String)
     */
    public Resource getResource(String path) throws ResourceException {
        throw new ResourceException("Cannot load resources from this object");
    }

    /**
     * @see JavaScript#getScriptLoader()
     */
    public ScriptLoader getScriptLoader() {
        return loader;
    }

}