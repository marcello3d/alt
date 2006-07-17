Rhino.require('alt.util.Inspector');
Rhino.require('alt.resource.XML');


default xml namespace = 'http://www.w3.org/1999/xhtml';
var xml = alt.resource.Loader.load('Inspector.xml');



var ins = new alt.util.Inspector(global);

//Rhino.log('xml='+xml);

var x = ins.toHTML();

//xml..div.appendChild(x);

response.status = response.SC_OK;
response.contentType = 'text/xml; charset=utf-8'
response.writer.print(<?xml version="1.0"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
 <title>Inspector</title>    
 <meta http-equiv="content-type" content="application/xhtml+xml; charset=utf-8" />
 <style type="text/css"><![CDATA[
 pre {
   font-size: 0.8em;
 }
 ]]></style>
</head>
<body>
<h1>Module inspector (dynamic class analysis)</h1>
<div>{x}</div>
<p>Back to <a href="..">examples list</a></p>
</body>
</html>.toString());
