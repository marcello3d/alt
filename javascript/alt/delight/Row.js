/**
 * Constructs a new Row object
 * @class
 * The main base class for cello.Delight rows.  This class is "abstract" and should
 * not be created directly.  {@link Results} objects will return Row
 * objects.
 * @constructor
 */
Row = function() {
}


/**
 * Initializes the row.
 */
Row.prototype.init = function(table) {
	if (!table)
		throw new Exception("Attempting to create an unlinked row.");

	this._ = {};
	this.delightTable = table;
}
/**
 * Returns the SQL String of this Row for inserts and updates.
 * @returns a SQL formatted string of this row (the id)
 */
Row.prototype.toSQLString = function() {
	return this.id;
}

Date.prototype.toSQLString = function() {
    var sdf = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    return '"'+sdf.format(this)+'"';
}
/**
 * Gets an internal representation of the SQL set list.
 * @return a string of settings
 * @type String
 */
Row.prototype.getSQLSet = function() {
	var set = '';
	for (var x in this._) {
		var item = this._[x];
		if (!item.modified || !item.value || !item.value.toString)
			continue;
		var field = this.delightTable.fields[x];
		if (field && (field instanceof cello.SQLSchema.Field)) {
			if (set)
				set += ',';
			var value = "NULL";
			if (item.value) {
				if (item.value.toSQLString) {
					value = item.value.toSQLString();
				} else {
					value = '"'+cello.SQLSchema.sql.escapeString(item.value.toString())+'"';
				}
			}
			set += '`'+field.name+'`='+value;
		}
	}
	if (!set) 
		throw new AddException("No variables to set!");
	return set;
}
/**
 * Defines the add method for rows in this table.
 * @see Row#add
 */
Row.prototype.add = function() {
	if (this.has('id'))
		throw new AddException("This row has already been added.");
		
	var validation = this.validate();
	if (validation !== true)
		throw new ValidationException(validation);
		
	var set = this.getSQLSet();
	
	// Link into parent table.
	if (this.delightTable.getParentID)
		set += ",`parent.id`=" + this.delightTable.getParentID();
	
	var result = cello.SQLSchema.sql.alter(this.delightTable.conn,
		"INSERT INTO "+this.delightTable.schema.getSQLName()+
		" SET "+set
	);
	if (result>0) {
		this.define(
			'id',
			true, // readonly
			cello.SQLSchema.sql.getLastId(this.delightTable.conn)
		);
		return true;
	}
	return false;
}
/**
 * Defines the update method for rows in this table.
 * @see Row#update
 */
Row.prototype.update = function() {
	if (!this.has('id'))
		throw new AddException("This row has not been added.");
		
	var validation = this.validate();
	if (validation !== true)
		throw new ValidationException(validation);
		
	var set = this.getSQLSet();
				
	var result = cello.SQLSchema.sql.alter(this.delightTable.conn,
		"UPDATE "+this.delightTable.schema.getSQLName()+
		" SET "+set+
		" WHERE id="+this.id
	);
	if (result>0)
		return true;
	return false;
}

/**
 * Returns a string representation of this row
 * @returns string representation
 * @type String
 */
Row.prototype.toString = function() {
	return "[Row:"+this.delightTable.fullname+"]";
}
/**
 * Removes the row from the table.
 * @throws Exception when trying to use this abstract call
 */
Row.prototype.remove = function() {
	// TODO: add removal
	throw new Exception("Remove has not been written yet.");
}

/**
 * Validates this row.
 * @return whether validation was successful
 * @type boolean
 */
Row.prototype.validate = function() {
	return true;
}
/**
 * Sets values in a row.  Note, you also need to invoke add() or update(),
 * as applicable, to modify the database.
 * This method can be called with three formats:
 * <pre>set(name, value)
 * set(row)
 * set(map)</pre>
 * @param {String}		name	the field name : Row.set(name, value)
 * @param {Object}		value	the value
 * @param {Row} row		a row to copy : Row.set(row)
 * @param {Map} 		map		a map of values to use : Row.set(map)
 * @throws SetException if there was an error setting a value
 */
