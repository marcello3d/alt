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

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;

import cello.alt.servlet.js.Module;
import cello.alt.servlet.resource.Resource;
import cello.alt.servlet.resource.ResourceException;

/**
 * Interface defining a module Script used in Rhino.  It provides methods to
 *  check for updates (update method), evaluate the script in a particular
 *  scope, and to add another script as a dependency.
 *     
 * @author Marcello
 *
 */
public interface JavaScript {
    /**
     * Evaluates this script if it was modified. Also evaluates any child 
     *  scripts, if necessary.
     * @param cx  javascript Context
     * @return whether the script was actually updated
     * @throws IOException if there is a problem loading the script.
     */
    public boolean update(Context cx)  throws IOException;
    
    /**
     * Forces this script to be evaluated.
     * @param cx  The JavaScript Context
     * @param scope  The JavaScript Scope
     * @return the result of evaluation
     * @throws IOException if there is a problem loading the script.
     */
    public Object evaluate(Context cx, Scriptable scope) throws IOException;

    
    /**
     * Adds this script as a parent of this object.  This is used to remove
     * children that are no longer dependent.
     * @param parent  the parent JavaScript
     * @param cascadeReload  specifies whether the current script needs to 
     *  reload when the dependency does
     */
    public void addDependency(JavaScript parent, boolean cascadeReload);
    
    
    /**
     * Get the script loader associated with this script. 
     * @return the ScriptLoader
     */
    public ScriptLoader getScriptLoader();
    
    /**
     * Gets a resource relative to this script.  This can be a relative path or
     *  an absolute path starting with /.  This method is similar to 
     *  {@link Class#getResource(java.lang.String)}.
     * 
     * @param path  the path to this 
     * @return  the resource object
     * @throws ResourceException if the resource could not be loaded
     */
    public Resource getResource(String path) throws ResourceException;
    
    /**
     * Returns the last evaluation time for this script
     * @return  the time in ms
     * @see System#currentTimeMillis() 
     */
    public long getEvaluationTime();
    
    /**
     * Returns the script's full name in module.Script format.
     * 
     * @return the script name
     */
    public String getName();
    
    /**
     * Get the script's module.
     * @return the module
     */
    public Module getModule();
    
}