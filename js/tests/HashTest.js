

var map = {};
var o1 = new Object();
var o2 = new Object();

tc.assert('o1');
tc.assert('o2');
map[o1] = 1;
map[o2] = 2;
// This is not expected behavior!  Object maps in JavaScript are simply 
// string->object, not object->object
tc.assertEqual('map[o1]',2);
tc.assertEqual('map[o2]',2);


// We can use Java's HashMap to remedy this issue
var map2 = new java.util.HashMap();

map2.put(o1,1);
map2.put(o2,2);

tc.assertEqual('map2.get(o1)',1);
tc.assertEqual('map2.get(o2)',2);
