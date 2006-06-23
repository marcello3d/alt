package cello.alt.servlet.scripting;

import java.util.LinkedList;
import java.util.List;


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

}
