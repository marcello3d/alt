
java.lang.System.out.println("inside Test2.js..."+this);

function foo(local) {
	local.response.writer.println("module2 = "+module+"<br>");
	return true;
}
