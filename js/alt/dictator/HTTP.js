

var HTTP = {};


(function(){
    
    for each (var method in ['GET','POST','HEAD','OPTIONS','PUT','DELETE','TRACE'])
        HTTP[method] = method;
    
    for (var x in Packages.javax.servlet.http.HttpServletResponse) {
        if (x.match(/^SC_/))
            HTTP[x.substring(3)] = 
                    Packages.javax.servlet.http.HttpServletResponse[x];
    }
    
})();

HTTP.codeToString = function(code) {
    for (var x in HTTP)
        if (HTTP[x]==code)
            return x;
    return 'unknown';
}
