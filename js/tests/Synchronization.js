// Create global variables, if they don't exist
if (!alt.tests.syncTest) alt.tests.syncTest = 0;

Alt.synchronize(alt.tests, function() { 
	// Copy current value
	var value = alt.tests.syncTest;
	tc.assertEqual('alt.tests.syncTest',value);
	// Update value
	alt.tests.syncTest += 50;
	value += 50;
	tc.assertEqual('alt.tests.syncTest',value);
	
	// Sleep
	//java.lang.Thread.sleep(4000);
	
	// Check if value has changed
	tc.assertEqual('alt.tests.syncTest',value);
});
