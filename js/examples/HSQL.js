
Rhino.require('alt.squeal.sql.Synchronize');
Rhino.require('alt.squeal.toHTML');
Rhino.require('alt.resource.XML');

XML.ignoreWhitespace = true;
var xml = alt.resource.Loader.get('sample-squeal.xml');

var sql = new alt.squeal.SQLSchema(xml);

new Packages.org.hsqldb.jdbcDriver();
var db = java.sql.DriverManager.getConnection("jdbc:hsqldb:file:db/testdb");

var list = <ul/>;

function log(message) {
	Rhino.log(message);
	list.appendChild(<li>{message}</li>);
}

sql.synchronize(db, log);

var xml = Loader.load("HSQL.xml");

xml..p.(@id=="db").appendChild(db);
xml..p.(@id=="log").appendChild(list);
xml..p.(@id=="squeal").appendChild(sql.toHTML());

response.contentType = "text/html; charset=UTF-8";
response.status = response.SC_OK;
response.writer.print(xml);
