Rhino.require('alt.util.Inspector');
var foo = 2;
var ins = new alt.util.Inspector(global);
XML.prettyPrint = true;
XML.prettyIndent = true;
XML.ignoreWhitespace = false;
XML.ignoreComments = false;

response.status = response.SC_OK;
response.contentType = 'application/xhtml+xml; charset=utf-8'
response.writer.print(
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<body>{ins.toHTML()}</body>
</html>);
