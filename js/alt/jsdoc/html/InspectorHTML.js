
Alt.require('alt.jsdoc.Inspector', true);

/**
 * Creates XHTML of entire inspection
 * @type XML
 */
Inspector.prototype.toHTML = function() {
	var map = this.getFlatMap();
	
	var nodelinks = <table width="100%" border="1" 
							cellspacing="0" cellpadding="2" />;
	var nodes = [];
	for (var x in map)
		nodes.push(x);
		
	for each (var x in nodes.sort()) {
		var desc = '';
		if (map[x].doc && map[x].doc.classDesc)
			desc = map[x].doc.classDesc;
			
		nodelinks.appendChild(
		<tr>
		 <td><a href={"#"+x}>{x}</a></td>
		 <td width="100%">{desc}</td>
		</tr>);
	}
	
	var table = Inspector.makeTable(map);
	return <>
	 <p>{nodelinks}</p>
	 <p>{table}</p>
	</>;
}

/**
 * Constructs an XHTML table from a given list
 * @type XML
 */
Inspector.makeTable = function(items,header) {
	var table = <table width="100%" border="1" 
					cellspacing="0" cellpadding="2" />;
	if (header)
		table.appendChild(header);
	
	var names = [];
	for (var x in items)
		names.push(x);
	if (names.length==0) 
		return false;
	names.sort();
	
	for each (var name in names)
		table.appendChild(items[name].toRow(name));
		
	return table;
}

/**
 * Creates XHTML of this InspectorObject and its children
 * @type XML
 */
InspectorObject.prototype.toHTML = function(name,type) {
	
	if (!type)
		type = 'Static';
	var xml = <p/>;
	
	var children = {
		classes:{},
		functions:{},
		objects:{},
		properties:{}
	}
	for (var name in this.children) {
		var child = this.children[name];
		if (child instanceof InspectorClass)
			children.classes[name] = child;
		else if (child instanceof InspectorFunction)
			children.functions[name] = child;
		else if (child instanceof InspectorObject) {
			if (name!="prototype")
				children.objects[name] = child;
		} else 
			children.properties[name] = child ;
	}
	for each (var name in ['Classes','Functions','Objects','Properties']) {
		var table = Inspector.makeTable(
			children[name.toLowerCase()],
			<tr><th colspan="2">{type} {name}</th></tr>
		);
		if (table) xml.appendChild(<p>{table}</p>);	
	}
	return xml;
}

/**
 * Keeps track of the next span id
 */
InspectorFunction.nextSpanId = 1;

/**
 * 
 */
function toggleCode(name) {
	return 'var s=document.getElementById("' + name + '").style;' +
				's.display=s.display=="none"?"":"none";return false;';
}


/**
 * Creates XHTML of this InspectorFunction
 * @type XML
 */
