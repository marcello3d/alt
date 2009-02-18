function escapeHTML(s) {
    if (!s) return s;
    if (typeof s != "string")
        s = s.toString();
    return s.replace(/[&<>"]/g, function(x) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;'
        }[x];
    });
}
String.prototype.toHTMLString = function() {
	return escapeHTML(this);
};
Array.prototype.toHTMLString = function() {
	var s = '';
	this.forEach(function(child) {
		if (child) {
			s += child.toHTMLString ? child.toHTMLString() : escapeHTML(child);
		}
	});
	return s;
};

var HTMLPrototype = Object.extend(function() {},{
	toHTMLString: function() {
		var s = "<"+this.tag;
		this.attributes.forEach(function(key,value) {
			s += " "+key+"=\""+escapeHTML(value)+"\"";
		});
		if (!this.children.length && !this.separateClose) {
			s += "/";
		} else {
			s += ">";
			s += this.children.toHTMLString();
			s += "</"+this.tag;
		}
		s += ">";
		return s;
	}
});
function makeTagFunction(name) {
	function initialize() {
		this.tag = name;
		this.attributes = {};
		this.children = [];
		for (var i=0; i<arguments.length; i++) {
			var arg = arguments[i];
			if (!(arg instanceof HTMLPrototype) && typeof arg == "object") {
				this.attributes.extend(arg);
			} else {
				this.children.push(arg);
			}
		}
	}
	var constructor = HTMLPrototype.extend(function(){});
	
	return function() {
		var o = new constructor;
		initialize.apply(o,Array.from(arguments));
		return o;
	};
}
var html = {};

[
 'html','body',
 'head','title','meta-equiv',
 'script','style','link',
 'object','embed',
 'h1','h2','h3','h4','h5','h6',
 'p','div','br',
 'strong','em','b','u','i','strike','pre',
 'hr',
 'sub','sup',
 'span',
 'a',
 'img',
 'li','ul','ol',
 'table','tbody','tr','td','th',
 'form','input','button','select','option','textarea'
 ].forEach(function(name) {
	 html[name] = makeTagFunction(name);
 });
html.textarea.separateClose = true;