/**
 * @fileoverview
 * This file specifies the core cello.SQLSchema class, providing methods
 * for creating, and analyzing SQL Schema files.  It requires the 
 * cello.SimpleXML class to parse XML files and is the base for the
 * various SQueaL modules.
 */
 
Rhino.require('alt.squeal.Exception');
Rhino.require('alt.squeal.Node');
Rhino.require('alt.squeal.Database');
Rhino.require('alt.squeal.Table');
Rhino.require('alt.squeal.Type');
Rhino.require('alt.squeal.View');
Rhino.require('alt.squeal.Link');
Rhino.require('alt.squeal.Field');
Rhino.require('alt.squeal.ID');

/**
 * Creates a new SQueaL object based on a cello.SimpleXML source.
 * @class
 * The main cello.SQLSchema class
 * @constructor
 * @requires cello.SimpleXML
 * @param {cello.SimpleXML} xml base cello.SimpleXML object to use as reference
 */
SQLSchema = function(xml) {

	this.parent = null;
	
	this.verified = false;
	this.valid = false;

	if (xml instanceof cello.SimpleXML)
		this.add(xml);
}

/**
 * Returns a string representation of this object.
 * @returns a string representation of this object
 * @type String
 */
SQLSchema.prototype.toString = function() {
	return "[cello.SQLSchema]";
}


/**
 * Returns whether or not this SQLSchema is valid or not (checks for
 * things like cyclic dependencies and broken links).
 * @returns true if the schema is valid
 * @type boolean
 */
SQLSchema.prototype.isValid = function() {
	if (this.verified) return this.valid;
	
}

/**
 * Add definitions from a cello.SimpleXML object.
 * @param {cello.SimpleXML} xml cello.SimpleXML object to add definitions from
 * @throws Exception if there was an error adding definitions
 */
