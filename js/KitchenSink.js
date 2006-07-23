




Rhino.require('alt.resource.Loader');
Rhino.require('alt.resource.XML');
Rhino.require('alt.resource.String');
Rhino.require('alt.resource.Image');

var res = alt.resource.Loader.get("/Main.xml");

	
var session = request.session;

response.contentType = "text/html; charset=UTF-8";
response.status = response.SC_OK;

var o = response.writer;
o.println("<html>");
o.println("<head>");

XML.ignoreComments = false;

o.print(res.toXMLString());
o.println("</head>");
o.println("<body>");
o.println("<pre>"+request+"</pre>");


Rhino.require('alt.html.StringUtils');

function writeln(s) {
	response.writer.println(alt.html.StringUtils.escapeHTML(s)+'<br/>');
}
function writeColorln(color) {
	return function(msg) {
		response.writer.println('<span style="color:'+color+'">'+alt.html.StringUtils.escapeHTML(msg)+'</span><br/>');
	}
}

writeln(request.getRequestURI());

writeln("session = "+session);
writeln("date = "+new Date());


//Rhino.require('alt.util.Inspector');
//var ins = new alt.util.Inspector(global);
//o.println(ins.toHTML());





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

