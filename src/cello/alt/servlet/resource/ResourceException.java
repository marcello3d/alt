package cello.alt.servlet.resource;

import cello.alt.servlet.scripting.ScriptLoader;

/**
 * Exception for when a resource is not found by the {@link ScriptLoader}.
 * 
 * @author Marcello
 *
 */
public class ResourceException extends Exception {

    /**
     * 
     */
    private static final long serialVersionUID = -2366115093374349872L;

    /**
     * Constructs a ResourceException with no details.
     */
    public ResourceException() {
        super();
    }

    /**
     * Constructs a ResourceException with a message.
     * @param message
     */
    public ResourceException(String message) {
        super(message);
    }

    /**
     * Constructs a ResourceException with a message and a cause.
     * @param message
     * @param cause
     */
    public ResourceException(String message, Throwable cause) {
        super(message, cause);
    }
}
