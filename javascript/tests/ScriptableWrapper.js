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

var sw = new alt.util.ScriptableWrapper(obj,'get','put');
sw.foo = 6; // should output "put foo := 6"
tc.assertEquals('output','put foo := 6');
var sbu = sw.bar;  // should output "get foo"
tc.assertEquals('output','get bar')
tc.assertEquals('sbu',3);
