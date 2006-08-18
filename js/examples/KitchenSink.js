// This file is somewhat legacy.  It will be removed once everything from it
// has been ripped out into better examples.




Alt.require('alt.resource.Loader');
Alt.require('alt.resource.String');
var res = Resources.get("/Main.xml");

	
var session = request.session;

response.contentType = "text/html; charset=UTF-8";
response.status = response.SC_OK;

var o = response.writer;

Alt.require('alt.squeal.SQLSchema');
Alt.require('alt.squeal.sql.SQL');
Alt.require('alt.squeal.sql.Synchronize');
Alt.require('alt.squeal.toHTML');


//var xml = 



var sql = new alt.squeal.SQLSchema();

sql.add(xml);

Alt.require('alt.delight.Delight');

java.lang.Class.forName("com.mysql.jdbc.Driver");
var db = java.sql.DriverManager.getConnection("jdbc:mysql://localhost/", "root", "");
var delight = new alt.delight.Delight(sql, db);


o.print('<span class="squeal">' + sql.toHTML() + '</span>');



o.println("</body>");
o.println("</html>");

