package cello.alt.servlet.script;

import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

import cello.alt.servlet.resource.Resource;
import cello.alt.servlet.resource.ResourceException;


/**
 * This class provides a way to search multiple ScriptLoaders from a single
 *  ScriptLoader.
 * @author Marcello
 *
 */
public class MultiScriptLoader extends ScriptLoader {
    
    private List<ScriptLoader> loaders = new LinkedList<ScriptLoader>();

    /**
     * Constructs a new MultiScriptLoader with a given initial set of loaders.
     * @param loaders
     */
    public MultiScriptLoader(ScriptLoader... loaders) {
        super();
        for (ScriptLoader sl : loaders)
            add(sl);
    }
    
    /**
     * Adds another ScriptLoader to the list of loaders.
     * @param loader the loader
     */
    public void add(ScriptLoader loader) {
        if (loaders.contains(loader))
            return;
        loaders.add(loader);
    }
    
    /**
     * Clears the list of ScriptLoaders.
     */
    public void clear() {
        loaders.clear();
    }

    /**
     * Finds a Script from any of the listed ScriptLoaders
     *  
     * @param name the module/script name 
     * @return the JavaScript
     * @throws ScriptNotFoundException
     */
    @Override
    protected JavaScript findScript(String name) throws ScriptNotFoundException {
        for (ScriptLoader sl : loaders) 
            try {
                return sl.findScript(name);
            } catch (ScriptNotFoundException ex) {
                continue;
            }
        throw new ScriptNotFoundException("Could not load "+name); 
    }

    /**
     * @see ScriptLoader#findResource(java.lang.String)
     */
    @Override
    protected Resource findResource(String path) throws ResourceException {
        for (ScriptLoader sl : loaders) 
            try {
                return sl.findResource(path);
            } catch (ResourceException ex) {
                continue;
            }
        throw new ResourceException("Could not find "+path); 
    }

    /**
     * @see ScriptLoader#getResourcePaths(java.lang.String)
     */
    @Override
    public Set<String> getResourcePaths(String path) {
        System.out.println(this+".getResourcePaths("+path+")");
        Set<String> fullSet = new HashSet<String>();
        for (ScriptLoader sl : loaders) {
            Set<String> set = sl.getResourcePaths(path);
            if (set != null)
                fullSet.addAll(set);
        }
        return fullSet;
    }

}
