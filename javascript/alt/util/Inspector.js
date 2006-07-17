
Rhino.require('alt.resource.Loader');
Rhino.require('alt.resource.String');

var JSInspector = Packages.cello.alt.util.Inspector;



function isObject(o) {
	if (o!=null && o instanceof Object)
		for (var x in o)
			return true;
	return false;
}
function isClass(name,o) {
	if (o == null) 
		return false;
	if (o instanceof Function)
		for (var x in o.prototype)
			return true;
	if (o instanceof Object)
		for each(var x in o)
			if (x instanceof Function)
				return true;
	if (o instanceof Function && name.match(/^[A-Z]/))
		return true;
	return false;
}

function Inspector(object) {
	this.seen = new Array();
	this.objects = {};
	this.classes = {};
	this.main = new InspectorObject(null, this, object, null);
}
Inspector.prototype.toHTML = function() {
	var classlinks = <table width="100%" border="1" cellspacing="0" cellpadding="2"></table>;
	var classes = [];
	for (var x in this.classes)
		classes.push(x);
	for each (var x in classes.sort()) {
		var desc = '';
		if (this.classes[x].doc.classDesc)
			desc = this.classes[x].doc.classDesc;
		classlinks.appendChild(<tr>
		<td><a href={"#"+x}>{x}</a></td>
		<td width="100%">{desc}</td>
		</tr>);
	}
	return <>
	 <p>Classes:</p>
	 {classlinks}
	 {Inspector.makeTable(this.classes)}
	 <p>Global:</p>
	 {this.main.toHTML()}
	 <p>Modules:</p>
	 {Inspector.makeTable(this.objects)}
	</>;
}

Inspector.makeTable = function(items,header) {
	var foundSome = false;
	if (header==null)
		header = new XML();
	var s = <table width="100%" border="1" cellspacing="0" cellpadding="2">{header}</table>;
	var sorted = [];
	for (var x in items)
		sorted.push(x);
	if (sorted.length==0) 
		return false;
	sorted.sort();
	for each (var x in sorted)
		s.appendChild(items[x].toRow());
	return s;
}
function InspectorObject(name, inspector, object) {
	//for (var i=0; i<inspector.seen.length; i++)
	//	if (inspector.seen[i]==object)
	//		return 'seen';
	inspector.seen.push(object);
	
	this.name = name;
	this.classes = {};
	this.functions = {};
	this.objects = {};
	this.properties = {};
	this.literal = object;
	var names = [];
	// get JSInspector's properties
	var props = JSInspector.getProperties(object);
	if (props.length>0)
		for each (var x in props)
			names[x] = true;
	
	for (var x in names) {
		var oname = name==null ? x : name+'.'+x;
		var child = object[x];
		if (isClass(x, child)) {
			inspector.classes[oname] = new InspectorClass(x, oname, inspector, child);
		} else if (child instanceof Function) {
			this.functions[x] = new InspectorFunction(x, child);
		} else if (isObject(child)) {
			inspector.objects[oname] = new InspectorObject(oname, inspector, child);
		} else {
			this.properties[x] = new InspectorProperty(x,child);
		}
	}
}

InspectorObject.prototype.toHTML = function(head) {
	
	var xml = <>{this.literal}</>;
	
	var classes = Inspector.makeTable(this.classes,
								<tr><th colspan="2">Inner Classes</th></tr>);
	if (classes) xml.appendChild(classes);
	
	var objects = Inspector.makeTable(this.objects,
								<tr><th colspan="2">Objects</th></tr>);
	if (objects) xml.appendChild(objects);
	
	var properties = Inspector.makeTable(this.properties,
								<tr><th colspan="2">Properties</th></tr>);
	if (properties) xml.appendChild(properties);
	
	var functions = Inspector.makeTable(this.functions,
								<tr><th colspan="2">Functions</th></tr>);
	if (functions) 
		xml.appendChild(functions);
	
	return xml;
}
InspectorObject.prototype.toRow = function() {
	return <tr><td>{this.toHTML()}</td></tr>;
}

