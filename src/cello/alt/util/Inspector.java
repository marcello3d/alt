package cello.alt.util;

import org.mozilla.javascript.Scriptable;


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
