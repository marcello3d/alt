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

package cello.alt.util;

import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.debug.DebuggableObject;


/**
 * Provides some access to JavaScript internals. 
 * 
 * @author Marcello
 */
public class Inspector {


    /**
     * Retrieves a list of properties for a JavaScript object
     * @param s  the scriptable object
     * @return  the list of properties
     * @see Scriptable#getIds()
     */
    public static Object[] getProperties(Object s) {
        if (s instanceof Scriptable)
            return ((Scriptable)s).getIds();
        return new Object[]{};
    }

    /**
     * Retrieves a list of all properties for a JavaScript object
     * @param s  the scriptable object
     * @return  the list of properties
     * @see DebuggableObject#getAllIds()
     */
    public static Object[] getAllProperties(Object s) {
        if (s instanceof DebuggableObject)
            return ((DebuggableObject)s).getAllIds();
        return getProperties(s);
    }
    
    /**
     * Returns the attributes for a particular property of a ScriptableObject
     * @param s  the scriptable object
     * @param name  the name of the property
     * @return  the attributes as defined by ScriptableObject
     * @see ScriptableObject#getAttributes(String)
     */
    public static int getAttributes(Object s, String name) {
        if (s instanceof ScriptableObject)
            return ((ScriptableObject)s).getAttributes(name);
        return 0;
    }
    
    /**
     * Returns the attributes for a particular property of a ScriptableObject
     * @param s  the scriptable object
     * @param index  the index of the property
     * @return  the attributes as defined by ScriptableObject
     * @see ScriptableObject#getAttributes(int)
     */
    public static int getAttributes(Object s, int index) {
        if (s instanceof ScriptableObject)
            return ((ScriptableObject)s).getAttributes(index);
        return 0;
    }
    
    /**
     * Returns whether or not a JavaScript object has a particular property
     * @param s  the scriptable object
     * @param name  the name of the property
     * @return  true if s contains name
     */
    public static boolean hasProperty(Scriptable s, String name) {
        return s.has(name,s);
    }
    
    /**
     * Returns whether or not a JavaScript object has a particular index
     * @param s  the scriptable object
     * @param index  the index
     * @return  true if s contains name
     */
    public static boolean hasProperty(Scriptable s, int index) {
        return s.has(index,s);
    }
}
