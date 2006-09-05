
var session = request.session;

var sessiondata = session.getAttribute('chatData');

var input = request.getParameter('input');

if (sessiondata) {
    if (!sessiondata.name) {
        sessiondata.name = input;
        sendAll(<p>Set username to {input}</p>);
    } else {
        sendAll(<p><b>{sessiondata.name}:</b> {input}</p>);
    }
}