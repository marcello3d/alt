
var JSInspector = Packages.cello.alt.util.Inspector;


function isObject(o) {
	if (o!=null && o instanceof Object)
		for (var x in o)
			return true;
	return false;
}
function isClass(name,o) {
	if (!o) 
		return false;
	if (o instanceof Function)
		for (var x in o.prototype)
			return true;
	if (o instanceof Object && name.match(/^[A-Z]/))
		return true;
	return false;
}

function Inspector(object) {
	this.seen = new Array();
	this.objects = {};
	this.main = new InspectorObject(null, this, object);
}
Inspector.prototype.toHTML = function() {
	return <>
	 <p>Global:</p>
	 {this.main.toHTML()}
	 <p>Modules:</p>
	 {Inspector.makeTable(this.objects)}
	</>;
}

Inspector.makeTable = function(items) {
	var foundSome = false;
	var s = <table border="1"></table>;
	var sorted = [];
	for (var x in items)
		sorted.push(x);
	if (sorted.length==0) 
		return false;
	sorted.sort();
	for each (var x in sorted)
		s.appendChild(<tr><td valign="top">{x}</td><td>{items[x].toHTML()}</td></tr>);
	return s;
}
function InspectorObject(name,inspector,object) {
	for (var i=0; i<inspector.seen.length; i++)
		if (inspector.seen[i]==object)
			return 'seen';
	inspector.seen.push(object);
	
	this.classes = {};
	this.functions = {};
	this.properties = {};
	this.literal = object;
	var names = [];
	// get JSInspector's properties
	var props = JSInspector.getProperties(object);
	if (props.length>0) {
		for each (var x in props)
			names[x] = true;
	}
	var oname = name==null ? x : name+'.'+x;
	for (var x in names) {
		var child = object[x];
		if (isClass(x, child)) {
			this.classes[x] = new InspectorClass(oname,inspector,child);
		} else if (child instanceof Function) {
			this.functions[x] = new InspectorFunction(x,child);
		} else if (isObject(child)) {
			inspector.objects[oname] = new InspectorObject(oname,inspector,child);
		} else {
			this.properties[x] = new InspectorProperty(oname,child);
		}
	}
}

InspectorObject.prototype.toHTML = function(head) {
	
	var xml = <>{this.literal}</>;
	
	var classes = Inspector.makeTable(this.classes);
	if (classes) xml.appendChild(<p>Classes:{classes}</p>);
	
	var objects = Inspector.makeTable(this.objects);
	if (objects) xml.appendChild(<p>Objects:{objects}</p>);
	
	var properties = Inspector.makeTable(this.properties);
	if (properties) xml.appendChild(<p>Properties:{properties}</p>);
	
	var functions = Inspector.makeTable(this.functions);
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
	var id = nextSpanId++;
	var code = 'var s=document.getElementById("pre' + id + '").style;' +
				's.display=s.display=="none"?"":"none";return false;';
	return <>
		Constructor: <code><b><a href="#" onclick={code}>{this.name}</a></b>{args[1]} 
		{'{...}'}</code>
	    <pre id={'pre'+id} style="display:none">{f}</pre>
		{this.proto.toHTML()}
	</>;
}
function InspectorProperty(name,object) {
	this.name = name;
	this.value = object;
}
InspectorProperty.prototype.toHTML = function() {
	return this.value;
}

