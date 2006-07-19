
Rhino.require('alt.resource.Loader', true);

/**
 * Constructs a new Resource object
 * @class
 * This class defines the basic concept of resources for the Alt Framework.
 * Subclasses can provide get and getCopy methods to get the contents of the 
 * resource.
 * @param {cello.alt.servlet.resource.Resource}  resource the java resource
 * @param {String} resourceName the name of this resource
 */
function Resource(resource, resourceName) {
}

/**
 * @return {Object} the object
 */
Resource.prototype.get = function() {
	return null;
}

/**
 * @return {Object} the object copy
 */
Resource.prototype.getCopy = function() {
	return null;
}
