
var sessiondata = request.session.getAttribute('chatData');

response.write("<html>");
response.write("<body>");
response.write(<><p>Chat conversation... (please type your name)</p><hr/></>);

response.flush();
    
var queue = new java.util.concurrent.ArrayBlockingQueue(10);

sessiondata.queue = queue;

while (true) {
    var message = queue.take();
    response.write(message);
    response.flush();
}

response.write(<><hr/><p>Done.</p></>)
response.write("</body>");
response.write("</html>");