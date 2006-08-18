/**
 * @author Marcello
 */

Alt.require('alt.resource.XML');


var xml = Resources.load("overview-frame.xml");

var packages = xml..p.(@id=="packages");

packages.appendChild(<a href=""></a>);

response.contentType = "text/html; charset=UTF-8";
response.status = response.SC_OK;
response.writer.print(xml);
 