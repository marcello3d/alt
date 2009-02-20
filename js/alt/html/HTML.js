function HTMLPrototype() {}

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
}
Array.prototype.toHTMLString = function() {
	var s = '';
	this.forEach(function(child) {
		s += child.toHTMLString ? child.toHTMLString() : escapeHTML(child);
	});
	return s;
}
Object.extend(HTMLPrototype.prototype, {
	toHTMLString: function() {
		var s = "<"+this.tag;
		Object.forEach(this.attributes,function(key,value) {
			s += " "+key+"=\""+escapeHTML(value)+"\"";
		});
		if (!this.children.length && !this.separateClose) {
			s += "/";
		} else {
			s += ">";
			s += children.toHTMLString();
			s += "</"+this.tag+">";
		}
		s += ">";
		return s;
	}
});
function makeTagFunction(name) {
	var constructor = function() {
		this.tag = name;
		this.attributes = {};
		this.children = [];
		for (var i=0; i<arguments.length; i++) {
			var arg = arguments[i];
			if (!(arg instanceof HTMLPrototype) && !(arg instanceof String)) {
				for (var x in arg) {
					this.attributes[x] = arg[x];
				}
			} else {
				this.children.push(arg);
			}
		}
	};
	constructor.prototype = new HTMLPrototype;
	return constructor;
}
var html = {};

[
 'html','body',
 'head','title','meta-equiv',
 'script','style','link',
 'object','embed',
 'h1','h2','h3','h4','h5','h6',
 'p','div','br',
 'strong','em','b','u','i','strike'
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
var output = [
	new html.p(	"Here is some text, ", new html.strong("and some bold text"),". "),
	new html.p(	"Every good boy deserves a ", new html.a({href:'http://2draw.net/',title:'what?'},"link"), ".")
];