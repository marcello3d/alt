/**
 * @fileoverview
 * This file specifies the core cello.SQLSchema class, providing methods
 * for creating, and analyzing SQL Schema files.  It requires the 
 * cello.SimpleXML class to parse XML files and is the base for the
 * various SQueaL modules.
 */
 
Alt.require('alt.squeal.Exception');
Alt.require('alt.squeal.Node');
Alt.require('alt.squeal.Database');
Alt.require('alt.squeal.Table');
Alt.require('alt.squeal.Type');
Alt.require('alt.squeal.View');
Alt.require('alt.squeal.Link');
Alt.require('alt.squeal.Field');
Alt.require('alt.squeal.ID');

/**
 * Creates a new SQueaL object based on a XML source.
 * @class
 * The main SQLSchema class
 * @constructor
 * @param {XML} xml base XML object to use as reference
 */
function SQLSchema(xml) {
 
	this.parent = null;
	
	this.verified = false;
	this.valid = false;

	if (xml instanceof XML)
		this.add(xml);
}
SQLSchema.prototype = {};

/**
 * Returns a string representation of this object.
 * @returns a string representation of this object
 * @type String
 */
SQLSchema.prototype.toString = function() {
	return "[alt.squeal.SQLSchema]";
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
 * @param {XML} xml XML object to add definitions from
 * @throws Exception if there was an error adding definitions
 */
SQLSchema.prototype.add = function(xml) {		
	this.verified = false;
	
	if (!(xml instanceof XML))
		throw new Exception("Not XML type");

	if (!xml.schema)
		throw new Exception("Invalid XML (must have schema tag)");
	
	var schema = this;
	
	this.databases = {};
	
	for each (var child in xml.children()) {
		if (child.name())
			switch (child.name().toString()) {
				case 'types':
					for each (var type in child.children()) 
						if (type)
							handleType(this, type);
					break;
				case 'database':
					var db = child.@name;
	
					if (!this.databases[db])
						this.databases[db] = new Database(db, this);
						
						
					for each (var grandchild in child.children()) 
						if (grandchild)
							switch (grandchild.name().toString()) {
								case 'table':
									handleTable(this.databases[db], grandchild);
									break;
								case 'type':
									handleType(this.databases[db], grandchild);
									break;
								default:
									throw new Exception("Expected (table|type), got '"+grandchild.name()+"'.");
							}
					break;
				case 'table':
					handleTable(this, child);
					break;
				default:
					throw new Exception("Unknown tag '"+child.name()+"'.");
			}
	}

	/**
	 * Handles a XML "type" node
	 * @param {Node}	parent	The node this type belongs to.
	 * @param {XML}		xml		The XML node for the type.
	 * @throws Exception if there was an error in the type
	 */
	function handleType(parent, xml) {
		if (xml.name() != 'type')
			throw new Exception("Expected type, got '"+type.name()+"'.");
			
		addType(parent, xml);
	}
	
	/**
	 * Adds a type to the schema.
	 * @param {Node}	parent	The node this type belongs to.
	 * @param {XML}		xml		The XML node for the type.
	 * @throws Exception if there was an error in the type
	 */
	function addType(parent, xml) {
		var type = new Type(xml.@name, parent);
		
		type.base			= xml.@base;
		type.defaultValue	= xml.@['default'];
		type.valid			= xml.@valid;

		if (!parent.types) parent.types = {};
		parent.types[xml.@name] = type;
	}
	
	/**
	 * Handles a XML table tag, adding it and its children to the schema.
	 * @param {Node}	parent	The node this table belongs to.
	 * @param {XML}		xml		The XML node for the table.
	 * @throws Exception if there was an error in the table
	 */
	function handleTable(parent, xml) {
		// Get name
		var name = xml.@name.toString();
		
		var type = 'sql:int';
		
		// Initialize table information
		var table = new Table(name, parent);
		table.type = xml.@type.length > 0 ? xml.@type : 'int';
		table.encoding = xml.@encoding;
		table.fields = new Array();
		table.parent = parent;
		
		// Store in tree
		if (!parent.tables) parent.tables = {};
		parent.tables[name] = table;
		
		
		// Unique tables map directly to their parent table and 
		// do not have their own auto_increment id
		var unique = xml.@unique == 'true';
		
		
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
		if (xml.@parent.length > 0) {
			Alt.log("xml.@parent = ["+xml.@parent+"]")
			// This may change in the future to calculate the field name
			// with better respect to namespace.
			addLink(table,
					<link name={xml.@parent+'.id'} table={parent} index={unique ? 'primary' : 'true'} />,
					true);
		}
		
		// Create link to parent table (if there is one)
		if (parent instanceof Table) {
			addLink(table,
					 <link name="parent.id" table={parent.name} index={unique ? 'primary' : 'true'} />, 
					 true);
		}
		
		// Look at children.  All sorts going on here!
		for each (var field in xml.children())
			switch (field.name().toString()) {
				case 'table':
					handleTable(table, field);
					break;
				case 'type':
					handleType(table, field);
					break;
				case 'link':
					addLink(table, field, false);
					break;
				case 'field':
					addField(table, field, false);
					break;
				case 'view':
					// TODO: handle views 
					break;
				default:
					throw new Exception("Expected (table|type|link|field), got '"+field.name()+"'.");
					break;
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
	 * @param {XML} xml   the xml node for the field
	 * @param {boolean} hidden whether or not this field is "hidden"
	 */
	function addField(table, xml, hidden) {
		var field = new Field(xml.@name, table);
		
		field.type =			xml.@type;
		field.hidden =			hidden;
		field.required =		xml.@required=='true';
		field.defaultValue =	xml.@['default'];
		field.index =			getIndex(xml.@index);
		field.extra =			xml.@extra;
		
		table.fields.push(field);
	}
	/**
	 * Adds a link field to the table
	 * @param {Table} table the table object
	 * @param {XML} xml   the xml node for the field
	 * @param {boolean} hidden whether or not this field is "hidden"
	 */
	function addLink(table, xml, hidden) {
		var link = new Link(xml.@name, table);
		
		link.type = 			xml.@table;
		link.hidden = 			hidden;
		link.required =			xml.@required=='true';
		link.index =			getIndex(xml.@index);
		
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

