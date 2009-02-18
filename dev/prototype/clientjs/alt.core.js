///////////////////////////////////////////////////////////////////////////////
Object.prototype.forEach = function(fun,thisp) {
	for (var key in this) {
		var value = this[key];
		if (value !== Object.prototype[key]) {
			fun.call(thisp, key, value, this);
		}
	}
}
Object.prototype.extend = function(map) {
	map.forEach(function(key,value) {
		this[key] = value;
	},this);
};
Object.prototype.extendMissing = function(map) {
	map.forEach(function(key,value) {
		if (!(key in this)) {
			this[key] = value;
		}
	},this);
};

///////////////////////////////////////////////////////////////////////////////
Array.from = function(arrayLike) {
	var array = new Array(arrayLike.length);
	for (var i=0; i<arrayLike.length; i++) {
		array[i] = arrayLike[i];
	}
	return array;
};
Array.prototype.extendMissing({
	forEach: function(fun, thisp) {
		var len = this.length;
		for (var i = 0; i < len; i++) {
			if (i in this) {
				fun.call(thisp, this[i], i, this);
			}
		}
	},

	map: function(fun, thisp) {
		var length = this.length;
		var result = new Array(length);
		for (var i = 0; i < length; i++) {
			if (i in this) {
				result[i] = fun.call(thisp, this[i], i, this);
			}
		}
		return result;
	},
	filter: function(fun, thisp) {
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
	extend: function(constructor,methods) {
		var proto = new this;
		proto.constructor = constructor;
		constructor.parent = this;
		constructor.prototype = proto;
		
		if (methods) {
			methods.forEach(function(key,value) {
				value.parent = this.prototype[key];
				proto[key]=value;
			},this);
		}
		
		return constructor;
	},
	link: function(instance) {
		var f = this;
		return function() {
			f.apply(instance,Array.from(arguments));
		};
	}
});