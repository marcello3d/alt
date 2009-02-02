package cello.alt.db;

import jdbm.btree.BTree;

import java.io.IOException;
import java.util.Comparator;

import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

public class PersistentScriptable implements Scriptable {

	BTree tree = null;
	
	public PersistentScriptable(PersistentStore store) throws PersistentException {
		try {
			tree = store.newArray(new PersistentNodeComparator());
		} catch (IOException e) {
			throw new PersistentException(e);
		}
	}
	
	public class PersistentNodeComparator implements Comparator<PersistentNode> {

		@Override
		public int compare(PersistentNode o1, PersistentNode o2) {
			return Integer.valueOf(o1.index).compareTo(o2.index);
		}
		
	}
	public class PersistentNode {
		int index;
		Object value;
	}
	
	@Override
	public String getClassName() {
		return "PersistentScriptable";
	}

	@Override
	public void delete(String name) {
	}

	@Override
	public void delete(int index) {
	}

	@Override
	public Object get(String name, Scriptable start) {
		return null;
	}

	@Override
	public Object get(int index, Scriptable start) {
		return null;
	}

	@Override
	public Object getDefaultValue(Class<?> hint) {
        return ScriptableObject.getDefaultValue(this, hint);
	}

	@Override
	public Object[] getIds() {
		return null;
	}

	@Override
	public Scriptable getParentScope() {
		return null;
	}

	@Override
	public Scriptable getPrototype() {
		return null;
	}

	@Override
	public boolean has(String name, Scriptable start) {
		return false;
	}

	@Override
	public boolean has(int index, Scriptable start) {
		return false;
	}

	@Override
	public boolean hasInstance(Scriptable instance) {
		return false;
	}

	@Override
	public void put(String name, Scriptable start, Object value) {
		
	}

	@Override
	public void put(int index, Scriptable start, Object value) {
		
	}

	@Override
	public void setParentScope(Scriptable parent) {
		
	}

	@Override
	public void setPrototype(Scriptable prototype) {
		
	}

}
