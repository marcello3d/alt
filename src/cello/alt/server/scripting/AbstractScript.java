/**
 * 
 */
package cello.alt.server.scripting;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;

public abstract class AbstractScript implements Script {


    private Set<Script> dependencies = new HashSet<Script>();
    private Set<Script> cascadeDependencies = new HashSet<Script>();
    
    
    protected boolean checkDependencies(Context cx, Scriptable scope) throws IOException {
        // Check the regular dependencies
        for (Script s : dependencies)
            s.load(cx, scope);
        // Check cascading dependencies
        boolean loadedSomething = false;
        for (Script s : cascadeDependencies)
            if (s.load(cx, scope))
                loadedSomething = true;
        return loadedSomething;
    }

    /**
     * Adds this script as a parent of this object.  This is used to remove
     * children that are no longer dependent.
     * @param dependency  the parent Script
     */
    public void addDependency(Script dependency, boolean cascadeReload) {
        if (cascadeReload)
            cascadeDependencies.add(dependency);
        else
            dependencies.add(dependency);
    }
    /**
     * Stores the current list of parents for use with synchronizeParents() 
     */
    protected void resetDependencies() {
        dependencies.clear();
        cascadeDependencies.clear();
    }
}