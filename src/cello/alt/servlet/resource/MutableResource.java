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
