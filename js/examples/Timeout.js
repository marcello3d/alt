displaySource("Timeout.js");

response.start('text/plain');
var i = 0;
while (true) {
    response.writeln("foo "+(i++));
    response.flush();
    java.lang.Thread.sleep(100);
}
    