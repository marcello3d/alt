
var JSInspector = Packages.cello.alt.util.Inspector;


function isObject(o) {
	if (o!=null && o instanceof Object)
		for (var x in o)
			return true;
	return false;
}
function isClass(func) {
	for (var x in func.prototype)
		return true;
//	if (func.toString().match(/this/))
//		return true;
	return false;
}

function Inspector(object) {
	this.seen = new Array();
	return new InspectorObject('[root]', this, object);
}
function InspectorObject(name,inspector,object) {
	for (var i=0; i<inspector.seen.length; i++)
		if (inspector.seen[i]==object)
			return 'seen';
	inspector.seen.push(object);
	
	this.classes = {};
	this.functions = {};
	this.properties = {};
	this.literal = object.toString();
//	Rhino.log("count : "+);
	var names = [];
	// get JSInspector's properties
	var props = JSInspector.getProperties(object);
	if (props.length>0) {
		for each (var name in props)
			names[name] = true;
	} else {
		// get other properties
		//for (var name in object)
		//names[name] = true; 
	}
	for (var x in names) {
		var child = object[x];
//		Rhino.log("looking at object["+x+"]");
		if (child instanceof Function) {
			if (isClass(child))
				this.classes[x] = new InspectorClass(x,inspector,child);
			else
				this.functions[x] = new InspectorFunction(x,child);
		} else if (isObject(child)) {
			this.properties[x] = new InspectorObject(x,inspector,child);
		} else {
			this.properties[x] = new InspectorProperty(x,child);
		}
	}
}

InspectorObject.prototype.toHTML = function(head) {
	
	var f = function(items) {
		var foundSome = false;
		var s = <table border="1"></table>;
		for (var x in items) {
			foundSome = true;
			s.appendChild(<tr><td valign="top">{x}</td><td>{items[x].toHTML()}</td></tr>);
		}
		if (foundSome)
			return s;
		return foundSome ? s : false;
	}
	var xml = <>{this.literal}</>;
	
	
	var classes = f(this.classes);
	if (classes) xml.appendChild(<p>Classes:{classes}</p>);
	
	var properties = f(this.properties);
	if (properties) xml.appendChild(<p>Properties:{properties}</p>);
	
	var functions = f(this.functions);
	if (functions) xml.appendChild(<p>Functions:{functions}</p>);
	
	return xml;
}

function InspectorFunction(name,func) {
	this.name = name;
	this.func = func;
}

var nextSpanId = 1;

InspectorFunction.prototype.toHTML = function() {
	var f = this.func.toString();
	var args = /function[^(]+(\([^)]*\))([.\n]*)/m.exec(f);
	var id = nextSpanId++;
	var code = 'var s=document.getElementById("pre' + id + '").style;' +
				's.display=s.display=="none"?"":"none";return false;';
	var s = <>
	<code>{'function '} <b><a href="#" onclick={code}>{this.name}</a></b>{args[1]}
	{'{...}'}</code>
	<pre id={'pre'+id} style="display:none">{f}</pre>
	</>;
	if (this.proto)
		return <>{s}{this.proto.toHTML()}</>;
	return s;
}

function InspectorClass(name,inspector,func) {
	this.func = func;
	this.name = name;
	this.proto = new InspectorObject(name,inspector,func.prototype);
}

InspectorClass.prototype.toHTML = function() {
	var f = this.func.toString();
	var args = /function[^(]+(\([^)]*\))/.exec(f);
	return <>
		<code>public {this.name}{args[1]} {'{...}'}</code>
		{this.proto.toHTML()}
	</>;
}
function InspectorProperty(object) {
	this.value = object;
}
InspectorProperty.prototype.toHTML = function() {
	return this.value.toString();
}

