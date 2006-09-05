package cello.alt.servlet;

import javax.servlet.ServletOutputStream;

/**
 * A form of /dev/null output stream for use with HEAD http requests.
 * Inspired by Jetty's doHead method
 * 
 * @author Marcello
 */
public class NoBodyOutputStream extends ServletOutputStream {

	/**
	 * 
	 */
	public NoBodyOutputStream() {
		super();
	}
	
	private int writtenBytes = 0;
	
	/**
	 * @see java.io.OutputStream#write(int)
	 */
	@Override
	public void write(int b) {
		writtenBytes++;
	}

	/**
	 * Code from java.io.OutputStream source
	 * @see java.io.OutputStream#write(byte[], int, int)
	 */
	@Override
	public void write(byte buf[], int offset, int len) {
		if (buf == null) {
		    throw new NullPointerException();
		} else if ((offset < 0) || (offset > buf.length) || (len < 0) ||
			   ((offset + len) > buf.length) || ((offset + len) < 0)) {
		    throw new IndexOutOfBoundsException();
		}
		writtenBytes += len;
	}
	
	/**
	 * @return the number of bytes written out
	 */
	public int getWrittenBytes() {
		return writtenBytes;
	}

}
