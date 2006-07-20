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

/**
 * A simple wrapper for ScriptableObject that defines a class name simply by
 *  string passed into constructor.
 *  
 * @author Marcello
 *
 */
public class NamedScriptableObject extends ScriptableObject {

    /** For Eclipse warning */
    private static final long serialVersionUID = 6329384887890982629L;
    private String className;
    
    /**
     * Constructs a new ScriptableObject using a static class name.
     * @param className the class name
     */
    public NamedScriptableObject(String className) {
        this.className = className;
    }

    /**
     * Returns the class name for this Scriptable
     * @return the class name
     * @see ScriptableObject#getClassName()
     */
    @Override
    public String getClassName() {
        return className;
    }
    /**
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        return "NamedScriptableObject["+className+"]";
    }

}
