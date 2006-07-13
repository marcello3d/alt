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
