///////////////////////////////////////////////////////////////////////////////
Object.prototype.forEach = function Object$forEach(fun,thisp) {
	for (var key in this) {
		var value = this[key];
		if (value !== Object.prototype[key]) {
			fun.call(thisp, key, value, this);
		}
	}
};
Object.prototype.extend = function Object$extend(map) {
	map.forEach(function(key,value) {
		this[key] = value;
	},this);
	return this;
};
Object.prototype.extendMissing = function Object$extendMissing(map) {
	map.forEach(function(key,value) {
		if (!(key in this)) {
			this[key] = value;
		}
	},this);
	return this;
};

///////////////////////////////////////////////////////////////////////////////
Array.from = function Array$from(arrayLike) {
	var array = new Array(arrayLike.length);
	for (var i=0; i<arrayLike.length; i++) {
		array[i] = arrayLike[i];
	}
	return array;
};
Array.prototype.extendMissing({
	forEach: function Array$forEach(fun, thisp) {
		var len = this.length;
		for (var i = 0; i < len; i++) {
			if (i in this) {
				fun.call(thisp, this[i], i, this);
			}
		}
	},

	map: function Array$map(fun, thisp) {
		var length = this.length;
		var result = new Array(length);
		for (var i = 0; i < length; i++) {
			if (i in this) {
				result[i] = fun.call(thisp, this[i], i, this);
			}
		}
		return result;
	},
	filter: function Array$filter(fun, thisp) {
		var length = this.length;
		var result = [];
		for (var i = 0; i < length; i++) {
			if (i in this) {
				var val = this[i]; // in case fun mutates this
				if (fun.call(thisp, val, i, this)) {
					result.push(val);
				}
			}
		}
		return result;
	}
});

///////////////////////////////////////////////////////////////////////////////
Function.prototype.extend({
	subclass: function Function$subclass(methods) {
		var constructor = (methods && methods.constructor !== Object && methods.constructor) 
			|| function Function$DefaultConstructor(){};
		constructor.parent = this;
		constructor.prototype = new this;
		if (methods) {
			constructor.addMethods(methods);
		}
		constructor.prototype.constructor = constructor;
		return constructor;
	},
	addMethods: function Function$addMethods(methods) {
		methods.forEach(function(name,func) {
			func.parent = this.parent.prototype[name];
			this.prototype[name]=func;
		},this);
		return this;
	},
	link: function Function$link(instance) {
		var f = this;
		return function() {
			f.apply(instance,Array.from(arguments));
		};
	}
});