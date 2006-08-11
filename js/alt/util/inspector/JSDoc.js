/**
 * Constructs a new JSDoc object
 * @class
 * The JSDoc class takes a Function object and tries to analyze information 
 * about its type, arguments, and so on.  It uses the __jsdoc__ property of 
 * functions, if available, to deduce further information.
 * @param {Function} func  the function to analyze
 */
function JSDoc(func) {
	this.returnType = null;
	this.returnDesc = null;
	
	if (func instanceof Function) {
		// Get arguments from source string
		var f = func.toString ? func.toString() : '';
		var args = /function[^(]+\(([^)]*?)\)/.exec(f);
		if (args && args[1])
			this.args = args[1].split(/,\s/);
			
		// Try to guess return type (this could be improved more)
		if (!f.match(/return\s*[^;\s]+;/))
			this.returnType = 'void';
			
		// Try to guess member variables
		var members = /this\.([a-z_][a-z0-9_]*)\s*=/gm.exec(f);
			
		// See if a jsdoc is defined for this function
		var doc = func.__jsdoc__;
	    this.source = func.__source__;
	    this.lines = func.__lines__;
		if (doc) {
			
			// Build parameter map
			this.params = [];
			for each (var arg in this.args)
				this.params[arg] = {type:null, desc: null };
			
			this.exceptions = [];
			this.desc = '';
			this.classDesc = '';
			var inDesc = true;
			// Split doc by lines
			for each (var line in doc.split(/\n/)) {
				// Match lines to "@cmd {type} name etc"
				var match = /^@(\S+)\s*((?:\{([^}]+)\}\s*)?((\S*)\s*(.*)))$/.exec(line);
				if (!match) {
					// No match?  Then we're just generating a description
					if (inDesc)
						this.desc += line+'\n';
					else
						this.classDesc += line+'\n';
				} else {
					var cmd = match[1];
					var fullDesc = match[2]; // full line after cmd
					var type = match[3];     // optional {type}
					var typeDesc = match[4]; // full line after type
					var varName = match[5];  // first word after optional type
					var varDesc = match[6];  // full line after var name
					switch (cmd) {
						// Switch between possible matches
						case 'deprecated':
							this.deprecated = fullDesc || true;
							break;
						case 'class':
							inDesc = false;
							break;
						case 'type':
							this.returnType = type || typeDesc;
							break;
						case 'return':
						case 'returns':
							if (type)
								this.returnType = type;
							this.returnDesc = typeDesc;
							break;
						case 'author':
							this.author = fullDesc;
							break;
						case 'since':
							this.since = fullDesc;
							break;
						case 'private':
						    this.markedPrivate = true;
						    break;
						case 'param':
							if (this.params[varName]) {
								if (type)
									this.params[varName].type = type;
								this.params[varName].desc = varDesc;
							}
							break;
						case 'exception':
							this.exceptions.push({type:type, desc:typeDesc});
							break;
					}
				}
			}
			this.splitDesc = /^([\s\S]+?(?:\.\s|\.?$))([\s\S]*)$/.exec(this.desc);
		}
	}
}
