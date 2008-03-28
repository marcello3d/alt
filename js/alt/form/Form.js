

/**
 * Holds the datasource for a form
 * @param authenticate specify whether to add authentication to this form (default true) 
 */  
function Form(id) {
	this.id = id;
	this.fields = [];
	this.authcode = parseInt(Math.random() * 1e9);
	this.addField(new Hidden('form-id', 'Authentication', this.authcode));
	Form.forms[this.id] = this;
}

Form.prototype.addField = function(field) {
	this.fields.push(field);
}

Form.prototype.getXML = function() {
	var xml = <form method="post" />;
	for each (var field in this.fields)
		if (field.getXML)
			xml.appendChild(field.getXML());
			
	return xml;
}

Form.forms = {};

Form.getForm = function(request) {
	if (request.method != "POST") 
		return null;
	var formId = request.getParameter('form-id');
	if (Form.forms[formId])
		return Form.forms[formId];
	return false; 
}
Form.prototype.validate = function(dataSource) {
	this.validated = true;
	
	// Validate each field
	for each (var field in this.form.fields)
		if (field.validate) {
			field.setValue(dataSource[field.id]);
			field.validated = field.validate();
			if (!field.validated)
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
	this.value = value;
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
	return <>
		<label for={this.id}>{this.label}</label>
		<input name={this.id} id={this.id} type={this.type} value={this.value} />
		</>;
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
Password.protototype = new Text;

function Submit(id,label) {
	InputField.call(this,id,label,label);
	this.type = 'submit';
}
Submit.prototype = new InputField;
Submit.prototype.getXML = function() {
	return <input name={this.id} id={this.id} type={this.type} value={this.label} />;
}
