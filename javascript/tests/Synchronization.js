// Create global variables, if they don't exist
if (!global.syncLock) global.syncLock = {};
if (!global.syncTest) global.syncTest = 0;

Rhino.synchronize(syncLock, function() { 
	// Copy current value
	var value = global.syncTest;
	tc.assertEquals('global.syncTest',value);
	// Update value
	global.syncTest += 50;
	value += 50;
	tc.assertEquals('global.syncTest',value);
	
	// Sleep
	//java.lang.Thread.sleep(4000);
	
	// Check if value has changed
	tc.assertEquals('global.syncTest',value);
});
