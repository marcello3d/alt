package cello.alt.servlet.js;

/**
 * Interface defined for objects that can create Module objects from 
 *  module/script names.
 * 
 * @author Marcello
 *
 */
public interface ModuleProvider {

    /**
     * Each module has its own scope from which its scripts are executed. This
     *  method returns that scope (creating it if necessary).  It also creates
     *  the necessary object hierarchy.  For example, if this method were called
     *  with the argument "module1.module2.Script", a global.module1 would be
     *  created, and within that a module2, global.module1.module2.  
     *  
     * @param name  the module/script name (or .*)
     * @return the scope associated with this module/script name
     */
    public Module getScriptModule(String name);

}