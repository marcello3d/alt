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

import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

import cello.alt.servlet.AltServlet;

/**
 * 
 * 
 * @author Marcello
 *
 */
public class Module extends ScriptableObject {

    
    /**
     * 
     */
    private static final long serialVersionUID = 2669719978061260093L;
    private Module parent = null;
    private String name = null;
    private String fullName = null;

    /**
     * Constructs an empty Module object.
     */
    protected Module() {
        // do nothing
    }
    
    /**
     * Constructs a child module
     * @param parent the parent Module
     * @param name  the name of this module
     */
    public Module(Module parent, String name) {
        this(parent.getPrototype(), parent, name);
    }
    
    /**
     * Constructs a child module
     * @param prototype the prototype of this module
     * @param parent the parent Module
     * @param name  the name of this module
     */
    protected Module(Scriptable prototype, Module parent, String name) {
        super(parent,prototype);
        this.parent = parent;
        this.name = name;

        // Get full module name based on parent's full name 
        this.fullName = (parent instanceof RootModule) ? name :
            parent.getFullName() + '.' +  name;
        
        // Create a self-pointer
        defineProperty("module", this, AltServlet.PROTECTED);
        defineProperty("parent", parent, AltServlet.PROTECTED);
        
        parent.addChild(this);
    }
    
    /**
     * Adds the specified module as a child to this module.
     * @param module
     */
    protected void addChild(Module module) {
        // Add the child scope as a member of the parent
        defineProperty(module.getName(), module, AltServlet.VISIBLE);
    }

    /**
     * @see org.mozilla.javascript.ScriptableObject#getClassName()
     */
    @Override
    public String getClassName() {
        return "Module "+getFullName();
    }
    
    /**
     * Returns the name of this module (if there is one).
     * @return  the name
     */
    public String getName() {
        return name;
    }
    /**
     * Returns the name of this module (if there is one).
     * @return  the name
     */
    public String getFullName() {
        return fullName;
    }
    
    /**
     * Get the parent module of this module (or null)
     * @return the module
     */
    public Module getParent() {
        return parent;
    }
    
    /**
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        return "Module["+getFullName()+"]";
    }

}
