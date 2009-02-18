

//var db = {
//	users: [],
//	posts: []
//};
//var fred = {
//	name: 'fred',
//	admin: true
//};
//db.users.push(fred);
//
//var cindy = {
//	name: 'cindy',
//	admin: true
//};
//db.users.push(cindy);
//
//var doug = {
//	name: 'doug',
//	admin: false
//};
//db.users.push(doug);
//
//db.posts.push({
//	user: fred,
//	text: 'this is a post'
//},{
//	user: fred,
//	text: 'this is a post 2'
//},{
//	user: doug,
//	text: 'this is a post 3'
//},{
//	user: cindy,
//	text: 'this is a post 4'
//},{
//	user: doug,
//	text: 'this is a post 5'
//});
//
//function nameSort(a,b) {
//	if (a.user.name < b.user.name) {
//		return -1;
//	} else if (a.user.name > b.user.name) {
//		return 1;
//	}
//	return 0;
//}
//
//var output = {};
//
//output.posts0 = db.posts.query().get();
//output.posts1 = db.posts.query({user: fred}).get();
//output.posts2 = db.posts.query().sort(nameSort).get();
//output.posts3 = db.posts.query().slice(0,3).get();
//output.posts4 = db.posts.query().sort(nameSort).slice(0,3).get();
//output.posts5 = db.posts.query().slice(0,3).sort(nameSort).get();
//
//output.adminposts = db.posts.query({
//	user: db.users.query({ admin: true })
//}).sort(nameSort).get();
//
//document.body.innerHTML = "<pre>"+output.toSource()+"</pre>";

var output = [
  	html.p(	"Here is some <text>, ", html.strong("and some bold text"),". "),
  	html.p(	"Every good boy deserves a ", html.a({href:"http://2draw.net/",title:"what?"},"link"), "."),
  	html.pre( "  pre  text ")
];

document.body.innerHTML += output.toHTMLString();

function log(message) {
	document.body.innerHTML += html.p(message).toHTMLString();
}

var A = Object.extend(function(name) {
	log("A constructor("+name+")");
	this.name = name;
},{
	foo: function() {
		log("A("+this.name+").foo()");
	},
	bar: function() {
		log("A("+this.name+").bar()");
	}
});


var B = A.extend(function $(name,arg2) {
	$.parent.call(this,name);
	log("B constructor("+name+","+arg2+")");
},{
	foo: function $() {
		$.parent.call(this);
		log("B("+this.name+").foo()");
	}
});

var C = B.extend(function $(name) {
	$.parent.call(this,name);
	log("C constructor("+name+")");
},{
	foo: function $() {
		$.parent.call(this);
		log("C("+this.name+").foo()");
	}
});
var hr = new html.hr;
log(hr)
var a = new A("alfred");
log(hr)
a.foo();
log(hr)
a.bar();
log(hr)

var b = new B("betsy",2);
log(hr)
b.foo();
log(hr)
b.bar();
log(hr)

var c = new C("caleb",2);
log(hr)	
c.foo();
log(hr)
c.bar();
