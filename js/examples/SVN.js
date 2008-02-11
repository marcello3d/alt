
SVNNodeKind = Packages.org.tmatesoft.svn.core.SVNNodeKind;
SVNURL = Packages.org.tmatesoft.svn.core.SVNURL;
SVNRepositoryFactory = Packages.org.tmatesoft.svn.core.io.SVNRepositoryFactory;


Packages.org.tmatesoft.svn.core.internal.io.dav.DAVRepositoryFactory.setup();
Packages.org.tmatesoft.svn.core.internal.io.fs.FSRepositoryFactory.setup();
Packages.org.tmatesoft.svn.core.internal.io.svn.SVNRepositoryFactoryImpl.setup();



var url = "svn://cellosoft.com/alt/trunk/js";
var name = "anonymous";
var password = "anonymous";


response.contentType = "text/plain";

response.writeln("connecting to "+url+"...");
response.flush();

/*
 * Called recursively to obtain all entries that make up the repository tree
 * repository - an SVNRepository which interface is used to carry out the
 * request, in this case it's a request to get all entries in the directory
 * located at the path parameter;
 * 
 * path is a directory path relative to the repository location path (that
 * is a part of the URL used to create an SVNRepository instance);
 *  
 */
function listEntries(repository, path) {
    /*
     * Gets the contents of the directory specified by path at the latest
     * revision (for this purpose -1 is used here as the revision number to
     * mean HEAD-revision) getDir returns a Collection of SVNDirEntry
     * elements. SVNDirEntry represents information about the directory
     * entry. Here this information is used to get the entry name, the name
     * of the person who last changed this entry, the number of the revision
     * when it was last changed and the entry type to determine whether it's
     * a directory or a file. If it's a directory listEntries steps into a
     * next recursion to display the contents of this directory. The third
     * parameter of getDir is null and means that a user is not interested
     * in directory properties. The fourth one is null, too - the user
     * doesn't provide its own Collection instance and uses the one returned
     * by getDir.
     */
	
	// Deal with getDir being overloaded...
	var entries = repository["getDir(java.lang.String,long,java.util.Map,java.util.Collection)"](path, -1, null, null);
    //var entries = repository.getDir(path, -1, null, null);
    var iterator = entries.iterator();
    while (iterator.hasNext()) {
        var entry = iterator.next();
        response.writeln("/" + (path.equals("") ? "" : path + "/")
                + entry.name + " (author: '" + entry.author
                + "'; revision: " + entry.revision + "; date: " + entry.date + ")");
		response.flush();
        /*
         * Checking up if the entry is a directory.
         */
        if (entry.getKind() == SVNNodeKind.DIR) {
            listEntries(repository, (path.equals("")) ? entry.getName()
                    : path + "/" + entry.getName());
        }
    }
   }



/*
 * Creates an instance of SVNRepository to work with the repository.
 * All user's requests to the repository are relative to the
 * repository location used to create this SVNRepository.
 * SVNURL is a wrapper for URL strings that refer to repository locations.
 */
var repository = SVNRepositoryFactory.create(SVNURL.parseURIEncoded(url));



/*
 * User's authentication information (name/password) is provided via  an 
 * ISVNAuthenticationManager  instance.  SVNWCUtil  creates  a   default 
 * authentication manager given user's name and password.
 * 
 * Default authentication manager first attempts to use provided user name 
 * and password and then falls back to the credentials stored in the 
 * default Subversion credentials storage that is located in Subversion 
 * configuration area. If you'd like to use provided user name and password 
 * only you may use BasicAuthenticationManager class instead of default 
 * authentication manager:
 * 
 *  authManager = new BasicAuthenticationsManager(userName, userPassword);
 *  
 * You may also skip this point - anonymous access will be used. 
 */

 
/*
var authManager = org.tmatesoft.svn.core.wc.SVNWCUtil.createDefaultAuthenticationManager(name, password);
repository.setAuthenticationManager(authManager);
*/
try {
    /*
     * Checks up if the specified path/to/repository part of the URL
     * really corresponds to a directory. If doesn't the program exits.
     * SVNNodeKind is that one who says what is located at a path in a
     * revision. -1 means the latest revision.
     */
    var nodeKind = repository.checkPath("", -1);
    if (nodeKind == SVNNodeKind.NONE) {
		throw "There is no entry at '" + url + "'.";
    } else if (nodeKind == SVNNodeKind.FILE) {
        throw "The entry at '" + url + "' is a file while a directory was expected.";
    }
    /*
     * getRepositoryRoot() returns the actual root directory where the
     * repository was created. 'true' forces to connect to the repository 
     * if the root url is not cached yet. 
     */
    response.writeln("Repository Root: " + repository.getRepositoryRoot(true));
    /*
     * getRepositoryUUID() returns Universal Unique IDentifier (UUID) of the 
     * repository. 'true' forces to connect to the repository 
     * if the UUID is not cached yet.
     */
    response.writeln("Repository UUID: " + repository.getRepositoryUUID(true));
    response.writeln("");

    /*
     * Displays the repository tree at the current path - "" (what means
     * the path/to/repository directory)
     */
    listEntries(repository, "");
} catch (svne) {
    throw "error while listing entries: " + svne.message;
}
/*
 * Gets the latest revision number of the repository
 */
var latestRevision = -1;
try {
    latestRevision = repository.getLatestRevision();
} catch (svne) {
    throw "error while fetching the latest repository revision: " + svne.message
    System.exit(1);
}
response.writeln("");
response.writeln("---------------------------------------------");
response.writeln("Repository latest revision: " + latestRevision);



