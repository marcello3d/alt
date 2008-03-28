displaySource("Form.js",'Example.onion.xml','/alt/form/Form.js');

Alt.require("alt.resource.XML");
Alt.require("alt.form.Form");

var Session = 


var form = new alt.form.Form('examples.Form');
form.addField(new alt.form.Text('name','Name','Name'));
form.addField(new alt.form.Submit('submit','Submit','Submit'));


var onion = new Onion(Resources.load('Example.onion.xml'));

var site = onion.evaluate(
<mylayout>
 <title>Form test</title>
 <body>
 	{form.getXML()}
</body>
</mylayout>);



response.write(site);
