package cello.alt.util;

import java.lang.reflect.Member;
import java.lang.reflect.Method;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.FunctionObject;
import org.mozilla.javascript.JavaScriptException;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.UniqueTag;

/**
 * Provides a pseudo-class wrapper for JavaScript.  This allows users in 
 * JavaScript to construct classes with dynamic get and put methods (that is,
 * variable assignment and retrieval can be proxied through functions).
 * 
 * @author Marcello
 *
 */
public class ScriptableWrapper extends ScriptableObject {

	
	/**
	 * 
	 */
	private static final long serialVersionUID = -8870948049685975754L;
	
	private Scriptable wrappedScriptable = null;
	private String getFunctionName = "$get";
	private String putFunctionName = "$put";
    private Function getFunction = null;
    private Function putFunction = null;
    
    /**
     * Constructs a new ScriptableWrapper
     */
    public ScriptableWrapper() {
        super();
    }
	
	/**
     * Initializes a particular context and scope with the ScriptableWrapper
     * pseudo-class. 
	 * @param scope  the scope
	 */
	public static void init(Scriptable scope) {

        System.out.println("ScriptableWrapper.init("+scope+")");
        ScriptableWrapper proto = new ScriptableWrapper();
        proto.setPrototype(getObjectPrototype(scope));
        Member ctorMember = null;
        for (Method m : ScriptableWrapper.class.getDeclaredMethods())
            if ("jsConstructor".equals(m.getName())) {
                ctorMember = m;
                break;
            }
        FunctionObject ctor = new FunctionObject("ScriptableWrapper", ctorMember, scope);
        ctor.addAsConstructor(scope, proto);
    }

    /**
     * The JavaScript constructor for the ScriptableWrapper pseudo-class.
     * 
     * JavaScript function "evaluate".  In order to access the current 
     *  JavaScript scope and Context, this static form needs to be used.
     * <ul>
     *  <li>new ScriptableWrapper(objectToWrap)</li>
     *  <li>new ScriptableWrapper(objectToWrap,getFunction,putFunction)</li>
     * </ul> 
     * getFunction/putFunction can either be a string (name of a property in 
     * objectToWrap) or an actual function.
     * 
     * @param objectToWrap
     * @param getFunction  a String or Function
     * @param putFunction a String or Function
     * @return the constructed object
     */
    public static ScriptableWrapper construct(Scriptable objectToWrap,
            Object getFunction, Object putFunction) {
        ScriptableWrapper sc = new ScriptableWrapper();
        
        sc.wrappedScriptable = objectToWrap;
        
        if (getFunction instanceof Function)
            sc.getFunction = (Function)getFunction;
        else if (getFunction instanceof String)
            sc.getFunctionName = (String)getFunction;
        
        if (putFunction instanceof Function)
            sc.putFunction = (Function)putFunction;
        else if (putFunction instanceof String)
            sc.putFunctionName = (String)putFunction;
        return sc;
    }
    /**
     * The JavaScript constructor for the ScriptableWrapper pseudo-class.
     * 
     * @param cx   javascript Context
     * @param args  the arguments passed to this constructor
     * @param ctorObj   the constructor object
     * @param inNewExpr  whether or not this constructor is called in a new expr?
     * @return the constructed object
     */
    public static ScriptableWrapper jsConstructor(Context cx, Object[] args,
            Function ctorObj, boolean inNewExpr) {
        return construct((Scriptable)args[0], 
                args.length>1 ? args[1] : null, 
                args.length>2 ? args[2] : null);
    }
	
	/**
	 * @return the class name specified by Rhino Scriptable
	 */
	@Override
    public String getClassName() {
		if (wrappedScriptable!=null)
			return "ScriptableWrapper:"+wrappedScriptable.getClassName();
		return "ScriptableWrapper";
	}

	/**
	 * @see org.mozilla.javascript.ScriptableObject#get(java.lang.String, org.mozilla.javascript.Scriptable)
	 */
	@Override
    public Object get(String name, Scriptable start) {
        Context context = Context.enter();
            try {
    		// Check if current class has a field of this name
    		Object o = super.get(name, start);
    		if (wrappedScriptable==null || (o!=null && !(o instanceof UniqueTag)))
    			return o;
            
    		// Check if it's in the wrapped scriptable
    		o = super.getProperty(wrappedScriptable,name);
    		if (o!=null && !(o instanceof UniqueTag))
    			return o;

            // Otherwise, call the get function
            

            // Get the "get" function
            Function func = getFunction;
            
            if (func==null) {
                Object get = super.getProperty(wrappedScriptable,getFunctionName);
                
                if (get==null || !(get instanceof Function))
                    return Scriptable.NOT_FOUND;
                
                func = (Function)get;
            }
            
    		try {
    			return func.call(context,start.getParentScope(),wrappedScriptable,new Object[]{name});
    		} catch (JavaScriptException jse) {
    			return Scriptable.NOT_FOUND;
    		}
        } finally {
            Context.exit();
        }
	}
	/**
	 * @see org.mozilla.javascript.ScriptableObject#has(java.lang.String, org.mozilla.javascript.Scriptable)
	 */
	@Override
    public boolean has(String name, Scriptable start) {
		if (wrappedScriptable!=null && wrappedScriptable.has(name,start))
			return true;
		return super.has(name, start);
	}
	/**
	 * @see org.mozilla.javascript.ScriptableObject#put(java.lang.String, org.mozilla.javascript.Scriptable, java.lang.Object)
	 */
	@Override
    public void put(String name, Scriptable start, Object value) {
        Context context = Context.enter();
        try {
    		// We do not want to put variables directly in this object
    		if (wrappedScriptable==null) {
    			super.put(name,start,value);
    			return;
    		}
    		
            // Get the "put" function
            Function func = putFunction;
            
            if (func==null) {
        		Object put = super.getProperty(wrappedScriptable, putFunctionName);
        		if (put==null || !(put instanceof Function))
        			return;
        		
                // Execute the function
        		func = (Function)put;
            }
    		try {
    			Object o = func.call(context,start.getParentScope(),wrappedScriptable,new Object[]{name,value});
    			// If the function returns false, we use the default set function
    			if (!Boolean.FALSE.equals(o))
    				return;
    		} catch (JavaScriptException jse) {
                // continue
    		}
    		// Otherwise we put the variable directly
    		wrappedScriptable.put(name, wrappedScriptable, value);
        } finally {
            Context.exit();
        }
	}

}