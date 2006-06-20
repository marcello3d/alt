/**
 * 
 */
package cello.alt.servlet.scripting;

import java.io.IOException;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.ImporterTopLevel;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

import cello.alt.servlet.RhinoServlet;

public class SharedScriptableObject extends ImporterTopLevel {

    /** For Eclipse warning */
    private static final long serialVersionUID = 3328680909322034652L;
    
    private RhinoServlet server;

    public SharedScriptableObject(RhinoServlet server) {
        this.server = server;
        Context cx = Context.enter();
        cx.initStandardObjects(this,true);
        Context.exit();
        
        defineFunctionProperties(new String[] {
                                                "require", 
                                                "classpath",
                                                "scriptpath"
                                              },
                                  getClass(),
                                  ScriptableObject.DONTENUM |
                                  ScriptableObject.READONLY);
    }
    
    public static Object require(Context cx, Scriptable thisObj, Object[] args, Function funObj) throws IOException {

        // Read arguments
        if (args.length==0) return false;
        String scriptName = (String)args[0];
        boolean cascadeReload = false;
        if (args.length>=2 && args[1].equals(Boolean.TRUE))
            cascadeReload = true;

        // Require the script
        RhinoServlet.getServer(cx).requireScript(cx, funObj.getParentScope(), scriptName, cascadeReload);
        return false;
    }
    public void classpath(String path) throws IOException {
        server.addClassPath(path);
    }
    public void scriptpath(String path) throws IOException {
        server.addScriptPath(path);
    }

}