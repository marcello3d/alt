
var session = request.session;

var sessiondata = session.getAttribute('chatData');

var input = request.getParameterMap();

if (sessiondata) {
    if (!sessiondata.name) {
        sessiondata.name = input;
        sessiondata.queue.offer(<p>Set username to {input}</p>);
    } else {
        sessiondata.queue.offer(<p><b>{sessiondata.name}:</b> {input}</p>);
    }
}