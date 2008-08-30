
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
		
//		var st = dbconn.createStatement();
//		st.executeUpdate('CREATE TABLE IF NOT EXISTS dataStore (' +
//		' id IDENTITY PRIMARY KEY,' +
//		' parent BIGINT NULL,' +
//		' name VARCHAR NULL,' +
//		' type TINYINT NOT NULL,'+
//		' stringValue VARCHAR NULL,' +
//		' intValue INT NULL,' +
//		' dateValue DATETIME NULL' +
//		')');
//		st.executeUpdate('ALTER TABLE dataStore ADD FOREIGN KEY(parent) REFERENCES dataStore ON DELETE CASCADE')
//		st.executeUpdate('INSERT INTO dataStore SET parent=NULL,type=1,name="root"');
		
//		var st = dbconn.createStatement();
//		st.executeUpdate('CREATE TABLE IF NOT EXISTS data (' +
//		' id IDENTITY PRIMARY KEY,' +
//		' type TINYINT NOT NULL,'+
//		' stringValue VARCHAR NULL,' +
//		' intValue INT NULL,' +
//		' dateValue DATETIME NULL' +
//		')');
//		// insert root node
//		st.executeUpdate('INSERT INTO data (id,type) VALUES(1,1)');
//		
//		st.executeUpdate('CREATE TABLE IF NOT EXISTS links (' +
//		' parent BIGINT NOT NULL,' +
//		' child BIGINT NULL,' +
//		' name VARCHAR NULL,' +
//		' index BIGINT NOT NULL' +
//		')');
//		st.executeUpdate('ALTER TABLE links ADD FOREIGN KEY(parent) REFERENCES data ON DELETE CASCADE')
//		st.executeUpdate('ALTER TABLE links ADD FOREIGN KEY(child) REFERENCES data ON DELETE SET NULL')

		if (!dbconn.metaData.getTables(null, null, "data", null).next()) {
			var st = dbconn.createStatement();
			st.executeUpdate('CREATE TABLE data (' +
			' id IDENTITY PRIMARY KEY,' +
			' string VARCHAR NULL' +
			')');
			st.executeUpdate('CREATE UNIQUE INDEX ON data(string)');
			// insert root node
			st.executeUpdate('INSERT INTO data (id) VALUES(1)');
			
			
			st.executeUpdate('CREATE TABLE IF NOT EXISTS links (' +
			' parent BIGINT NOT NULL,' +
			' type TINYINT NOT NULL,' +
			' name VARCHAR NOT NULL,' +
			' index BIGINT NULL,' +
			' value BIGINT NULL' +
			')');
			st.executeUpdate('ALTER TABLE links ADD FOREIGN KEY(parent) REFERENCES data ON DELETE CASCADE')
			st.executeUpdate('CREATE PRIMARY KEY ON links(parent,name)');
			
		}
		
	} catch (ex) { }
	this.root = new DataNode(this,1);
}
DataStore.prototype.cleanup = function() {
	var st = this.dbconn.createStatement();
	st.executeUpdate('DELETE FROM data WHERE id>1 AND NOT EXISTS (SELECT parent FROM links WHERE type>0 AND value=id)');
}
DataStore.prototype.toString = function() {
	return "alt.db.DataStore["+this.dbconn+"]";
}

// Negative types are stored by value
DataStore.INT = -1;
DataStore.BOOLEAN = -2;
DataStore.DATE = -3;

DataStore.OBJECT = 1;
DataStore.ARRAY = 2;
DataStore.COLLECTION = 3;
DataStore.STRING = 4;
DataStore.FUNCTION = 5;
DataStore.DOUBLE = 6;
/**
 * Execute some data actions as an atomic action.
 * @param {Function} f
 */
DataStore.prototype.atomic = function(f,thiz,args) {
	// If autoCommit is already false, then we're in a transaction.
	var auto = this.dbconn.autoCommit;
	// Turn it off and set a savepoint
	this.dbconn.autoCommit = false;
	var save = this.dbconn.setSavepoint();
	try {
		// execute the atomic code
		f.apply(thiz,args);
		// if we aren't in a transaction, commit
		if (auto) 
			this.dbconn.commit();
	} catch (ex) {
		// if we encounter an exception, rollback to the savepoint
		this.dbconn.rollback(save);
		// and rethrow the exception 
		throw ex;
	} finally {
		// Make sure we restore the autocommit flag
		this.dbconn.autoCommit = auto;
	}
}

