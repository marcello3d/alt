Alt.log('foooo');

Alt.require('alt.resource.xml')

var index = Resources.load('index.xml');


response.contentType = "text/html; charset=UTF-8";
response.status = response.SC_OK;
response.writer.print(index);

dictator.setHandled();
