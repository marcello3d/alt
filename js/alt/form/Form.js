

/**
 * Holds the datasource for a form
 * @param authenticate specify whether to add authentication to this form (default true) 
 */  
function Form(id) {
	this.id = id;
	this.fields = [];
	this.authcode = parseInt(Math.random() * 1e9);
	this.method = "POST";
	this.submitted = false;
	this.addField(new Hidden('form-id', 'Authentication', this.authcode));
	this.empty = true; 
}

Form.prototype.addField = function(field) {
	this.fields.push(field);
	this.empty = false;
}

Form.prototype.getXML = function() {
	var xml = <form method={this.method} />;
	for each (var field in this.fields)
		if (field.getXML)
			xml.appendChild(field.getXML());
			
	return xml;
}
Form.getForm = function(id) {
	
	var session = Alt.getRequestScope().dictator.session;
	
	
	if (session.data.forms == null) {
		session.data.forms = {}; 
	} else {
		var formId = Alt.getRequestScope().request.getParameter('form-id');
		var form = session.data.forms[formId];
		if (form && form.id == id && Alt.getRequestScope().request.method == form.method) {
			form.submitted = true;
			return form;
		}
	}
	var form = new alt.form.Form(id);
	session.data.forms[form.authcode] = form;
	return form; 
}
Form.prototype.validate = function(dataSource) {
	var request = Alt.getRequestScope().request;
	var validated = true;
	
	// Validate each field
	for each (var field in this.fields)
		if (field.validate) {
			field.setValue(dataSource ? dataSource[field.id] : request.getParameter(field.id));
			field.validated = field.validate();
			Alt.log("field("+field.id+"):"+field.validated);
			if (field.validated !== true)
				validated = false;
		}
	return validated;
}


/**
 * Base class for various form fields
 */
function Field(id, label, value) {
	this.id = id;
	this.label = label;
	this.value = value || '';
	this.validated = false;
}
Field.prototype.setValue = function(value) {
	this.value = value;
}


function InputField(id, label, value) {
	Field.call(this,id,label,value);
	
}
InputField.prototype = new Field;
InputField.prototype.getXML = function() {
	var x = <>
		<label for={this.id}>{this.label}</label>
		<input name={this.id} id={this.id} type={this.type} value={this.value} />
		</>;
	if (this.validated)
		x += <><b>Error! {this.validated}</b></>
	return x;
}
InputField.prototype.validate = function() {
	return true;
}

/**
 * Hidden fields are only used for authorization.  Their
 * value should match the desired value.
 */
function Hidden(id,label,desiredValue) {
	Field.call(this,id,label);
	this.desiredValue = desiredValue;
	this.setValue(desiredValue);
}
Hidden.prototype = new InputField;
Hidden.prototype.validate = function(value) {
	if (this.value != this.desiredValue)
		return this.label+' is invalid.';
	return true;
}
Hidden.prototype.getXML = function() {
	return <input name={this.id} id={this.id} type="hidden" value={this.value} />;
}

function Text(id, label, value) {
	InputField.call(this,id,label,value);
}
Text.prototype = new InputField;
Text.prototype.getXML = function() {
	var xml = <>
		<label for={this.id}>{this.label}: </label>
		<input name={this.id} id={this.id} value={this.value} />
		</>;
	if (this.type)
		xml.input.@type = this.type;
	return xml;
}

function Password(id, label, value) {
	Text.call(this,id,label,value);
	this.type = 'password';
}
Password.prototype = new Text;

function Submit(id,label) {
	InputField.call(this,id,label,label);
	this.type = 'submit';
}
Submit.prototype = new InputField;
Submit.prototype.getXML = function() {
	return <input name={this.id} id={this.id} type={this.type} value={this.label} />;
}