function DataNode(ds,id) {
	this._ds = ds;
	this._id = id;
	return new alt.util.ScriptableWrapper(this,
		function get(name) {
			if (!this._id)
				return undefined;
			
			var st = this._ds.dbconn.prepareStatement(
							'SELECT type,value,string '+
							'FROM links LEFT JOIN data ON (type>=0 AND value=id) '+
							'WHERE parent=? AND name=?');
			st.setLong(1,this._id);
			st.setString(2,name);
			var result = st.executeQuery();
			if (result.next())
				return this.__getData(result);
			return undefined;
		},
		function set(name,obj) {
			// store _id properly.
			if (name=="_id") return false;
			this._ds.atomic(function(name,obj){
				
				Alt.log(this+" set "+name);
				var savepoint = this._ds.dbconn.setSavepoint();
				var thiz = this;
				
				function storeValue(value) {
					try {
						var pst = thiz._ds.dbconn.prepareStatement('INSERT INTO data (string) VALUES(?)');
						pst.setString(1, value.toString());
						pst.executeUpdate();
						var keys = pst.generatedKeys;
						keys.next();
						return keys.getLong(1);
					} catch (ex) {
						var pst = thiz._ds.dbconn.prepareStatement('SELECT id FROM data WHERE string = ?');
						pst.setString(1, value.toString());
						var result = pst.executeQuery();
						result.next();
						return result.getLong(1);
					}
				}
				
				var type = 0;
				var value = null;
				switch (typeof obj) {
					case 'object':
						if (value instanceof Date) {
							type = DataStore.DATE;
							value = obj.getTime();
						} else if (value instanceof DataNode) {
							Alt.log("datanode");
							type = DataStore.OBJECT;
							// Copy datastore node over, if necessary
							value = obj.__getDNId(this);
						} else {
							type = DataStore.OBJECT;
							// Make a new datanode to clone the object
							var node = new DataNode(this._ds);
							value = node.__getDNId();
							// Copy values over
							for (var name in obj)
								node[name] = obj[name];
						}
						break;
						
					case 'boolean':
						type = DataStore.BOOLEAN;
						value = obj ? 1 : 0;
						break;
						
					case 'number':
						if (value == parseInt(obj)) {
							type = DataStore.INT;
							value = parseInt(obj);
							break;
						} else {
							type = DataStore.DOUBLE;
							value = storeValue(obj);
							break;
						}
					case 'string':
						type = DataStore.STRING;
						value = storeValue(obj);
						break;
						
					case 'function':
						type = DataStore.FUNCTION;
						value = storeValue(obj);
						break;
						
					case 'undefined':
						throw "Cannot store undefined";
				}
				
				var pst = this._ds.dbconn.prepareStatement('MERGE INTO links (parent,type,name,value) VALUES(?,?,?,?)');
				pst.setLong(1, this.__getDNId());
				pst.setByte(2, type);
				pst.setString(3, name);
				pst.setLong(4, value);
				pst.executeUpdate();
			},this,[name,obj]);// atomic
		},
		function del(name) {
			Alt.log(this+" delete "+name);
			var pst = this._ds.dbconn.prepareStatement('DELETE FROM links WHERE parent=? AND name=?');
			pst.setLong(1, this.__getDNId());
			pst.setString(2, name);
			pst.executeUpdate();		
		}
		); 
}
DataNode.prototype.__getDNId = function(ds) {
	if (ds && !this._ds)
		this._ds = ds;
	if (!this._id) {
		var st = this._ds.dbconn.createStatement();
		st.executeUpdate('INSERT INTO data (id,string) VALUES(NULL,NULL)');
		var keys = st.generatedKeys;
		keys.next();
		this._id = keys.getLong(1);
		Alt.log(this+" initialize (id now = "+this._id+")");
	}
	return this._id;
} 
/**
 * Returns an iterator for this node.
 * An interator is an object with a next function that can be called. 
 * However, thanks to generators in JavaScript 1.7 a function becomes an 
 * iterator if it uses the yield command.
 */
DataNode.prototype.__defineGetter__("__iterator__", function() {
//	return function(pair) {
		Alt.log(this+" iterate("+pair+")")
		var node = this;
		var st = node._ds.dbconn.prepareStatement('SELECT name FROM links WHERE parent=?');
		st.setLong(1, node._id);
		var result = st.executeQuery();
		while (result.next()) {
			yield (result.getString("name"));
		}
//	}
});
DataNode.prototype.__getData = function(result) {
	var type = result.getInt("type");
	switch (type) {
		case DataStore.OBJECT:
			return new DataNode(this._ds, result.getLong("value"));
			
		case DataStore.ARRAY:
			return new DataArray(this._ds, result.getLong("value"));
			
		case DataStore.COLLECTION:
			return new DataCollection(this._ds, result.getLong("value"));
			
		case DataStore.INT:
			return result.getLong("value");
			
		case DataStore.DATE:
			return new Date(result.getLong("value"));
			
		default:
		case DataStore.STRING:
			return result.getString("string");
	}
	
}
DataNode.prototype.toString = function() {
	return "[DataNode id="+this._id+"]";
}
