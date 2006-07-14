


var session = request.session;

response.contentType = "text/html; charset=UTF-8";
response.status = (response.SC_OK);

var o = response.writer;
o.println("<html>");
o.println("<head>");

XML.ignoreComments = false;
o.print(<style type="text/css"><!--
body, p, td, th, li {
	font-family: Verdana, sans-serif;
}

big {
	font-size: 18pt;
	font-weight: bold;
}

a {
	color: #cc3333;
}
.squeal table, .delight table {
	border: solid 1px black;
}
.squeal td, .squeal th, .delight td, .delight th {
	border-bottom: solid 1px silver;
	vertical-align: top;
}
.squeal .header, .delight .header {
	background-color: #EEF;
}
.squeal .name, .squeal .namespace {
	background-color: #CCF;
	text-align: left;
}
.squeal .hidden {
	background-color: #FFFFF0;
	font-style: italic;
}
 --></style>.toXMLString());

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
// Do tests
Rhino.require('tests.Tester');

tests.Tester.test(this,
	['tests.ScriptableWrapper',
	 'tests.Synchronization',
	 'tests.Modules',
	 'tests.E4X'],
	writeln, writeColorln('green'), writeColorln('red')
	);



//Rhino.require('alt.util.Inspector');
//var ins = new alt.util.Inspector(global);
//o.println(ins.toHTML());













Rhino.require('alt.squeal.SQLSchema');
Rhino.require('alt.squeal.sql.SQL');
Rhino.require('alt.squeal.sql.Synchronize');
Rhino.require('alt.squeal.toHTML');


var xml = 
<?xml version="1.0"?>
<schema
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:noNamespaceSchemaLocation="squeal.xsd"> 
<types>
 <type name="username" base="sql:char(15)" valid="min:3;max:15;ereg:[a-zA-Z0-9]" />
 <type name="password" base="sql:char(10)" valid="min:6;max:15;ereg:[a-zA-Z0-9]" />
 <type name="email" base="sql:char(255)" valid="min:3;max:15;ereg:.+@.+" />
 <type name="string" base="sql:varchar(255)" /> 
 <type name="title" base="string" default="txt:No title" />
 <type name="message" base="sql:text" />
 <type name="date" base="sql:datetime">
   <value name="default" value="sql:now()" />
   <value name="yesterday" value="sql:DATE_SUB(NOW(),INTERVAL 1 DAY)" />
 </type>
</types>

<database name="network"> 

 <table name="user">
  <field name="username" type="username" index="unique" required="true" />
  <field name="password" type="password" required="true" />
  <field name="email" type="email" index="true" required="true" />
  <field name="reg" type="date" required="true" />
  <field name="access" type="date" />
 </table>
 <table name="memo">
  <link name="recipient" table="user" index="true" required="true" />
  <link name="sender" table="user" index="true" required="false" />
  <field name="date" type="date" required="true" />
  <field name="status" type="sql:enum('unread','read','replied')" />
  <field name="subject" type="title" />
  <field name="body" type="message" />
 </table>

</database>

<database name="forum">

	<type name="boolean" base="sql:tinyint" default="0" />
 <table name="thread">
  <link name="author" table="network.user" index="true" />
  <field name="date" type="date" />
  <field name="subject" type="title" required="true" index="fulltext" />
  
  <table name="description" unique="true">
   <field name="description" type="message" index="fulltext" /> 
  </table>
  
  
      
  <table name="personal">
   <link name="user" table="network.user" index="unique" />
   <field name="read" type="boolean" />
  </table>
      
  <view name="recent">
   <param name="perPage" type="integer" />
   <param name="currentUser" type="member" required="false" />
  <!-- <link name="" table="personal" on="`member`=$currentUser" /> -->
  </view>
 
  <table name="comment">
   <link name="author" table="network.user" index="true" />
   <field name="date" type="date" />
   <field name="body" type="message" index="fulltext" />
   
   <table name="vote">
    <link name="user" table="network.user" index="unique" />
    <field name="favorite" type="boolean" required="true" />
   </table>
   
  </table>

 </table>
 
 <table name="node">
  <link name="parent" table="node" index="true" />
  <field name="author" type="network.user" index="true" />
  <field name="title" type="title" required="true" index="fulltext" />
  <field name="body" type="message" required="true" index="fulltext" />
 </table>
</database>

	
</schema>


var sql = new alt.squeal.SQLSchema();

sql.add(xml);

Rhino.require('alt.delight.Delight');

java.lang.Class.forName("com.mysql.jdbc.Driver");
var db = java.sql.DriverManager.getConnection("jdbc:mysql://localhost/", "root", "");
var delight = new alt.delight.Delight(sql, db);


o.print('<span class="squeal">' + sql.toHTML() + '</span>');

o.println("</body>");
o.println("</html>");



