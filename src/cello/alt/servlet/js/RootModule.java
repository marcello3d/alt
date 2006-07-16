package cello.alt.servlet.js;

import org.mozilla.javascript.ScriptableObject;

import cello.alt.servlet.RhinoServlet;

/**
 * Root Module object overrides some functionality of regular Modules.
 * 
 * @author Marcello
 */
public class RootModule extends Module {

    private static final long serialVersionUID = -6648201327847241789L;
    private GlobalScope globalScope = null;

    /**
     * Constructs a new root module.
     * @param globalScope the prototype of this module
     */
    public RootModule(GlobalScope globalScope) {
        this.globalScope = globalScope;
        setPrototype(globalScope);
        // Create a self-pointer
        defineProperty("module", this, RhinoServlet.PROTECTED);
    }

    /**
     * Adds the specified module as a child to this module.
     * @param module
     */
    @Override
    protected void addChild(Module module) {
        // Add to global
        globalScope.defineProperty(module.getName(), module, 
                RhinoServlet.VISIBLE);
    }
    /**
     * @see ScriptableObject#getClassName()
     */
    @Override
    public String getClassName() {
        return "Root Module";
    }
    
    /**
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        return "Root Module";
    }
    
}
