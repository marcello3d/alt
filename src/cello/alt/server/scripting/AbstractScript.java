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

    private Set<Script> children = new HashSet<Script>();
    private Set<Script> parents = null;
    
    /**
     * Adds a child
     * @see Script#addChild(Script)
     */
    public void addChild(Script child) {
        if (child.equals(this))
            throw new RuntimeException("Attempting to add self to requirements.");
        System.out.println("Adding child "+child+" to "+this);
        children.add(child);
    }
    
    /**
     * Checks if a script is a child
     * @see Script#isChild(Script)
     */
    public boolean isChild(Script child) {
        return children.contains(child);
    }
    
    /**
     * Removes a child
     * @see Script#removeChild(Script)
     */
    public void removeChild(Script child) {
        System.out.println("Removing child "+child+" from "+this);
        children.remove(child);
    }

    /**
     * Reloads the children of this Script 
     * @param cx
     * @param scope
     * @throws IOException
     */
    protected void reloadChildren(Context cx, Scriptable scope) throws IOException {
        for (Script s : children)
            s.reload(cx, scope);
    }
    
    protected boolean checkParents(Context cx, Scriptable scope) throws IOException {
        boolean loadedSomething = false;
        if (parents != null)
            for (Script s : parents)
                if (s.load(cx, scope))
                    loadedSomething = true;
        return loadedSomething;
    }

    /**
     * Adds this script as a parent of this object.  This is used to remove
     * children that are no longer dependent.
     * @param parent  the parent Script
     */
    public void addParent(Script parent) {
        System.out.println("Adding parent "+parent+" to "+this);
        parents.add(parent);
    }
 
    private Set<Script> oldParents = null;

    /**
     * Stores the current list of parents for use with synchronizeParents() 
     */
    protected void resetParents() {
        oldParents = parents;
        parents = new HashSet<Script>();
    }
    /**
     * Checks the previously stored parents with current list and removes self
     * as child from any parents that are no longer parents.
     */
    protected void synchronizeParents() {
        if (oldParents != null)
            for (Script p : oldParents)
                if (!parents.contains(p))
                    p.removeChild(this);
    }
}