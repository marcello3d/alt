// Create global variables, if they don't exist
if (!global.syncTest) global.syncTest = 0;

Rhino.synchronize(global, function() { 
	// Copy current value
	var value = global.syncTest;
	tc.assertEqual('global.syncTest',value);
	// Update value
	global.syncTest += 50;
	value += 50;
	tc.assertEqual('global.syncTest',value);
	
	// Sleep
	//java.lang.Thread.sleep(4000);
	
	// Check if value has changed
	tc.assertEqual('global.syncTest',value);
});
