package cello.alt.servlet.resource;


/**
 * Mutable resources add the ability to see when a resource was last changed.
 * 
 * @author Marcello
 *
 */
public interface MutableResource extends Resource {

    /**
     * Returns some object to specify the current version of this Resource.
     * This could be as simple as a modification timestamp or some sort of
     * version number.
     * 
     * Since this method could potentially be called frequently (every time the
     * resource is needed), efficiency is recommended.
     * 
     * Recommended usage of this method involves comparing the current result 
     * with a previously cached result using {@link Object#equals(java.lang.Object)}.
     *   
     * @return an version tag object
     */
    public Object getVersionTag();
    
}
