/*
 * Alt Web Framework
 *
 * http://alt.cellosoft.com/
 *
 * Copyright © 2005-2011 Marcello Bastéa-Forte and Cellosoft
 *
 * Licensed under zlib license.
 *
 * This software is provided 'as-is', without any express or implied warranty.
 * In no event will the authors be held liable for any damages arising from the
 * use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 *    1. The origin of this software must not be misrepresented; you must not
 *       claim that you wrote the original software. If you use this software
 *       in a product, an acknowledgment in the product documentation would be
 *       appreciated but is not required.
 *    2. Altered source versions must be plainly marked as such, and must not be
 *    3. This notice may not be removed or altered from any source distribution.
 */


/**
 * <p>This method loops over an object and calls the function 'fun' for each value in
 * the array.</p>
 * <p>The fun will be called with the arguments [key, object[key], object], where key
 * is the current key in the array.  Unlike for (key in object), this will skip values from
 * Object.prototype (such as this method)</p>
 * <p>An optional "thisPointer" can be passed to this method and will be passed to fun.</p>
 * @param fun callback function executed for each defined index in the Array
 * @param [thisPointer] optional this pointer
 * @return {void}
 */
Object.forEach = function Object$forEach(object,fun,thisPointer) {
	for (var key in object) {
		var value = object[key];
		if (value !== Object.prototype[key]) {
			fun.call(thisPointer, key, value, object);
		}
	}
};
/**
 * This method copies values from a given source object to the current object.
 * @param source the object to copy values from
 * @return this
 */
Object.extend = function Object$extend(destination,source) {
	Object.forEach(source,function(key,value) {
		destination[key] = value;
	});
	return destination;
};
/**
 * This method (like Object.extend) copies values from a given source object to the current
 * object, but it skips key that are already defined.
 * @param source the object to copy values from
 * @see Object.prototype.extend
 * @return this
 */
Object.extendMissing = function Object$extendMissing(destination,source) {
    if (source) {
        Object.forEach(source,function(key,value) {
            if (!(key in destination)) {
                destination[key] = value;
            }
        });
    }
	return destination;
};

/**
 * <p>Converts an "Array-like" Object into an array.  I.E. an object with a length
 * property and 0,1,2,...,length-1 properties.</p>
 *
 * <p>Notes: If you pass an array into Array.from, this returns a copy.</p>
 *
 *
 * @param arrayLike the Array-like object
 * @return a new Array with length arrayLike.length, and values 0 through arrayLike.length-1 from arrayLike
 */
Array.from = function Array$from(arrayLike) {
	var array = new Array(arrayLike.length),
        i=0;
	for (; i<arrayLike.length; i++) {
		if (i in arrayLike) {
			array[i] = arrayLike[i];
		}
	}
	return array;
};
Object.extendMissing(Array.prototype, {
	/**
	 * <p><strong>JavaScript 1.6 browsers implement this method natively.  The difference between
	 * this version and the Mozilla implementation is this version does less error checking.</strong></p>
	 *
	 * <p>This method loops over an array and calls the function 'fun' for each value in
	 * the array.</p>
	 * <p>The fun will be called with the arguments [array[index], index, array], where index
	 * is the current position in the array.</p>
	 * <p>An optional "thisPointer" can be passed to this method and will be passed to fun.</p>
	 * <p>Note, this method skips undefined indices (e.g. with sparse Arrays).</p>
	 * @param fun callback function executed for each defined index in the Array
	 * @param [thisPointer] optional this pointer
	 * @return {void}
	 */
	forEach: function Array$forEach(fun, thisPointer) {
		for (var i = 0, length = this.length; i < length; i++) {
			if (i in this) {
				fun.call(thisPointer, this[i], i, this);
			}
		}
	},

	/**
	 * <p><strong>JavaScript 1.6 browsers implement this method natively.  The difference between
	 * this version and the Mozilla implementation is this version does less error checking.</strong></p>
	 *
	 * <p>This method creates a new Array with values constructed by passing the values of an existing
	 * Array into a function and storing the return values.</p>
	 * <p>The fun will be called with the arguments [array[index], index, array], where index
	 * is the current position in the array.</p>
	 * <p>An optional "thisPointer" can be passed to this method and will be passed to fun.</p>
	 * <p>Note, this method skips undefined indices (e.g. with sparse Arrays).</p>
	 * @param fun callback function executed for each defined index in the Array
	 * @param thisPointer optional this pointer
	 * @return {Array} the new array
	 */
	map: function Array$map(fun, thisPointer) {
		var result = new Array(length);
		for (var i = 0, length = this.length; i < length; i++) {
			if (i in this) {
				result[i] = fun.call(thisPointer, this[i], i, this);
			}
		}
		return result;
	},

	/**
	 * <p><strong>JavaScript 1.6 browsers implement this method natively.  The difference between
	 * this version and the Mozilla implementation is this version does less error checking.</strong></p>
	 *
	 * <p>This method creates a new Array by filtering the original array's values through a function.</p>
	 * <p>The fun will be called with the arguments [array[index], index, array], where index
	 * is the current position in the array.</p>
	 * <p>An optional "thisPointer" can be passed to this method and will be passed to fun.</p>
	 * <p>Note, this method skips undefined indices (e.g. with sparse Arrays).</p>
	 * @param fun callback function executed for each defined index in the Array
	 * @param thisPointer optional this pointer
	 * @return {Array} the new array
	 */
	filter: function Array$filter(fun, thisPointer) {
		var length = this.length,
		    result = [],
            i=0,
            val;
		for (; i < length; i++) {
			if (i in this) {
				val = this[i]; // in case fun mutates this
				if (fun.call(thisPointer, val, i, this)) {
					result.push(val);
				}
			}
		}
		return result;
	}
});

