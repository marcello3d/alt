/*
 *  Copyright (C) 2005-2006 Marcello Bast�a-Forte and Cellosoft
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

package cello.alt.servlet.script;

/**
 * Exception for when a script is not found by the {@link ScriptLoader}.
 * 
 * @author Marcello
 *
 */
public class ScriptNotFoundException extends Exception {

    /**
     * 
     */
    private static final long serialVersionUID = -2366115093374349872L;

    /**
     * Constructs a ResourceException with no details.
     */
    public ScriptNotFoundException() {
        super();
    }

    /**
     * Constructs a ResourceException with a message.
     * @param message
     */
    public ScriptNotFoundException(String message) {
        super(message);
    }

    /**
     * Constructs a ResourceException with a message and a cause.
     * @param message
     * @param cause
     */
    public ScriptNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
