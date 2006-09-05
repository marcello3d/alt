
if (!examples.chat.roomData)
    examples.chat.roomData = new java.util.HashMap();

var sessiondata = request.session.getAttribute('chatData');

if (sessiondata == null) {
    sessiondata = {};
    request.session.setAttribute('chatData', sessiondata);
}

examples.chat.roomData.put(request.session, sessiondata);

dictator.map({
    'frame':    'examples.chat.Frame',
    'req':      'examples.chat.Request',
    '':         'examples.chat.Index'
});