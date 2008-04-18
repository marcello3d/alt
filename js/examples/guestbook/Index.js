displaySource("Index.js",'GuestBook.onion.xml');

Alt.require("alt.resource.XML");

Alt.require("examples.guestbook.Dates")

var onion = new Onion(Resources.load('GuestBook.onion.xml'));

if (!examples.guestbook.posts || request.getParameter('reset'))
	examples.guestbook.posts = [];

if (request.method=="POST") {
	examples.guestbook.posts.push({
		name: request.getParameter('name'),
		body: request.getParameter('body'),
		international: request.getParameter('international'),
		time: new Date()
	});
}


function whereFunc(item,args) {
	if (args.length<2)
		return !!item;
	switch (args[1]) {
		case '!':
			return !item;
		case '<':
			return item < args[2];
		case '<=':
			return item <= args[2];
		case '>':
			return item > args[2];
		case '>=':
			return item >= args[2];
		case '==':
			return item == args[2];
		case '!=':
			return item != args[2];
	}
	throw new alt.Exception('unknown where func '+args[1]);
};

function Store(array){
	this.store = array;
}
Store.prototype.query = function(o) {
	var array = this.store;
	if (o.order || o.where) {
		array = new Array();
		
		for (var i = 0; i < this.store.length; i++) {
			var accept = true;
			if (o.where)
				for (var k=0; k<o.where.length; k++)
					if (!whereFunc(this.store[i][o.where[k][0]], o.where[k])) {
						accept = false;
						break;
					}
			if (accept)
				array.push(this.store[i]);
		}
		
	} 
	if (o.order) {
		array.sort(function(a,b) {
			for (var i = 0; i < o.order.length; i++) {
				var order = o.order[i];
				if (a[order[0]] > b[order[0]]) 
					return order[1];
				else 
					if (a[order[0]] < b[order[0]]) 
						return -order[1];
			}
			return 0;
		});
	} 
	if (o.limit || o.offset) {
		Alt.log("splice "+(o.offset || 0)+", "+((o.offset || 0) + o.limit));
		array = array.slice(o.offset || 0, (o.offset || 0) + o.limit);
	}
	return array;
};
Store.prototype.count = function(o) {
	var array = this;
	if (o.where) {
		var count = 0;
		for (var i = 0; i < this.store.length; i++) {
			var accept = true;
			for (var k=0; k<o.where.length; k++)
				if (!whereFunc(this.store[i][o.where[k][0]], o.where[k])) {
					accept = false;
					break;
				}
			if (accept)
				count++;
		}
		return count;
	}
	return array.length;
}


var where = false;
switch (request.getParameter('show')) {
	case 'all':
		where = false;
		break;
	case 'domestic':
		where = [['international','!']];
		break;
	case 'international':
		where = [['international']];
		break;		
}

var arr = [2,3,4];
for each (var i in arr) {
	Alt.log("arr.i="+i);
}

var count = new Store(examples.guestbook.posts).count({
	where: where
});
var perpage = 5;
var pages = Math.ceil(count / perpage);

var page = request.getParameter('page')-1;
if (page<0) page=0;
if (page>=pages) page = pages-1; 

var display = new Store(examples.guestbook.posts).query({
	where: where,
	offset: page*perpage,
	limit: perpage,
	order: [['time',-1]]
});

var site = onion.evaluate(
	<guestbook>
	 <page>{page+1}</page>
	 <pages>{pages}</pages>
	</guestbook>, 
	// Data
	{ posts: display }
);

/*
response.contentType = 'application/xhtml+xml';
response.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">');
*/
response.write(site.toString().replace(/<textarea([^>]+)\/>/m,'<textarea$1></textarea>'));
