Rhino.require("alt.util.ScriptableWrapper");

var output = "";

var obj = {
	get: function(name) {
		output = "get "+name;
		return 3;
	},
	put: function(name,value) {
		output = "put "+name+" := "+value;
	}
}

Rhino.log("alt="+alt);
Rhino.log("alt.util="+alt.util);
Rhino.log("alt.module="+alt.module);
//Rhino.log("alt.util.module="+alt.util.module);
//Rhino.log("util="+util);
Rhino.log("module="+module);
Rhino.log("global.alt="+global.alt);
Rhino.log("global.alt.util="+global.alt.util);
Rhino.log("global.alt.module="+global.alt.module);
//Rhino.log("global.alt.util.module="+global.alt.util.module);
Rhino.log("global.util="+global.util);
Rhino.log("global.module="+global.module);
var sw = new alt.util.ScriptableWrapper(obj,'get','put');
sw.foo = 6; // should output "put foo := 6"
tc.assertEquals('output','put foo := 6');
var sbu = sw.bar;  // should output "get foo"
tc.assertEquals('output','get bar')
tc.assertEquals('sbu',3);
