
var x = 5;

// Simple XML
var x2 = <d/>;



XML.prettyPrinting = false;
XML.prettyIndent = false;
tc.assertEqual('<foo>bar</foo>','bar');
tc.assertEqual('<foo>{x}</foo>',5);
tc.assertEqual('<foo><bar>a</bar><bar>b</bar></foo>.bar',<><bar>a</bar><bar>b</bar></>);
tc.assertEqual('<foo/>','');

// Attributes
tc.assertEqual('<foo id="roof"/>.@id','roof');
tc.assertEqual('<foo id="{x}"/>.@id','{x}');
tc.assertEqual('<foo id={x}/>.@id',5);

// . selector
tc.assertEqual('<foo><bar>a</bar><bar>b</bar></foo>.bar[0]','a');
tc.assertEqual('<foo><bar>a</bar><bar>b</bar></foo>.bar.length()',2);

// .. selector search
tc.assertEqual('<foo><x><bar>a</bar></x></foo>..bar','a');
// Multi-.. selector search
tc.assertEqual('<foo><x><bar>a</bar><bar>b</bar></x></foo>..bar.length()',2);
tc.assertEqual('<foo><x><bar>a</bar><bar>b</bar></x><bar>c</bar></foo>..bar.length()',3);
// Nested tag .. selector search
tc.assertEqual('<foo><x><bar>a</bar><bar>b<bar>c<bar>d</bar></bar></bar></x></foo>..bar.length()',4);
tc.assertEqual('<foo><a/><b/><c/></foo>.*',<foo><a/><b/><c/></foo>.*);

var array = ['a','b','c'];
var i = 0;
for each (var child in <foo><a/><b/><c/></foo>.children()) {
	tc.assertEqual('child.name()',array[i++]);
}

var xml = <top><foo/><bar/></top>;
function replaceWith(oldnode,newnode) {
	oldnode.parent().*[oldnode.childIndex()] = newnode;
}
for each (var child in xml.*)
	replaceWith(child,<buh/>);
tc.assertEqual("xml", <top><buh/><buh/></top>);

