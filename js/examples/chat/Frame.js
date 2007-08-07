



var sessiondata = {};

examples.chat.roomData[request.sessionId] = sessiondata;
request.session.setAttribute('chatData', sessiondata);

response.write("<html>");
response.write("<body>");
response.write(<><p>Chat conversation... (please type your name)</p><hr/></>);

response.flush();
    
var queue = new java.util.concurrent.ArrayBlockingQueue(10);

sessiondata.queue = queue;

while (true) {
    var message = queue.take();
    if (message=='quit')
	    break;
    response.write(message);
    response.flush();
}

delete roomData[request.sessionId];

response.write(<><hr/><p>Done.</p></>)
response.write("</body>");
response.write("</html>");