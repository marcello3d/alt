
Rhino.require('alt.resource.LoaderException');


var Loader = {};

Loader.resources = {};

Loader.getResource = function(resourceName) {
	// Check if we've got the resource before
	if (!Loader.resources[resourceName]) {
		Loader.resources[resourceName] = {
			resource: Rhino.getResource(resourceName),
			cache: new java.util.HashMap()
		};
	}
		
	return Loader.resources[resourceName];
}

Loader.types = {};

/**
 * Defines a mime type
 */
Loader.defineType = function(constructor, type) {
	for (var i=1; i<arguments.length; i++)
		Loader.types[arguments[i]] = constructor;
}
/**
 * Gets a loader from a type
 */
Loader.getConstructor = function(extension) {
	var constructor = Loader.types[extension];
	if (constructor==null)
		throw new LoaderException("Unknown extension "+extension);
	return constructor;
}

/**
 * Gets an extension from a resourcename.
 */
Loader.getExtension = function(resourceName) {
	return /\.([a-z0-9]+)$/i.exec(resourceName)[1];
}



/**
 * Loads a resource fresh from the cache
 */

Loader.load = function(resourceName, constructor, useCache) {
	// Get default constructor or files of this type, if they exist.
	if (constructor==null)
		constructor = Loader.getConstructor(Loader.getExtension(resourceName));
	
	// Get the resource
	var resource = Loader.getResource(resourceName);
	
	return Loader.loadResource(resource, constructor, useCache);
}

/**
 * Gets a resource from the cache
 */
Loader.get = function(resourceName, constructor) {
	return Loader.load(resourceName, constructor, true);
}

/**
 * Loads a resource
 */
Loader.loadResource = function(resource, constructor, useCache) {
	Rhino.log("load resource "+resource.resource+" "+constructor+" use cache = "+useCache);
	
	var newTag = null;
	if (useCache) {
		// Check for cached object
		var cachedObject = resource.cache.get(constructor);
		
		// Check version tag
		newTag = resource.resource.getVersionTag();
		Rhino.log("new tag = "+newTag);
		
		// If there is a cache, 
		if (cachedObject != null) {
			Rhino.log("old tag = "+cachedObject.versionTag);
			// and version not changed, return it
			if (!newTag.equals(cachedObject.versionTag)) {

				Rhino.log("unchanged!  returning cached object");
				return cachedObject.object;
			}
			// otherwise, check if the cachedObject has an 'updateResource' function
			// and use it
			if (cachedObject.object.updateResource instanceof Function) {
				// save new version tag
				cachedObject.versionTag = newTag;
				// update resource
				cachedObject.object.updateResource(resource);
				// return it
				return cachedObject.object;
			}
		}
	}
		
	// Otherwise build a new object with constructor from resource
	var newObject = new constructor(resource);

	if (useCache) {
		// Store new version tag		
		//resource.cachedVersionTag = newTag;
		// Store in cache
		resource.cache.put(constructor,{
			versionTag: newTag,
			object: newObject
		});
	}
	
	return newObject;
}
