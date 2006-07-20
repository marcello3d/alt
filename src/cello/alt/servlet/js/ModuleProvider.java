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