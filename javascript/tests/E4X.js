
var x = 5;

// Simple XML
XML.prettyPrinting = false;
XML.prettyIndent = false;
tc.assertEquals('<foo>bar</foo>','bar');
tc.assertEquals('<foo>{x}</foo>',5);
tc.assertEquals('<foo><bar>a</bar><bar>b</bar></foo>.bar',<><bar>a</bar><bar>b</bar></>);
tc.assertEquals('<foo/>','');

// Attributes
tc.assertEquals('<foo id="roof"/>.@id','roof');
tc.assertEquals('<foo id="{x}"/>.@id','{x}');
tc.assertEquals('<foo id={x}/>.@id',5);

// . selector
tc.assertEquals('<foo><bar>a</bar><bar>b</bar></foo>.bar[0]','a');
tc.assertEquals('<foo><bar>a</bar><bar>b</bar></foo>.bar.length()',2);

// .. selector search
tc.assertEquals('<foo><x><bar>a</bar></x></foo>..bar','a');
// Multi-.. selector search
tc.assertEquals('<foo><x><bar>a</bar><bar>b</bar></x></foo>..bar.length()',2);
tc.assertEquals('<foo><x><bar>a</bar><bar>b</bar></x><bar>c</bar></foo>..bar.length()',3);
// Nested tag .. selector search
tc.assertEquals('<foo><x><bar>a</bar><bar>b<bar>c<bar>d</bar></bar></bar></x></foo>..bar.length()',4);

var array = ['a','b','c'];
var i = 0;
for each (var child in <foo><a/><b/><c/></foo>.children()) {
	tc.assertEquals('child.name()',array[i++]);
}