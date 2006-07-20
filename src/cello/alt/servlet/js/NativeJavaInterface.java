/*
 *  Copyright (C) 2005-2006 Marcello Bast�a-Forte and Cellosoft
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

import org.mozilla.javascript.NativeJavaObject;
import org.mozilla.javascript.Scriptable;

/**
 * @author Marcello
 *
 */
public class NativeJavaInterface extends NativeJavaObject {

    /**
     * 
     */
    private static final long serialVersionUID = -2993510117131519528L;

    /**
     * 
     */
    public NativeJavaInterface() {
        super();
    }

    /**
     * @param scope
     * @param javaObject
     * @param staticType
     */
    public NativeJavaInterface(Scriptable scope, Object javaObject,
            Class staticType) {
        super(scope, javaObject, staticType);
    }

    /**
     * @see org.mozilla.javascript.NativeJavaObject#initMembers()
     */
    @Override
    protected void initMembers() {
        Object o = javaObject;
        javaObject = null;
        super.initMembers();
        javaObject = o;
    }
    
    

}
