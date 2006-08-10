
var arr = [1,2,3,4];

// JavaScript for in loop
var sum = 0;
for (var x in arr)
	sum += arr[x];
tc.assertEqual('sum',10);

// JavaScript 1.6 for each in loop
var sum = 0;
for each (var x in arr)
	sum += x;
tc.assertEqual('sum',10);

// JavaScript 1.7 iterator
/*
var object = {};
object.start = 1;
object.__iterator__ = {
	next: function() {
		if (start==5)
			throw StopException;
		return start++;
	}
};

var sum = 0;
for (var x in object)
	sum += x;
tc.assertEqual('sum',10);
*/