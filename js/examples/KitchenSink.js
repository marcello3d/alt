// This file is somewhat legacy.  It will be removed once everything from it
// has been ripped out into better examples.




Rhino.require('alt.resource.Loader');
Rhino.require('alt.resource.String');
var res = alt.resource.Loader.get("/Main.xml");

	
var session = request.session;

response.contentType = "text/html; charset=UTF-8";
response.status = response.SC_OK;

var o = response.writer;

Rhino.require('alt.squeal.SQLSchema');
Rhino.require('alt.squeal.sql.SQL');
Rhino.require('alt.squeal.sql.Synchronize');
Rhino.require('alt.squeal.toHTML');


//var xml = 



var sql = new alt.squeal.SQLSchema();

sql.add(xml);

Rhino.require('alt.delight.Delight');

java.lang.Class.forName("com.mysql.jdbc.Driver");
var db = java.sql.DriverManager.getConnection("jdbc:mysql://localhost/", "root", "");
var delight = new alt.delight.Delight(sql, db);


o.print('<span class="squeal">' + sql.toHTML() + '</span>');



o.println("</body>");
o.println("</html>");

