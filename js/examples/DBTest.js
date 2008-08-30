displaySource("DBTest.js");

Alt.require('alt.resource.XML');
Alt.require('alt.db.Database');

new Packages.org.h2.Driver();
var dbconn = java.sql.DriverManager.getConnection("jdbc:h2:tcp://localhost/test","sa","");

var db = alt.db.Database.get(dbconn);
var store = db.root;
response.contentType = "text/plain";
function printTree(path, obj){
	for (var x in obj) {
		var o = obj[x];
		response.writeln(path+"."+x+"="+"("+typeof(o)+")"+o);
		if (typeof(o)=="object")
			printTree(path+"."+x,o);
	}
}
store.foo = "monkeys!";
Alt.log("users = "+store.users);
if (!store.users) {
	Alt.log('foo,store='+store);
	store.users = new alt.db.DataNode;
}
store.users.willis = {
	name: "Willis",
	age: 65
};
delete store.users.willis.age;
for (var x in store) {
	response.writeln("x="+x+" - "+store[x]);
}
//response.writeln("store="+store);
//response.writeln("store.foo="+store.foo);
//response.writeln("store.other="+store.other);
printTree("store",store);
//
//var o = {};
//o.__defineGetter__("__iterator__",function() {
//		return function() {
//			yield 1
//			yield 2
//			yield 3
//		}
//	});
//for (var i in o) {
//	response.writeln("i = "+i);
//}


/*
if (!store.users) {
	store.users = new alt.db.List;
}
store.users.add({
	name: "fred",
	age: 15,
	date: new Date()
});
*/

dbconn.close();
