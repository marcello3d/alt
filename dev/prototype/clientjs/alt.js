
Array.prototype.query = function(where) {
	var query  = new ArrayQuery;
	query.whereTest = where;
	query.array = this;
	return query;
};
var Query = Object.subclass({
	test: function(object) {
		this.whereTest.forEach(function (key, value) {
			if (key in object) {
				var candidate = object[key];
				var test = value;
				if (test instanceof Query) {
					var subset = test.get();
					var found = false;
					for (var i=0; i<subset.length; i++) {
						if (subset[i] === candidate) {
							found = true;
							break;
						}
					}
					if (!found) {
						return false;
					}
				} else if (candidate !== test) {
					return false;
				}
			} else {
				return false;
			}
			
		});
		return true;
	},
	clone: function() {
		var query = new this.constructor;
		query.extendMissing(this);
		return query;
	},
	where: function(where) {
		var query = this.clone();
		query.whereTest = where;
		return query;
	},
	reverse: function() {
		var query = this.clone();
		if (query.sortFunc) {
			if (query.preSortSlice) {
				query.preLimitReverse = !query.preLimitReverse;
			}
		}
		query.reverse = !query.reverse;
		return query;
	},
	sort: function(sortFunc) {
		var query = this.clone();
		if (query.sortFunc) {
			query.sortFunc.push(sortFunc);
		} else {
			query.sortFunc = [sortFunc];
		}
		return query;
	},
	slice: function(start,end) {
		var query = this.clone();
		var name = this.sortFunc ? 'postSortSlice' : 'preSortSlice';
		
		if (name in query) {
			if (query[name].end > query[name].start + end) {
			    query[name].end = query[name].start + end;
			}
			query[name].start += start;
		} else {
			query[name] = {
				start:	start,
				end:	end
			};
		}
		
		return query;
	}
});


var ArrayQuery = Query.subclass({
	get: function() {
		var results;
		if (this.whereTest) {
			results = [];
			for (var i=0; i<this.array.length; i++) {
				var item = this.array[i];
				if (this.test(item)) {
					results.push(item);
				}
				if (this.preSortLimit && results.length == this.preSortLimit) {
					break;
				}
			}
		} else if (this.preSortSlice) {
			results = this.array.slice(this.preSortSlice.start,this.preSortSlice.end);
		} else {
			results = this.array.slice(0,this.array.length);
		}
		if (this.sortFunc) {
			var sortFunc = this.sortFunc;
			results.sort(function(a,b) {
				for (var i=sortFunc.length-1; i>=0; i--) {
					var diff = sortFunc[i](a,b);
					if (diff!=0) {
						return diff;
					}
				}
				return 0;
			});
		}
		if (this.postSortSlice) {
			results = results.slice(this.postSortSlice.start,this.postSortSlice.end);
		}
		return results;
	}
});
