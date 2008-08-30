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

import org.mozilla.javascript.Context;
import org.mozilla.javascript.ContextFactory;

/**
 * Custom {@link ContextFactory} that enables the dynamic scope and strict vars
 *  features.  Dynamic scope is necessary to isolate scope between multiple 
 *  requests more cleanly.  Strict vars causes Rhino to generate an error when
 *  you try to access a non-existant global variable.  The remaining features
 *  are left as default.
 * 
 * @author Marcello
 * @see Context#FEATURE_DYNAMIC_SCOPE
 * @see Context#FEATURE_STRICT_VARS
 *
 */
public class DynamicFactory extends ContextFactory {
    
    /**
     * Specifies whether particular features are enabled in Rhino.
     * @param cx  the Context
     * @param feature the id number of the feature   
     * @return  true if the feature is enabled
     */
    @Override
    protected boolean hasFeature(Context cx, int feature) {
    	switch (feature) {
	    	case Context.FEATURE_DYNAMIC_SCOPE:
	    	case Context.FEATURE_STRICT_VARS:
	    	case Context.FEATURE_E4X:
	    	case Context.FEATURE_LOCATION_INFORMATION_IN_ERROR:
	            return true;
    	}
        return super.hasFeature(cx, feature);
    }

	/**
	 * @see ContextFactory#observeInstructionCount(Context, int)
	 */
    /*
	@Override
	protected void observeInstructionCount(Context cx, int instructionCount) {
		//
	}*/
    
}