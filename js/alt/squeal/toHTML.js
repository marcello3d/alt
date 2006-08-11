/**
 * @fileoverview
 * This file specifies toHTML extensions for the cello.SQLSchema 
 * class, making it easy to debug and output a SQL Schema object
 * in an organized heirarchal table.
 *
 * This is only necessary for debugging and administration purposes.
 * It is not needed to use SQL Schema.
 */

Alt.require('alt.squeal.SQLSchema', true);
Alt.require('alt.squeal.Node', true);
Alt.require('alt.squeal.Database', true);
Alt.require('alt.squeal.Table', true);

/**
 * Generates HTML display of the current schema
 * @returns a string containing HTML for display
 * @type String
 */
SQLSchema.prototype.toHTML = function() {
	return <table class="schema">
			 {SQLSchema.typesToHTML(this.types)}
			 {SQLSchema.arrayToHTML(this.tables, "Tables",5)}
			 {SQLSchema.arrayToHTML(this.databases, "Databases",5)}
		   </table>;
}

/** 
 * @private
 * Internal method used by toHTML to generate rows for a table
 * based on an array of cello.SQLSchema.Node objects.
 */
SQLSchema.arrayToHTML = function(array, entry, columns) {
	if (array) {
		var s = <><tr class="header">
					<th>{entry}</th>
					<th colspan="4">...</th>
				  </tr></>;
		for each (var x in array)
			s.appendChild(<tr class="row"><td>{x.name}</td><td colspan="4">{x.toHTML()}</td></tr>);
		return s;
	}
	return <></>;
}
/** 
 * @private
 * Internal method used by toHTML to generate rows for a table
 * based on an array of cello.SQLSchema.Field objects.
 * @returns an html table
 * @type String
 */
SQLSchema.fieldsToHTML = function(fields) {
	if (fields) {
		var s = <><tr class="header"><th>Field</th><th>type</th><th>Required</th><th>Default</th><th>Index</th></tr></>;
		for (var x in fields) {
			var field = fields[x];
			var type = "Unknown";
			try {
				type = field.findType();
				if (type instanceof Node)
					type = "["+type.fullname+"]";
				else
					type = "";
			} catch (ex) {
				type="[error:"+ex+"]";
			}
			s.appendChild(
				<tr class={field.hidden?'hidden':'row'}>
				 <td>{field.name}</td>
				 <td>{field.type} {type}</td>
				 <td>{field.required?'Yes':'No'}</td>
				 <td>{field.defaultValue?'"'+field.defaultValue+'"':'No'}</td>
				 <td>{field.index || 'No'}</td>
				</tr>);
		}
		return s;
	}
	return <></>;
}

/** 
 * @private
 * Internal method used by toHTML to generate rows for a table
 * based on an array of cello.SQLSchema.Type objects.
 * @returns an html table
 * @type String
 */
SQLSchema.typesToHTML = function(types) {
	if (types) {
		var s = <><tr class="header"><th>Types</th><th>Base</th><th>Validation</th><th>Default</th></tr></>;
	
		for (var name in types) {
			var type = types[name];
			s.appendChild(
				<tr class="type">
				 <td>{type.name}</td>
				 <td>{type.base}</td>
				 <td>{type.valid?'"'+type.valid+'"':'No'}</td>
				 <td>{type.defaultValue?'"'+type.defaultValue+'"':'No'}</td>
				</tr>);
		}
		return s;
	}
	return <></>;
}




/** 
 * Generic toHTML definition for cello.SQLSchema.Node objects
 * @returns an HTML string representation of this node
 * @type String
 */
Node.prototype.toHTML = function() {
	return this.toString();
}

/** 
 * HTML definition of a database (recursively retrieves HTML definitions for children).
 * @returns an HTML string representation of this database
 * @type String
 */
Database.prototype.toHTML = function() {
	return <table class="database">
			 {SQLSchema.typesToHTML(this.types)}
			 {SQLSchema.arrayToHTML(this.tables, "Tables", 5)}
		   </table>;
}
/** 
 * HTML definition of a table (recursively retrieves HTML definitions for children).
 * @returns an HTML string representation of this table
 * @type String
 */
Table.prototype.toHTML = function() {

	return <table class="table">
			 {SQLSchema.fieldsToHTML(this.fields)}
			 {SQLSchema.typesToHTML(this.types)}
			 {SQLSchema.arrayToHTML(this.tables,	"Tables", 5)}
			 {SQLSchema.arrayToHTML(this.views,		"Views",  5)}
		   </table>;
}

