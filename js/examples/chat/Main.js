
if (!examples.chat.roomData)
    examples.chat.roomData = {};

function sendAll(message) {
    for each (var sessiondata in examples.chat.roomData)
        sessiondata.queue.offer(message);
}

dictator.map({
    'frame':    'examples.chat.Frame',
    'req':      'examples.chat.Request',
    '':         'examples.chat.Index'
});