function JSDoc(name,func) {
	this.returnType = null;
	this.returnDesc = null;
	var args = /function[^(]+\(([^)]*)\)/.exec(func);
	if (args && args[1])
		this.args = args[1].split(/,\s/);
	this.params = [];
	for each (var arg in this.args)
		this.params[arg] = {type:null, desc: null };
		
	var doc = func.__jsdoc__;
	if (doc) {
		this.exceptions = [];
		this.desc = '';
		this.classDesc = '';
		var inDesc = true;
		for each (var line in doc.split(/\n/)) {
			var match = /^@(\S+)\s*(.*)$/.exec(line);
			if (!match) {
				if (inDesc)
					this.desc += line+'\n';
				else
					this.classDesc += line+'\n';
			} else switch (match[1]) {
				case 'deprecated':
					this.deprecated = match[2] ? match[2] : true;
					break;
				case 'class':
					inDesc = false;
					break;
				case 'type':
					this.returnType = match[2];
					break;
				case 'return':
				case 'returns':
					this.returnDesc = match[2];
					break;
				case 'author':
					this.author = match[2];
					break;
				case 'since':
					this.since = match[2];
					break;
				case 'param':
					var match2 = /(?:\{([^}]+)\})?\s*(\S+)\s*(.*)/.exec(match[2]);
					var name = match2[2];
					if (this.params[name]) {
						if (match2[1])
							this.params[name].type = match2[1];
						this.params[name].desc = match2[3];
					}
					break;
				case 'exception':
					var match2 = /(\S+)\s*(.*)/.exec(match[2]);
					this.exceptions.push({type:match2[1], desc:match2[2]});
					break;
			}
		}
		this.splitDesc = /^([\s\S]+?(?:\.\s|\.?$))([\s\S]*)$/.exec(this.desc);
	}
}

function InspectorFunction(name, func, source) {
	this.name = name;
	this.func = func;
	this.doc = new JSDoc(name,func);
}

var nextSpanId = 1;

function toggleCode(name) {
	return 'var s=document.getElementById("' + name + '").style;' +
				's.display=s.display=="none"?"":"none";return false;';
}

InspectorFunction.prototype.toHTML = function() {
	var id = nextSpanId++;
	
	var shortdesc = '';
	var longdesc = '';
	var args = '';
	
	var params = <></>;
	var returns = <></>;
	var exceptions = <></>;
	if (this.doc.args) {
		params = <dl><dt><b>Parameters:</b></dt></dl>;
		for each (var arg in this.doc.args) {
			if (args) 
				args += ', ';
			var type = this.doc.params[arg].type;
			if (type)
				args += '{'+type+'} ';
			args += arg;

			var desc = this.doc.params[arg].desc;
			params.appendChild(
			  <dd><code>{arg}</code>{desc?' - '+desc:''}</dd>
			);
		
		}
	}
		
	if (this.doc.desc) {
		shortdesc = this.doc.splitDesc[1];
		longdesc = new XML('<p>'+this.doc.splitDesc[2]+'</p>');
		if (this.doc.returnDesc) 
			returns = <dl>
		                 <dt><b>Returns:</b></dt>
		                 <dd><code>{this.doc.returnType}</code> 
		                 {this.doc.returnDesc}
		                 </dd>
		               </dl>;
		if (this.doc.exceptions.length>0) {
			exceptions = <dl><dt><b>Exceptions:</b></dt></dl>;
			for each (var exception in this.doc.exceptions) {
				exceptions.appendChild(
				  <dd>{exception.type} - {exception.desc}</dd>
				);
			}
		}
	}
	return <dl style="margin:0">
	         <dt>
	          <code>
	           <b><a href="#" onclick={toggleCode('span'+id)}>{this.name}</a></b>({args})
	           </code>
	          </dt>
	         <dd>{shortdesc}
	          <span id={'span'+id} style="display:none">
	          {longdesc}
	          <dl>
	           {params}
	           {returns}
	           {exceptions}
	           <dt><b>Source:</b></dt>
	           <dd><pre>{this.func}</pre></dd>
	           </dl>
	         </span>
	         </dd>
	       </dl>;
		       /*
	} else {
		//	<pre id={'pre'+id} style="display:none">{f}</pre>;
		return <code>
		        <b>{this.name}</b>({this.doc.args})
		       </code>;
	}*/
}
InspectorFunction.prototype.toRow = function() {
	return <tr>
	        <td valign="top" align="right">
	         <code> {this.doc.returnType ? this.doc.returnType : 'Object'}</code>
	        </td>
	        <td width="100%">{this.toHTML()}</td>
	       </tr>;
}

