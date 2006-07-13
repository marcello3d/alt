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
