displaySource("DBTest.js");

Alt.require('alt.resource.XML');
Alt.require('alt.db.Database');

new Packages.org.h2.Driver();
var dbconn = java.sql.DriverManager.getConnection("jdbc:h2:tcp://localhost/test","sa","");

var db = alt.db.Database.get(dbconn);
var store = db.store.dbtest;
response.write("store.users="+store.users);
if (!store.users) {
	store.users = new alt.db.List;
}
store.users.add({
	name: "fred",
	age: 15,
	date: new Date()
});


dbconn.close();
