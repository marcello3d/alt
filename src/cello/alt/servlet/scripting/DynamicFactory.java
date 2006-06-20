/**
 * 
 */
package cello.alt.servlet.scripting;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.ContextFactory;

public class DynamicFactory extends ContextFactory {
    protected boolean hasFeature(Context cx, int featureIndex) {
        if (featureIndex == Context.FEATURE_DYNAMIC_SCOPE)
            return true;
        return super.hasFeature(cx, featureIndex);
    }
}