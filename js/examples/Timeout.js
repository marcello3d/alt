
var o = response.writer;
var i = 0;
while (true) {
    o.println("foo "+(i++));
    o.flush();
    java.lang.Thread.sleep(100);
}
    