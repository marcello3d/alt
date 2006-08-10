
Alt.require('alt.resource.XML');

new Packages.org.hsqldb.jdbcDriver();
var db = java.sql.DriverManager.getConnection("jdbc:hsqldb:file:db/testdb");

var list = <ul/>;

function log(message) {
	//Alt.log(message);
	list.appendChild(<li>{message}</li>);
}

var xml = Loader.load("HSQL.xml");

var stmt = db.createStatement();
try {
    stmt.executeUpdate("CREATE TABLE COFFEES " +
          "(COF_NAME VARCHAR(32), SUP_ID INTEGER, PRICE FLOAT, " +
            "SALES INTEGER, TOTAL INTEGER)");
} catch (ex) {
    // already created table
}

stmt.executeUpdate("INSERT INTO COFFEES VALUES ('French_Roast', 49, 8.99, 0, 0)");
stmt.executeUpdate("INSERT INTO COFFEES VALUES ('Espresso', 150, 9.99, 0, 0)");
stmt.executeUpdate("INSERT INTO COFFEES VALUES ('Colombian_Decaf', 101, 8.99, 0, 0)");
stmt.executeUpdate("INSERT INTO COFFEES VALUES ('French_Roast_Decaf', 49, 9.99, 0, 0)");

var rs = stmt.executeQuery("SELECT COF_NAME, PRICE FROM COFFEES");
while (rs.next()) {
    var s = rs.getString("COF_NAME");
    var n = rs.getFloat("PRICE");
	list.appendChild(<li>{s}: {n}</li>);
}

xml..p.(@id=="db").appendChild(db);
xml..p.(@id=="log").appendChild(list);

response.contentType = "text/html; charset=UTF-8";
response.status = response.SC_OK;
response.writer.print(xml);
