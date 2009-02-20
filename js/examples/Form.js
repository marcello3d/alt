displaySource("Form.js",'Example.onion.xml','/alt/form/Form.js');

Alt.require("alt.resource.XML");
Alt.require("alt.form.Form");

var session = dictator.session;

var onion = new Onion(Resources.load('Example.onion.xml'));


var form = alt.form.Form.getForm('examples.Form');


	function dump(o) {
		var s = '';
		for (var x in o)
			s += 'o['+x+'] = '+o[x]+'\n';
		return s;
	}
	
	
var results = 'Please submit the form below.';

if (form.submitted) {
	if (form.validate())
		results = 'SUCCESS!';
	else
		results = 'FAILED TO DO SOMETHING!';
} else {
	var f;
	form.addField(f = new alt.form.Text('name', 'Name', 'Name'));
	form.addField(f = new alt.form.Text('age', 'Age'));
	f.clientValidate = f.validate = function() {
		if (!this.value.match(/[0-9]+/)) {
			throw "Not an age.";
		}
		return true;
	}
	form.addField(f = new alt.form.Submit('submit', 'Submit', 'Submit'));
}



var site = onion.evaluate(
<example-page>
 <title>Form test</title>
 <body>
    <div style="border: solid 2px; padding: 5px; margin-bottom: 1em">{results}</div>
 	{form.getXML()}
 </body>
</example-page>);



response.write(site);
