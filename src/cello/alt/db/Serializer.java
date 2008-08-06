package cello.alt.db;

import org.mozilla.javascript.Scriptable;

public class Serializer {

	public void serialize(Scriptable obj) {
		for (Object child : obj.getIds()) {
			Object value = null;
			if (child instanceof String) {
				String s = (String)child;
				value = obj.get(s, obj);
			} else if (child instanceof Number) {
				int i = ((Number)child).intValue();
				value = obj.get(i, obj);
			}
		}
	}
}
