

Alt.require('alt.squeal.SQLSchema');
Alt.require('alt.squeal.sql.SQL');
Alt.require('alt.squeal.sql.Synchronize');
Alt.require('alt.squeal.toHTML');



var sql = new alt.squeal.SQLSchema(xml);

java.lang.Class.forName("com.mysql.jdbc.Driver");
var db = java.sql.DriverManager.getConnection("jdbc:mysql://localhost/", "root", "");
var delight = new alt.delight.Delight(sql, db);


o.print('<span class="squeal">' + sql.toHTML() + '</span>');

