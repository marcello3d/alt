

Rhino.require('alt.squeal.SQLSchema');
Rhino.require('alt.squeal.sql.SQL');
Rhino.require('alt.squeal.sql.Synchronize');
Rhino.require('alt.squeal.toHTML');


var xml = Loader.get('sample-squeal.xml');

var sql = new alt.squeal.SQLSchema(xml);

sql.add(xml);

Rhino.require('alt.delight.Delight');

new Packages.org.hsqldb.jdbcDriver();
var db = java.sql.DriverManager.getConnection("jdbc:hsqldb:file:db/testdb");

var delight = new alt.delight.Delight(sql, db);


o.print('<span class="squeal">' + sql.toHTML() + '</span>');


var xml = <html>
<body>
<p>DB:{db}</p>
</body>
</html>;




response.contentType = "text/html; charset=UTF-8";
response.status = response.SC_OK;

response.writer.print(xml);