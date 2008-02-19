displaySource("Upload.js","Upload.xml");

var commons = Packages.org.apache.commons;
var DiskFileItemFactory = commons.fileupload.disk.DiskFileItemFactory;
var ServletFileUpload = commons.fileupload.servlet.ServletFileUpload;

Alt.require('alt.resource.XML');

var xml = Resources.load('Upload.xml');

//default xml namespace = 'http://www.w3.org/1999/xhtml';

var div = xml..div.(@id=="content");

if (ServletFileUpload.isMultipartContent(request)) {
	
	// Create a factory for disk-based file items
	var factory = new DiskFileItemFactory();
	
	// Create a new file upload handler
	var upload = new ServletFileUpload(factory);
	// Set overall request size constraint
	upload.setSizeMax(1024*1024);
	
	// Parse the request
	var items = upload.parseRequest(request);
	
	// Process the uploaded items
	var iter = items.iterator();
	while (iter.hasNext()) {
	    var item = iter.next();
	    
	    var field = <p><b>Field:</b> {item.fieldName}<br/></p>;
	    if (!item.isFormField()) {
	    	
	    	field.appendChild(<blockquote>
	    	  <b>Size:</b> {item.size}<br/>
	    	  <b>Content Type:</b> {item.contentType}<br/>
	    	  <b>File Name:</b> {item.name}<br/>
	    	  <b>Data:</b> {item.string.substring(0,100)}...
	    	</blockquote>);
	    } else {
	    	field.p.appendChild(<blockquote>
	    	  <b>String:</b> {item.string}
	    	</blockquote>);
	    }
	    div.appendChild(field);
	}
} else {
}

response.write(xml.toXMLString());
