Alt.require('alt.squeal.sql.Synchronize');
Alt.require('alt.squeal.toHTML');
Alt.require('alt.resource.XML');

XML.ignoreWhitespace = false;
var xml = alt.resource.Loader.get('sample-squeal.xml');

var sql = new alt.squeal.SQLSchema(xml);

new Packages.org.hsqldb.jdbcDriver();
java.lang.Class.forName("com.mysql.jdbc.Driver");
var db = java.sql.DriverManager.getConnection("jdbc:mysql://localhost/", "root", "");

var list = <ul/>;

function log(message) {
	//Alt.log(message);
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
