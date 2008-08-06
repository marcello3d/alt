displaySource("Index.js",'GuestBook.onion.xml');

Alt.require("alt.resource.XML");

var onion = new Onion(Resources.load('GuestBook.onion.xml'));

// Make the datastore if we don't have it --- just a javascript array!
if (!examples.guestbook.posts || request.getParameter('reset'))
	examples.guestbook.posts = [];

// if there is a post, add it to the array
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
// dumb slow query function!
Store.prototype.query = function(o) {
	var array = this.store;
	// don't touch original array if we're ordering or whereing
	if (o.where) {
		array = new Array();
		
		for (var i = 0; i < this.store.length; i++) {
			var accept = true;
			// check all where conditions (no OR support yet!)
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
	// sort by list of sort items
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
	// grab subset of results
	if (o.limit || o.offset)
		array = array.slice(o.offset || 0, (o.offset || 0) + o.limit);
	return array;
};
Store.prototype.count = function(o) {
	// we only care about where here (do we care about limit?)
	var array = this.store;
	
	// count all items that match if there is a where clause
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
// based on http get parameter show...
switch (request.getParameter('show')) {
	case 'all':
		// no where clause
		where = false; 
		break;
	case 'domestic':
		// where international is false
		where = [['international','!']];
		break;
	case 'international':
		// where international is true
		where = [['international']];
		break;		
}

// Create a store and count everything that applies
var store = new Store(examples.guestbook.posts);
var count = store.count({ where: where });

// calculate number of pages based on that count
var perpage = 5;
var pages = Math.ceil(count / perpage);

// current page
var page = Math.max(0,Math.min(pages-1,request.getParameter('page')-1)); 

// find the entries
var postsToShow = store.query({
	where: where,
	offset: page*perpage,
	limit: perpage,
	order: [['time',-1]]
});


// generate site
var site = onion.evaluate(
	<guestbook>
	 <page>{page+1}</page>
	 <pages>{pages}</pages>
	</guestbook>, 
	// Data
	{ posts: postsToShow }
);

/*
response.contentType = 'application/xhtml+xml';
response.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">');
*/

// for some reason firefox can't handle <textarea /> in html mode, 
// and running in proper xhtml mode is currently a bitch
response.write(site.toString().replace(/<textarea([^>]+)\/>/m,'<textarea$1></textarea>'));
