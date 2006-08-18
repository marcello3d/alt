
Alt.require("alt.resource.XML");

var xml = Resources.load('OnionML.onion.xml');

var onion = new Onion(xml);

var site = onion.getXML('site');

response.status = response.SC_OK;
response.contentType = "text/html";

response.writer.print(site);

