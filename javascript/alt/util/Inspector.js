

function Inspector(object) {
	this.seen = new Array();
	return new InspectorObject(this, object);
}
function InspectorObject(inspector,object) {
	for (var i=0; i<inspector.seen.length; i++)
		if (inspector.seen[i]==object)
			return 'seen';
	inspector.seen.push(object);
	
	this.items = {};
	this.literal = object.toString();
	for (var x in object) {
		var child = object[x];
		Rhino.log("looking at object["+x+"]");
		if (child instanceof Function) {
			this.items[x] = new InspectorFunction(child);
		} else if (child instanceof Object) {
			this.items[x] = new InspectorObject(inspector,child);
		} else {
			this.items[x] = new InspectorProperty(child);
		}
	}
}

InspectorObject.prototype.toHTML = function(head) {
	var s = "<table border=1>";
	for (var x in this.items) {
		s += "<tr><td>"+x+"</td><td>"+this.items[x].toHTML()+"</td></tr>";
	}
	s+="</table>";
	return s;
}

function InspectorFunction(func) {
	this.func = func;
}

InspectorFunction.prototype.toHTML = function() {
	var s = '<pre>'+this.func.toString()+'</pre>';
	return s;
}
function InspectorProperty(object) {
	this.value = object.toString();
}
InspectorProperty.prototype.toHTML = function() {
	return this.value;
}