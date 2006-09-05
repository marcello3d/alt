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

public class ScriptableBean extends ScriptableObject {


	
	/**
	 * 
	 */
	private static final long serialVersionUID = -8870948049685975754L;
	
	private Scriptable wrappedScriptable = null;
    
    /**
     * Constructs a new ScriptableWrapper
     */
    public ScriptableBean() {
        super();
    }
	
	/**
     * Initializes a particular context and scope with the ScriptableWrapper
     * pseudo-class. 
	 * @param scope  the scope
	 */
	public static void init(Scriptable scope) {

		ScriptableBean proto = new ScriptableBean();
        proto.setPrototype(getObjectPrototype(scope));
        Member ctorMember = null;
        for (Method m : ScriptableBean.class.getDeclaredMethods())
            if ("jsConstructor".equals(m.getName())) {
                ctorMember = m;
                break;
            }
        FunctionObject ctor = new FunctionObject("ScriptableBean", ctorMember, 
        		scope);
        ctor.addAsConstructor(scope, proto);
    }

    /**
     * The JavaScript constructor for the ScriptableBean pseudo-class.
     * 
     * JavaScript function "evaluate".  In order to access the current 
     *  JavaScript scope and Context, this static form needs to be used.
     * <ul>
     *  <li>new ScriptableWrapper(objectToWrap)</li>
     * </ul> 
     * 
     * @param objectToWrap
     * @return the constructed object
     */
    public static ScriptableBean construct(Scriptable objectToWrap) {
        ScriptableBean sb = new ScriptableBean();
        sb.wrappedScriptable = objectToWrap;
        return sb;
    }
    /**
     * The JavaScript constructor for the ScriptableWrapper pseudo-class.
     * 
     * @param cx   javascript Context
     * @param args  the arguments passed to this constructor
     * @param ctorObj   the constructor object
     * @param inNewExpr whether or not this constructor is called in a new expr?
     * @return the constructed object
     */
    public static ScriptableBean jsConstructor(Context cx, Object[] args,
            Function ctorObj, boolean inNewExpr) {
        return construct((Scriptable)args[0]);
    }
	
	/**
	 * @return the class name specified by Rhino Scriptable
	 */
	@Override
    public String getClassName() {
		if (wrappedScriptable!=null)
			return "ScriptableBean:"+wrappedScriptable.getClassName();
		return "ScriptableBean";
	}

	/**
	 * @see ScriptableObject#get(java.lang.String, Scriptable)
	 */
	@Override
    public Object get(String name, Scriptable start) {
        Context context = Context.enter();
            try {
    		// Check if current class has a field of this name
    		Object o = super.get(name, start);
    		if (wrappedScriptable==null || (o!=null && 
    										!(o instanceof UniqueTag)))
    			return o;
            
    		// Check if it's in the wrapped scriptable
    		o = super.getProperty(wrappedScriptable,name);
    		if (o!=null && !(o instanceof UniqueTag))
    			return o;

            // Otherwise, call the get function
            String beanName = Character.toUpperCase(name.charAt(0))
                                  + name.substring(1);

            // Get the "get" function
            Object get = super.getProperty(wrappedScriptable,"get"+beanName);
            if (get==null || !(get instanceof Function)) {
                get = super.getProperty(wrappedScriptable,"is"+beanName);
                if (get==null || !(get instanceof Function))
                    return Scriptable.NOT_FOUND;
            }
            Function func = (Function)get;
            
    		try {
    			return func.call(context,start.getParentScope(),
    							wrappedScriptable, new Object[]{});
    		} catch (JavaScriptException jse) {
    			return Scriptable.NOT_FOUND;
    		}
        } finally {
            Context.exit();
        }
	}
	/**
	 * @see ScriptableObject#has(String, Scriptable)
	 */
	@Override
    public boolean has(String name, Scriptable start) {
		if (wrappedScriptable!=null && wrappedScriptable.has(name,start))
			return true;
		return super.has(name, start);
	}
	/**
	 * @see ScriptableObject#put(String, Scriptable, Object)
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


            // Otherwise, call the get function
            String setFunction = "set" + Character.toUpperCase(name.charAt(0))
                                  + name.substring(1);

            // Get the "set" function
            Object set = super.getProperty(wrappedScriptable,setFunction);
            if (set==null || !(set instanceof Function)) {
        		// Otherwise we put the variable directly
        		wrappedScriptable.put(name, wrappedScriptable, value);
        		return;
            }
            Function func = (Function)set;

    		try {
    			Object o = func.call(context, start.getParentScope(), 
    						wrappedScriptable, new Object[]{value});
    			// If the function returns false, we use the regular put
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