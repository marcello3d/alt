Alt.require('alt.resource.String');

var css = Resources.get('style.css', alt.resource.StringResource);

response.start("text/css; charset=UTF-8");
response.write(css);
 