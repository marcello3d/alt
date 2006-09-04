

function Response(dictator) {
    this.dictator = dictator;
    this.echo = true;
    this.outputBytes = 0;
    return new alt.util.ScriptableBean(this);
}

Response.prototype.getWriter = function() {
    return this.dictator.response.getWriter();
}
Response.prototype.getOutputStream = function() {
    return this.dictator.response.getOutputStream();
}
    
Response.prototype.finish = function() {
    this.flush();
}
Response.prototype.write = function(o) {
    var string = o;
    if (o instanceof String)
        ;
    else if (o.toString)
        string = o.toString();
    else
        string = String(o);
        
    this.outputBytes += string.length;
           
    if (this.echo)
        this.dictator.response.writer.print(string);  
}
Response.prototype.writeln = function(o) {
    this.write(o);
    this.write('\n');
}
Response.prototype.flush = function() {
    this.dictator.response.flushBuffer();
}
