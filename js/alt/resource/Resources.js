
Alt.require('alt.resource.ResourceException');


/**
 * Static class
 */
var Resources = {};

Resources.resources = {};

/**
 * Gets a resource using Alt.getResource and adds a ResourceWrapper cache.
 * @param {String}  resourceName  name of resource as used by Alt.getResource
 * @return {Object}  the constructed internal resource object
 * @private
 */
Resources.getResource = function(resourceName) {
	// Check if we've got the resource before
	if (!Resources.resources[resourceName]) {
		Resources.resources[resourceName] = {
			resource: Alt.getResource(resourceName),
			cache: new java.util.HashMap()
		};
	}
		
	return Resources.resources[resourceName];
}


Resources.types = {};

/**
 * Defines an extension type -> constructor map
 * @param {Function}  constructor	constructor to call with this type
 * @param {String}    type			extension type name
 */
Resources.defineType = function(constructor, type) {
	for (var i=1; i<arguments.length; i++)
		Resources.types[arguments[i]] = constructor;
}
/**
 * Gets a loader from an extension type name
 * @param {String}  type  the extension type name
 * @return {Function}  the constructor associated with an extension type
 * @private
 */
Resources.getConstructor = function(type) {
	var constructor = Resources.types[type];
	if (constructor==null)
		throw new ResourceException("Unknown extension type "+type);
	return constructor;
}

/**
 * Gets an extension from a resourcename.
 * @param {String} resourceName
 * @private
 */
Resources.getExtension = function(resourceName) {
	return /\.([a-z0-9]+)$/i.exec(resourceName)[1];
}


/**
 * Gets a resource from the cache
 * @param {String}   resourceName   the name of the resource
 * @param {Function} constructor	ResourceWrapper constructor to load resource
 * @return {Object}  the return value from the ResourceWrapper
 */
Resources.get = function(resourceName, constructor) {
	return Resources.loadResource(resourceName, constructor, true).get();
}
/**
 * Gets a copy of the resource from the cache
 * @param {String}   resourceName   the name of the resource
 * @param {Function} constructor	ResourceWrapper constructor to load resource
 * @return {Object}  the return value from the ResourceWrapper
 */
Resources.load = function(resourceName, constructor) {
	return Resources.loadResource(resourceName, constructor, true).getCopy();
}

/**
 * Loads a resource fresh from the cache.
 * @param {String}  resourceName  name of resource
 * @param {Function} constructor constructor to construct with (optional)
 * @param {boolean} useCache  whether or not to use cache when loading
 * @return {Resource}  the loaded resourcewrapper
 * @private
 */
Resources.loadResource = function(resourceName, constructor, useCache) {
	// Get default constructor or files of this type, if they exist.
	if (constructor==null)
		constructor = Resources.getConstructor(
		Resources.getExtension(resourceName));
	
	// Get the resource
	var resource = Resources.getResource(resourceName);
	
	var newTag = null;
	if (useCache) {
		// Check for cached object
		var cachedObject = resource.cache.get(constructor);
		
		// Check version tag
		newTag = resource.resource.getVersionTag();
		
		// If there is a cache, 
		if (cachedObject != null) {
			// and version not changed, return it
			if (newTag.equals(cachedObject.versionTag))
				return cachedObject.object;
			// otherwise, check if the cachedObject has an 'updateResource' 
			// function and use it
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
	var newObject = new constructor(resource, resourceName);

	if (useCache) {
		// Store in cache
		resource.cache.put(constructor,{
			versionTag: newTag,
			object: newObject
		});
	}
	
	return newObject;
}
