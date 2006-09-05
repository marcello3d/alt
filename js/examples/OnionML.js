
Alt.require("alt.resource.XML");

var xml = Resources.load('OnionML.onion.xml');

var onion = new Onion(xml);

var site = onion.getXML('site');

response.write(site);

