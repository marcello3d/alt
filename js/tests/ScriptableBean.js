Alt.require("alt.util.ScriptableBean");

var output = "";

var obj = {
	getBar: function() {
		output = "getBar()";
		return 3;
	},
	setFoo: function(value) {
		output = "setFoo("+value+")";
	}
}
tc.assert('alt.util.ScriptableBean');
var sb = new alt.util.ScriptableBean(obj);
sb.foo = 6; // should output "put foo := 6"
tc.assertEqual('output','setFoo(6)');
var sb_bar = sb.bar;  // should output "get foo"
tc.assertEqual('output','getBar()')
tc.assertEqual('sb.bar',3);
