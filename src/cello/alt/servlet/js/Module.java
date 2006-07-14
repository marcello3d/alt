package cello.alt.servlet.js;

import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

import cello.alt.servlet.RhinoServlet;

/**
 * 
 * 
 * @author Marcello
 *
 */
public class Module extends ScriptableObject {

    
    /**
     * 
     */
    private static final long serialVersionUID = 2669719978061260093L;
    private Module parent = null;
    private String name = null;
    private String fullName = null;

    /**
     * Constructs an empty Module object.
     */
    protected Module() {
        // do nothing
    }
    
    /**
     * Constructs a child module
     * @param parent the parent Module
     * @param name  the name of this module
     */
    public Module(Module parent, String name) {
        this(parent.getPrototype(), parent, name);
    }
    
    /**
     * Constructs a child module
     * @param prototype the prototype of this module
     * @param parent the parent Module
     * @param name  the name of this module
     */
    protected Module(Scriptable prototype, Module parent, String name) {
        super(parent,prototype);
        this.parent = parent;
        this.name = name;

        // Get full module name based on parent's full name 
        this.fullName = (parent instanceof RootModule) ? name :
            parent.getFullName() + '.' +  name;
        
        // Create a self-pointer
        defineProperty("module", this, RhinoServlet.PROTECTED);
        defineProperty("parent", parent, RhinoServlet.PROTECTED);
        
        parent.addChild(this);
    }
    
    /**
     * Adds the specified module as a child to this module.
     * @param module
     */
    protected void addChild(Module module) {
        System.out.println(this+".addChild("+module+") : "+module.getName());
        // Add the child scope as a member of the parent
        defineProperty(module.getName(), module, RhinoServlet.PROTECTED);
    }

    /**
     * @see org.mozilla.javascript.ScriptableObject#getClassName()
     */
    @Override
    public String getClassName() {
        return "Module "+getFullName()+hashCode();
    }
    
    /**
     * Returns the name of this module (if there is one).
     * @return  the name
     */
    public String getName() {
        return name;
    }
    /**
     * Returns the name of this module (if there is one).
     * @return  the name
     */
    public String getFullName() {
        return fullName;
    }
    
    /**
     * Get the parent module of this module (or null)
     * @return the module
     */
    public Module getParent() {
        return parent;
    }
    
    /**
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        return "Module["+getFullName()+"]";
    }

}
