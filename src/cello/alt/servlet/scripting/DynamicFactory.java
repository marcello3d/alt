/**
 * 
 */
package cello.alt.servlet.scripting;

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
        if (feature == Context.FEATURE_DYNAMIC_SCOPE ||
            feature == Context.FEATURE_STRICT_VARS)
            return true;
        return super.hasFeature(cx, feature);
    }
}