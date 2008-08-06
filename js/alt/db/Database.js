
var Database = {};
Database.hashmap = new java.util.HashMap();
Database.get = function(dbconn) {
	var d = Database.hashmap.get(dbconn);
	if (!d) {
		d = new DataStore(dbconn);
		Database.hashmap.put(dbconn, d);
	}
	return d;
}

/**
 * @private
 * @param {Object} dbconn
 */
function DataStore(dbconn) {
	this.dbconn = dbconn;
	try {
		/*
		 * TYPE:
		 *  0 - none
		 *  1 - object
		 *  2 - string
		 *  3 - int
		 *  4 - date
		 */
		var st = dbconn.createStatement();
		st.executeUpdate('CREATE TABLE IF NOT EXISTS dataStore (' +
		' id IDENTITY PRIMARY KEY,' +
		' parent BIGINT NULL,' +
		' name VARCHAR NULL,' +
		' type TINYINT NOT NULL,'+
		' stringValue VARCHAR NULL,' +
		' intValue INT NULL,' +
		' dateValue DATETIME NULL' +
		')');
		st.executeUpdate('ALTER TABLE dataStore ADD FOREIGN KEY(parent) REFERENCES dataStore ON DELETE CASCADE')
		st.executeUpdate('INSERT INTO dataStore SET parent=NULL,type=1,name="root"');
	} catch (ex) {}
	this.store = new DataNode(1);
}
DataStore.prototype.toString = function() {
	return "alt.db.DataStore["+this.dbconn+"]";
}

function DataNode(ds,id) {
	this._ds = ds;
	this._id = id;
	this._data = {};
	return new alt.util.ScriptableWrapper(this,"get","set");
} 
DataNode.prototype.get = function(name) {
	var st = ds.dbconn.createStatement();
	st.executeQuery('SELECT * FROM dataStore WHERE ');
}
DataNode.prototype.set = function(name,value) {
	
}
