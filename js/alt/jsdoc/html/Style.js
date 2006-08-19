Alt.require('alt.resource.String');

var css = Resources.get('style.css',alt.resource.StringResource);

response.contentType = "text/css; charset=UTF-8";
response.status = response.SC_OK;
response.writer.print(css);
 