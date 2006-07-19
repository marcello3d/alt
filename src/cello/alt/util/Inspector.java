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