SQLSchema.prototype.add = function(xml) {		
	this.verified = false;
	
	if (!(xml instanceof cello.SimpleXML))
		throw new Exception("add only takes cello.SimpleXML type");

	if (xml.tag != 'schema')
		throw new Exception("Invalid XML (must have schema tag)");
	
	var schema = this;
	
	this.databases = new Array();
	
	for (var i in xml.children) {
		var child = xml.children[i];
		switch (child.tag) {
			case 'types':
				for (var x in child.children)
					handleType(this, child.children[x]);
				break;
			case 'database':
				var db = child.attributes.name;

				if (!this.databases[db])
					this.databases[db] = new Database(db, this);
					
					
				for (var x in child.children) 
					switch (child.children[x].tag) {
						case 'table':
							handleTable(this.databases[db], child.children[x]);
							break;
						case 'type':
							handleType(this.databases[db], child.children[x]);
							break;
						default:
							throw new Exception("Expected (table|type), got '"+table.name+"'.");
					}
				break;
			case 'table':
				handleTable(this, child);
				break;
			default:
				throw new Exception("Unknown tag '"+child.name+"'.");
		}
	}

	/**
	 * Handles a cello.SimpleXML "type" node
	 * @param {Node}	parent	The node this type belongs to.
	 * @param {cello.SimpleXML}		xml		The cello.SimpleXML node for the type.
	 * @throws Exception if there was an error in the type
	 */
	function handleType(parent, xml) {
		if (xml.tag != 'type')
			throw new Exception("Expected type, got '"+type.name+"'.");
			
		addType(parent, xml.attributes['name'], xml.attributes);
	}
	
	/**
	 * Adds a type to the schema.
	 * @param {Node}	parent	The node this type belongs to.
	 * @param {cello.SimpleXML}		xml		The cello.SimpleXML node for the type.
	 * @throws Exception if there was an error in the type
	 */
	function addType(parent, name, attributes) {
		var type = new Type(name, parent);
		
		type.base			= attributes['base'];
		type.defaultValue	= attributes['default'];
		type.valid			= attributes['valid'];

		if (!parent.types) 
			parent.types = new Array();
		parent.types[name] = type;
	}
	
	/**
	 * Handles a cello.SimpleXML table tag, adding it and its children to the schema.
	 * @param {Node}	parent	The node this table belongs to.
	 * @param {cello.SimpleXML}			xml		The cello.SimpleXML node for the table.
	 * @throws Exception if there was an error in the table
	 */
	function handleTable(parent, xml) {
		
		// Get name
		var name = xml.attributes['name'];
		
		var type = 'sql:int';
		
		// Initialize table information
		var table = new Table(name, parent);
		table.type = xml.attributes['type'] ? xml.attributes['type'] : 'int';
		table.encoding = xml.attributes['encoding'];
		table.fields = new Array();
		table.parent = parent;
		
		// Store in tree
		if (!parent.tables) parent.tables = new Array();
		parent.tables[name] = table;
		
		
		// Unique tables map directly to their parent table and 
		// do not have their own auto_increment id
		var unique = xml.attributes['unique'] == 'true';
		
		
		// Non-unique tables need an id to distinguish entries
		if (!unique) {
			addId(table, name);
			/*
			addLink(table,
					 'id', 
					 { table: name, required: 'true', index: 'primary', increment: true}, 
					 true);
			*/
			// Add the type to the current node (this may be redundant, since
			// we can find the type through the parent.tables array).
			//addType(parent,			name,		{base:type});
		}
		
		// Tables with the parent attribute allow remote linking 
		// to other tables. (This is kinda weird.)
		if (xml.attributes['parent']) {
			var parentName = xml.attributes['parent'];
			// This may change in the future to calculate the field name
			// with better respect to namespace.
			addLink(table,
					 parentName+'.id',
					 { table: parent, index: (unique ? 'primary' : 'true')},
					 true);
		}
		
		// Create link to parent table (if there is one)
		if (parent instanceof Table) {
			addLink(table,
					 'parent.id', 
					 { table: parent.name, index: (unique ? 'primary' : 'true')}, 
					 true);
		}
		
		// Look at children.  All sorts going on here!
		for (var i in xml.children) { 
			var field = xml.children[i];
			switch (field.tag) {
				case 'table':
					handleTable(table, field);
					break;
				case 'type':
					handleType(table, field);
					break;
				case 'link':
					addLink(table, field.attributes['name'], field.attributes, false);
					break;
				case 'field':
					addField(table, field.attributes['name'], field.attributes, false);
					break;
				case 'view':
					// TODO: handle views 
					break;
				default:
					throw new Exception("Expected (table|type|link|field), got '"+field.name+"'.");
					break;
			}
		}
	}
	/**
	 * Translates an index name into a valid name.
	 * @param {String} index
	 * @returns the new name (or false)
	 * @type String
	 */
	function getIndex(index) {
		switch (index) {
			case 'unique':
			case 'primary':
			case 'fulltext':
				return index;
			case 'true':
			case 'index':
				return 'index';
		}
		return false;
	}
	/**
	 * Adds a field to the table
	 * @param {Table} table the table object
	 * @param {String} name the name of the field
	 * @param {Map} attributes the attributes of this field
	 * @param {boolean} hidden whether or not this field is "hidden"
	 */
	function addField(table, name, attributes, hidden) {
		var field = new Field(name, table);
		
		field.type =			attributes['type'];
		field.hidden =			hidden;
		field.required =		attributes['required']=='true';
		field.defaultValue =	attributes['default'];
		field.index =			getIndex(attributes['index']);
		field.extra =			attributes['extra'];
		
		table.fields.push(field);
	}
	/**
	 * Adds a link field to the table
	 * @param {Table} table the table object
	 * @param {String} name the name of the field
	 * @param {Map} attributes the attributes of this field
	 * @param {boolean} hidden whether or not this field is "hidden"
	 */
	function addLink(table, name, attributes, hidden) {
		var link = new Link(name, table);
		
		link.type = 			attributes['table'];
		link.hidden = 			hidden;
		link.required =			attributes['required']=='true';
		link.index =			getIndex(attributes['index']);
		
		table.fields.push(link);
	}
	
	/**
	 * Adds an id field to the table
	 * @param {Table} table the table object
	 * @param {String} name the name of the field
	 */
	function addId(table, name) {
		var link = new ID('id', table);
		
		link.type = 			name;
		link.hidden = 			true;
		link.required =			true;
		link.index =			'primary';
		
		table.fields.push(link);
	}
}
/**
 * Validates the SQL Schema and verifies whether it actually can be
 * used in its present form
 */
 
SQLSchema.prototype.validate = function(node) {
	if (!node) node = this;
	
	if (node.databases)
		for (var x in node.databases)
			this.validate(node.databases[x]);
			
	if (node.tables)
		for (var x in node.tables)
			this.validate(node.tables[x]);
}

