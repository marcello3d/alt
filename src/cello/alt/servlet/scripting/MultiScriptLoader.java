package cello.alt.servlet.scripting;

import java.net.MalformedURLException;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

import cello.alt.servlet.Resource;


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
                return sl.loadScript(name);
            } catch (ScriptNotFoundException ex) {
                continue;
            }
        throw new ScriptNotFoundException("Could not load "+name); 
    }

    /**
     * @see cello.alt.servlet.scripting.ScriptLoader#getResource(java.lang.String)
     */
    @Override
    public Resource getResource(String path) throws MalformedURLException {
        for (ScriptLoader sl : loaders) 
            try {
                return sl.getResource(path);
            } catch (MalformedURLException ex) {
                continue;
            }
        throw new MalformedURLException("Could not find "+path); 
    }

    /**
     * @see cello.alt.servlet.scripting.ScriptLoader#getResourcePaths(java.lang.String)
     */
    @Override
    public Set<String> getResourcePaths(String path) {
        Set<String> fullSet = new HashSet<String>();
        for (ScriptLoader sl : loaders) {
            Set<String> set = sl.getResourcePaths(path);
            if (set != null)
                fullSet.addAll(set);
        }
        return fullSet;
    }

}
