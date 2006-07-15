
Rhino.require('alt.resource.LoaderException');


var Loader = {};

Loader.resources = {};

Loader.getResource = function(resourceName) {
	// Check if we've got the resource before
	if (!Loader.resources[resourceName])
		Loader.resources[resourceName] = {
			resource: Rhino.getResource(resourceName),
			cache: new java.util.HashMap()
		};
		
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
Loader.getLoader = function(extension) {
	var loader = Loader.types[extension];
	if (loader==null)
		throw new LoaderException("Unknown extension "+extension);
	return loader;
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

Loader.load = function(resourceName, constructor) {
	// Get default constructor for files of this type, if they exist.
	if (constructor==null)
		constructor = Loader.getLoader(Loader.getExtension(resourceName));
	
	// Get the resource
	var resource = Loader.getResource(resourceName);
	
	// Otherwise build a new object with constructor from resource
	return new constructor(resource.resource, resourceName);
}
/**
 * Gets a resource from the cache
 */
Loader.get = function(resourceName, constructor) {
	// Get default constructor for files of this type, if they exist.
	if (constructor==null)
		constructor = Loader.getLoader(Loader.getExtension(resourceName));
	
	// Get the resource
	var resource = Loader.getResource(resourceName);
	
	// Check for cached object
	var cachedObject = resource.cache.get(constructor);
	// Check version tag
	var newTag = resource.resource.getVersionTag();
	
	// If there is a cache, 
	if (cachedObject != null) {
		// and version not changed, return it
		if (!newTag.equals(cachedObject.versionTag))
			return cachedObject.object;
		// otherwise, check if the cachedObject has an 'updateResource' function
		// and use it
		if (cachedObject.object.updateResource instanceof Function) {
			// save new version tag
			cachedObject.versionTag = newTag;
			// update resource
			cachedObject.object.updateResource(resource.resource);
			// return it
			return cachedObject.object;
		}
	}
		
	// Otherwise build a new object with constructor from resource
	var newObject = new constructor(resource.resource, resourceName);

	// Store new version tag		
	resource.versionTag = newTag;
	// Store in cache
	resource.cache.put(constructor,{
		versionTag: newTag,
		object: newObject
	});
	
	return newObject;
}