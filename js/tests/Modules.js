
Rhino.require('tests.moduletest.Func');
Rhino.require('tests.moduletest.test2.*');

var local = this;
function foo(local) {
	return true;
}
tc.assertRun('foo(local)');
tc.assertRun('tests.moduletest.foo(local)');
tc.assertRun('tests.moduletest.test2.foo(local)');
