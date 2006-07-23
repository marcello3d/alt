

var StringUtils = {};

StringUtils.escapeHTML = function(text) {
	// Gross hack to convert Java strings?
	if (text instanceof java.lang.String)
		text = text + "";
	return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
};