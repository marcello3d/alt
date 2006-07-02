/**
 * @fileoverview
 * This file specifies toHTML extensions for the cello.SQLSchema 
 * class, making it easy to debug and output a SQL Schema object
 * in an organized heirarchal table.
 *
 * This is only necessary for debugging and administration purposes.
 * It is not needed to use SQL Schema.
 */

if (typeof(cello) == "undefined") cello = {};

cello['import SQLSchema.toHTML'] = (function(scope) {
	
	cello.load('SQLSchema');
	
/**
 * Generates HTML display of the current schema
 * @returns a string containing HTML for display
 * @type String
 */
cello.SQLSchema.prototype.toHTML = function() {
	var s = '<table class="schema">';
	
	s += cello.SQLSchema.typesToHTML(this.types);
	s += cello.SQLSchema.arrayToHTML(this.tables, "Tables",5);
	s += cello.SQLSchema.arrayToHTML(this.databases, "Databases",5);
	
	s += '</table>';
	return s;
}

/** 
 * @private
 * Internal method used by toHTML to generate rows for a table
 * based on an array of cello.SQLSchema.Node objects.
 */
cello.SQLSchema.arrayToHTML = function(array, entry, columns) {
	if (array) {
		var span = '';
		if (columns>2)
			span =  ' colspan="'+(columns-1)+'"';
		var s = '   <tr class="header"><th>'+entry+'</th><th'+span+'>...</th></tr>\n';
		for (var x in array)
			s+='    <tr class="row"><td>' + array[x].name + '</td><td'+span+'>' + array[x].toHTML() + '</td></tr>\n';
		return s;
	}
	return '';
}
/** 
 * @private
 * Internal method used by toHTML to generate rows for a table
 * based on an array of cello.SQLSchema.Field objects.
 * @returns an html table
 * @type String
 */
cello.SQLSchema.fieldsToHTML = function(fields) {
	if (fields) {
		var s = '   <tr class="header"><th>Field</th><th>type</th><th>Required</th><th>Default</th><th>Index</th></tr>\n';
		for (var x in fields) {
			var field = fields[x];
			var type = "Unknown";
			try {
				type = field.findType();
				if (type instanceof cello.SQLSchema.Node)
					type = "["+type.fullname+"]";
				else
					type = "";
			} catch (ex) {
				type="[error:"+ex+"]";
			}
			s += '    <tr class="'+(field.hidden?'hidden':'row')+'"><td>'+field.name+'</td><td>'+
				field.type+' '+type+'</td><td>'+
				(field.required?'Yes':'No')+'</td><td>'+
				(field.defaultValue?'"'+field.defaultValue+'"':'No')+'</td><td>'+
				(field.index ? field.index : 'No')+'</td></tr>\n';
		}
		return s;
	}
	return '';
}

/** 
 * @private
 * Internal method used by toHTML to generate rows for a table
 * based on an array of cello.SQLSchema.Type objects.
 * @returns an html table
 * @type String
 */
cello.SQLSchema.typesToHTML = function(types) {
	if (types) {
		var s = '   <tr class="header"><th>Types</th><th>Base</th><th>Validation</th><th>Default</th></tr>\n';
	
		for (var name in types) {
			var type = types[name];
			s += '    <tr class="type"><td>'+type.name+'</td><td>'+
				type.base+'</td><td>'+
				(type.valid?'"'+type.valid+'"':'No')+'</td><td>'+
				(type.defaultValue?'"'+type.defaultValue+'"':'No')+'</td></tr>\n';
		}
		return s;
	}
	return '';
}




/** 
 * Generic toHTML definition for cello.SQLSchema.Node objects
 * @returns an HTML string representation of this node
 * @type String
 */
cello.SQLSchema.Node.prototype.toHTML = function() {
	return this.toString();
}

/** 
 * HTML definition of a database (recursively retrieves HTML definitions for children).
 * @returns an HTML string representation of this database
 * @type String
 */
cello.SQLSchema.Database.prototype.toHTML = function() {

	var s = '<table class="database">';
	
	s += cello.SQLSchema.typesToHTML(this.types);
	s += cello.SQLSchema.arrayToHTML(this.tables, "Tables", 5);
		
	s += '</table>';
	
	return s;
}
/** 
 * HTML definition of a table (recursively retrieves HTML definitions for children).
 * @returns an HTML string representation of this table
 * @type String
 */
cello.SQLSchema.Table.prototype.toHTML = function() {

	var s = '  <table class="table">';
	

	s += cello.SQLSchema.fieldsToHTML(this.fields);
	s += cello.SQLSchema.typesToHTML(this.types);
	s += cello.SQLSchema.arrayToHTML(this.tables,	"Tables", 5);
	s += cello.SQLSchema.arrayToHTML(this.views,	"Views",  5);
	
	s += '  </table>';
	
	return s;
}

});// import
