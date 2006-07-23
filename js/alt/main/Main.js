// Get the configuration file
Rhino.require('alt.dictator.Dictator');	
Rhino.require('alt.main.DelayLoader');

DelayLoader.create(this,'SQLSchema','alt.squeal.SQLSchema');
DelayLoader.create(this,'Delight','alt.delight.Delight');
DelayLoader.create(this,'Onion','alt.onion.Onion');

var dictator = new alt.dictator.Dictator();
dictator.handle(request, response, this);