function InspectorClass(name,oname,inspector,func) {
	this.func = func;
	this.doc = new JSDoc(name,func);
	this.name = name;
	this.oname = oname;
	this.seen = [];
	this.objects = {};
	
	var thisObj = this;
	this.constructor = {};
	this.constructor[name] = {
		toRow: function() { 
			return <tr><td>{InspectorFunction.prototype.toHTML.call(thisObj)}</td></tr>;
		}
	};
	
	if (func.prototype)
		this.proto = new InspectorObject(oname, inspector, func.prototype);

	for (var x in func) {
		this.statics = new InspectorObject(oname, inspector, func);
		break;
	}
}

InspectorClass.prototype.toHTML = function() {
	var f = this.func.toString();
	var args = /function[^(]+\(([^)]*)\)/.exec(f);
	var id = nextSpanId++;
	
	var classDesc = <></>;
	var since = <></>;
	var deprecated = <></>;
	var author = <></>;
	if (this.doc.classDesc)
		classDesc = new XML('<p>'+this.doc.classDesc+'</p>');
	if (this.doc.author)
		author = <dl><dt><b>Author</b></dt><dd>{this.doc.author}</dd></dl>;
	if (this.doc.since)
		since = <dl><dt><b>Since</b></dt><dd>{this.doc.since}</dd></dl>;
	if (this.doc.author)
		deprecated = <dl><dt><b>Deprecated</b></dt><dd>{this.doc.deprecated}</dd></dl>;
	var s = <p>
	<p><code>{this.func instanceof Function ? 'class' : 'module'} <b>{this.oname}</b></code></p>
	<p>{classDesc}</p>
	<dl>
	{since}
	{deprecated}
	{author}
	</dl>
	</p>;
	if (this.func instanceof Function) {
		s.appendChild(Inspector.makeTable(this.constructor,
			<tr><th>Constructor</th></tr>));
	}
	if (this.proto) {
		
		var classes = Inspector.makeTable(this.proto.classes,
				<tr><th colspan="2">Inner Classes</th></tr>);
		if (classes) s.appendChild(classes);
		
		var properties = Inspector.makeTable(this.proto.properties,
				<tr><th colspan="2">Member Properties</th></tr>);
		if (properties) s.appendChild(properties);
		
		var functions = Inspector.makeTable(this.proto.functions,
				<tr><th colspan="2">Member Functions</th></tr>);
		if (functions) s.appendChild(functions);
	}
	if (this.statics) {
		
		var classes = Inspector.makeTable(this.statics.classes,
				<tr><th colspan="2">Inner Classes</th></tr>);
		if (classes) s.appendChild(classes);
		
		var properties = Inspector.makeTable(this.statics.properties,
				<tr><th colspan="2">Static Properties</th></tr>);
		if (properties) s.appendChild(properties);
		
		var functions = Inspector.makeTable(this.statics.functions,
				<tr><th colspan="2">Static Functions</th></tr>);
		if (functions) s.appendChild(functions);
	}
	
	return s;
}
InspectorClass.prototype.toRow = function() {
	return <tr>
	        <td valign="top" align="right"><a name={this.oname}/>{this.oname}</td>
	        <td>{this.toHTML()}</td>
	       </tr>;
}

function InspectorProperty(name,object) {
	this.name = name;
	this.value = object;
}
InspectorProperty.prototype.toHTML = function() {
	return <code>{this.value}</code>;
}
InspectorProperty.prototype.toRow = function() {
	return <tr><td><code>{this.name}</code></td><td>Current value: <code>{this.value}</code></td></tr>;
}