InspectorFunction.prototype.toHTML = function(name) {
	var id = InspectorFunction.nextSpanId++;
	
	var shortdesc = '';
	var longdesc = '';
	var args = '';
	
	var params = '';
	var returns = '';
	var exceptions = '';
	var file = '';
	var lines = '';
    var markedPrivate = false;
	if (this.doc) {
	    markedPrivate = this.doc.markedPrivate;
		if (this.doc.args) {
			params = <dl><dt><b>Parameters:</b></dt></dl>;
			for each (var arg in this.doc.args) {
				if (args) 
					args += ', ';
				var desc = '';
				if (this.doc.params) {
					var type = this.doc.params[arg].type;
					if (type)
						args += this.getTypeLink(type)+' ';
					desc = this.doc.params[arg].desc;
				}
				args += arg;
	
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
			                 <dd><code>{this.getTypeLink(this.doc.returnType)}</code> 
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
    	if (this.doc.source) {
    	    file = <>
    	       <dt><b>File:</b></dt>
    	       <dd><code>{this.doc.source}</code></dd>
    	    </>;
    	}
    	if (this.doc.lines) {
    	    lines = <>
    	       <dt><b>Lines:</b></dt>
    	       <dd><code>{this.doc.lines}</code></dd>
    	    </>;
    	    
    	}
    }
	var func = <code><b><a href="#" onclick={toggleCode('span'+id)}>{name}</a></b>({args})</code>;
	if (markedPrivate)
	   func = <i>(Private) {func}</i>;
	var compressedSource = this.func.toSource(0,Decompiler.COMPRESS_FLAG|
	                 Decompiler.COMPRESS_NEWLINES_FLAG);

    //var packedSource = null;
    //try {
    //Alt.require('lgpl.packer.Pack');
    //var packedSource = lgpl.packer.pack(compressedSource, "UTF-8", false, false); 	                 
    //} catch (ex) {}
    compressedSource = compressedSource.replace(/(.{79})/g,'$1\\\n');
    
	return <dl style="margin:0">
	         <dt>
	           {func}
	          </dt>
	         <dd>{shortdesc}
	          <span id={'span'+id} style="display:none">
	          {longdesc}
	          <dl>
	           {params}
	           {returns}
	           {exceptions}
	           {file}
	           {lines}
	           <dt><b>Source:</b></dt>
	           <dd><pre>{this.func}</pre></dd>
	           <dt><b>Compressed Source:</b></dt>
	           <dd><pre>{compressedSource}</pre></dd>
	           </dl>
	         </span>
	         </dd>
	       </dl>;
}
/**
 * @type XML
 */
InspectorFunction.prototype.toRow = function(name) {
	return <tr>
	        <td valign="top" align="right">
	         <code><a name={this.getFullName()}>{
         		  this.getTypeLink(this.doc.returnType || 'Object')}</a></code>
	        </td>
	        <td width="100%">{this.toHTML(name)}</td>
	       </tr>;
}

InspectorNode.prototype.getTypeLink = function(type) {
	var node = this.getType(type);
	if (node)
		return <a href={'#'+node.getFullName()}>{type}</a>;
	return type;
}


/**
 * Creates XHTML of this InspectorClass
 * @type XML
 */
InspectorClass.prototype.toHTML = function(name) {
	var f = this.func.toString instanceof Function ? this.func.toString() : '';
	var id = InspectorFunction.nextSpanId++;
	
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
		
	var superClass = this.getSuperClass();
	
	var extendsClass = <></>;
	var superLink = <></>
	if (superClass) {
		var fullname = superClass.getFullName();
		extendsClass = <><br/>extends 
						<b><a href={'#'+fullname}>{fullname}</a></b></>;
	}
	
	var id = InspectorFunction.nextSpanId++;
	
	var name = this.name;
	
	var div = <div id={'span'+id}>
	<code>{extendsClass}</code>
	<p>{classDesc}</p>
	<dl>
	{since}
	{deprecated}
	{author}
	</dl>
	</div>;
	
	if (this.func instanceof Function) {
		var thisObj = this;
		var table = Inspector.makeTable({
			constructor: {
				toRow: function() {
					return <tr><td>{InspectorFunction.prototype.toHTML.call(thisObj,name)}</td></tr>
				}
			}
		},
		<tr><th>Constructor</th></tr>);
		div.appendChild(<p>{table}</p>);
	}
	if (this.children)
	   div.appendChild(InspectorObject.prototype.toHTML.call(this,name));
	if (this.proto) {
		div.appendChild(this.proto.toHTML(name,'Member'));
		if (superClass) {
			var overridden = {};
			var node = this;
			while (node.proto.children) {
				for (var x in node.proto.children)
					overridden[x] = true;
				node = node.getSuperClass();
				if (!node)
					break;
				var fullname = node.getFullName();
				var table = <table width="100%" border="1" 
								cellspacing="0" cellpadding="2">
					<tr><th>Functions inherited from 
							<a href={'#'+fullname}>{fullname}</a></th></tr>
					<tr><td><code/></td></tr>
				</table>;
				var first = true;
				for (var x in node.proto.children) 
					if (!overridden[x]) {
						if (first)
							first = false;
						else
							table.tr.td.code.appendChild(', ');
						table.tr.td.code.appendChild(<b><a href={'#'+
													fullname+'.'+x}>{x}</a></b>);
					}
			    if (!first)
				    div.appendChild(<p>{table}</p>);
			}
			
		}
	}
	
	return <>
	<code>class 
	   <b><a href="#" onclick={toggleCode('span'+id)}>{name}</a></b></code>
	   {div}
	</>;;
}
/**
 * Creates XHTML of this InspectorNode
 * @type XML
 */
InspectorNode.prototype.toHTML = function() {
	try {
		return <>Current Value: <code>{this.object}</code></>;
	} catch (ex) {
		return <>Unprintable.</>;
	}
}

/**
 * Creates XHTML of this InspectorReference
 * @type XML
 */
InspectorReference.prototype.toHTML = function() {
	return <>Reference: 
	<code>{this.getTypeLink(this.getReference().getFullName())}</code></>;
}
/**
 * @type XML
 */
InspectorNode.prototype.toRow = function(name) {
	return <tr><td valign="top"><code><a name={name}>{name}</a></code></td><td>{this.toHTML(name)}</td></tr>;
}
InspectorClass.prototype.toRow = InspectorNode.prototype.toRow;
