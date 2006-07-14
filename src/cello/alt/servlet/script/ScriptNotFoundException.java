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