Row.prototype.set = function(name, value) {
	writeln(this+".set("+name+","+value+")");
	if (arguments.length == 1) {
		var a = arguments[0];
		if (a instanceof Row) {
			// Copy the rows
			for (var name in a._)
				this.set(name, a._[name].value);
		} else {
			for (var name in a)
				this.set(name,a[name]);
		}
	} else if (arguments.length == 2) {
		if (!this._[name]) {
			// Create row on the fly, if it's a valid row.
			// This a delayed write feature, so that unused fields
			// are never actually created.
			if (this.delightTable.fields[name]) {
				this.define
				var field = this.delightTable.fields[name];
				this.define(
					field.name, 
					field instanceof cello.SQLSchema.ID, // The row id should be readonly
					null // null default value? (we set it below, anyway)
				);
			} else if (this.delightTable.tables[name]) {
				// We cannot assign to inner tables, they're readonly
				// However, there's no need to actually create the table
				// in this case, since this throws an exception.
				// We'll do that in get(name)
				throw new SetException("Attempting to assign to an inner table.",name,value);
			} else
				throw new SetException("Column is undefined.",name,value);
		}
		if (this._[name].readonly)
			throw new SetException("Column is readonly.",name,value);
		this._[name].value = value;
		this._[name].modified = true;
	}
}
/**
 * Gets a value from the row.
 * @param {String} name name of the field
 * @returns the value of the field
 * @throws GetException if the field could not be retrieved
 */
Row.prototype.get = function(name) {
	writeln(this+".get("+name+")");
	if (!this._[name]) {
		if (this.delightTable.fields[name]) {
			// TODO: Retrieve data from the database immediately?
			// How much should we retrieve, everything? just the value?
			throw new GetException("We know about this field, but have no value.",name);
		} else if (this.delightTable.tables[name]) {
			this.define(
				name,
				true, // readonly
				new this.delightTable.innerTables[name](this._sw)
			);
		} else
			throw new GetException("Undefined field",name);
	}
	return this._[name].value;
}

/**
 * Returns whether this row has a particular value.
 * @param {String} name name of the field
 * @returns true if this row has a value defined for this field
 * @type boolean
 */
Row.prototype.has = function(name) {
	return this._[name] && this._[name].value;
}
/**
 * @private
 * Defines a field in this row.
 * @param {String}	name		the name of the field
 * @param {boolean}	readonly	whether the field is readonly
 * @param {Object}	value		the initial value for the field
 */
Row.prototype.define = function(name, readonly, value) {
	//writeln(this+".define("+name+","+readonly+","+value+")");
	this._[name] = { 
		modified: false,
		readonly: readonly,
		value: value
	};
}
/**
 * Returns an array of field names defined for this particular row object
 * @returns an array of field names from this row
 * @type Array
 */
Row.prototype.getFields = function() {
	var a = new Array();
	for (var x in this._)
		a.push(x);
	return a;
}
/**
 * Returns an HTML string representation of this row object (recursively).
 * @returns A HTML respresentation of this row
 * @type String
 */
Row.prototype.toHTML = function() {
	var s = '<table class="row">';
	s += '   <tr class="header"><th>Name</th><th>Modified</th><th>Read-only</th><th>Value</th></tr>\n';
	
	for (var name in this._) {
		var field = this._[name];
		if (field)
			s += '    <tr class="data"><td>'+name+'</td><td>'+
				(field.modified?'Yes':'No')+'</td><td>'+
				(field.readonly?'Yes':'No')+'</td><td>'+
				(field.value&&field.value.toHTML ? field.value.toHTML() : field.value)+'</td></tr>\n';
	}
	s += '</table>';

	return s;
}
