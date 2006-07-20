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

package cello.alt.servlet.js;

import org.mozilla.javascript.ScriptableObject;

import cello.alt.servlet.RhinoServlet;

/**
 * Root Module object overrides some functionality of regular Modules.
 * 
 * @author Marcello
 */
public class RootModule extends Module {

    private static final long serialVersionUID = -6648201327847241789L;
    private GlobalScope globalScope = null;

    /**
     * Constructs a new root module.
     * @param globalScope the prototype of this module
     */
    public RootModule(GlobalScope globalScope) {
        this.globalScope = globalScope;
        setPrototype(globalScope);
        // Create a self-pointer
        defineProperty("module", this, RhinoServlet.PROTECTED);
    }

    /**
     * Adds the specified module as a child to this module.
     * @param module
     */
    @Override
    protected void addChild(Module module) {
        // Add to global
        globalScope.defineProperty(module.getName(), module, 
                RhinoServlet.VISIBLE);
    }
    /**
     * @see ScriptableObject#getClassName()
     */
    @Override
    public String getClassName() {
        return "Root Module";
    }
    
    /**
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        return "Root Module";
    }
    
}
