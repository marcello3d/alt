
var x = 4;
var f = function() { return x; }
tc.assertEqual('f()', 4);
x = 5;
tc.assertEqual('f()', 5);
