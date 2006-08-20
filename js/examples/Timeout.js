
var o = response.writer;
var i = 0;
response.contentType = 'text/plain';
response.status = response.SC_OK;
while (true) {
    o.println("foo "+(i++));
    o.flush();
    java.lang.Thread.sleep(100);
}
    