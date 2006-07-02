
Rhino.require("test.Func");
Rhino.require("test.test2.*");

var local = this;
function foo(local) {
	return true;
}
tc.assertRun('foo(local)');
tc.assertRun('test.foo(local)');
tc.assertRun('test.test2.foo(local)');