Object.extend(Function.prototype, {
	/**
	 * Create a subclass of an existing class with given (optional) methods.
	 * Class Methods (functions on an object) can be specified through the methods argument.
	 * You can specify a constructor by defining a method named "constructor."  Otherwise
	 * the default constructor will be used.  The default constructor calls the parent
	 * constructor:
	 * <pre>
	 * function Function$DefaultConstructor() {
	 *		arguments.callee.parent.call(this);
	 *	}
	 * </pre>
	 * Example:
	 * <pre>
	 * var A = Object.subclass({
	 * 	constructor: function(name) {
	 * 		log("A constructor("+name+")");
	 * 		this.name = name;
	 * 	},
	 * 	foo: function() {
	 * 		log("A("+this.name+").foo()");
	 * 	},
	 * 	bar: function() {
	 * 		log("A("+this.name+").bar()");
	 * 	}
	 * });
     *
	 * var B = A.subclass({
	 * 	constructor: function(name,arg2) {
	 *      // call super constructor
	 * 		arguments.callee.parent.call(this,name);
     * 		log("B constructor("+name+","+arg2+")");
	 * 	},
	 * 	foo: function() {
	 *      // call super class "foo" method
	 * 		arguments.callee.parent.call(this);
	 * 		log("B("+this.name+").foo()");
	 * 	}
	 * });
	 * </pre>
	 *
	 * @see Function.prototype.addMethods
	 * @param [methods] an associative Object of method names -> functions
	 * @return the new class
	 */
	subclass: function Function$subclass(methods) {
		var constructor = (methods && methods.constructor !== Object && methods.constructor) ||
			(this !== Object &&
			function Function$DefaultSubclassConstructor() {
				arguments.callee.parent.call(this);
			}) ||
			function Function$ObjectSubclassConstructor() {};
		constructor.parent = this;
		constructor.prototype = new this;
		if (methods) {
			constructor.addMethods(methods);
		}
		constructor.prototype.constructor = constructor;
		return constructor;
	},
	addMethods: function Function$addMethods(methods) {
		Object.forEach(methods,function(name,method) {
            method.parent = this.parent.prototype[name];
            this.prototype[name] = method;
		},this);
	},
	/**
	 * Binds a function to an object instance with optional default parameters. Useful for passing around to callbacks.
	 *
	 * Example:
	 * <pre>
	 *  var objectFoo = object.foo.bind(object);
	 *  objectFoo(5,4); // same as object.foo(5,4);
	 *
	 *  var objectFooFive = object.foo.bind(object,5);
	 *  objectFoo(4); // same as object.foo(5,4);
	 * </pre>
	 *
	 * @param instance target instance for function
	 * @return a new function that calls 'this' on
	 */
	bind: function Function$bind(instance) {
		var f = this,
            leftArgs = Array.prototype.slice.call(arguments, 1);
		return function Function$bindFunc() {
            return f.apply(instance, leftArgs.concat(Array.from(arguments)));
		};
	}
});