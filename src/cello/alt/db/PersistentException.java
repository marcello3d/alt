package cello.alt.db;

import java.lang.Exception;

public class PersistentException extends Exception {

	public PersistentException() {
		super();
	}

	public PersistentException(String message, Throwable cause) {
		super(message, cause);
	}

	public PersistentException(String message) {
		super(message);
	}

	public PersistentException(Throwable cause) {
		super(cause);
	}

	
}
