
Alt.require('alt.jsdoc.Inspector');

/*
if (!alt.jsdoc.html.inspector || request.getParameter('reload'))
    alt.jsdoc.html.inspector = new alt.jsdoc.Inspector(global);
else
    alt.jsdoc.html.inspector.reinspect();
    */

var inspector = new alt.jsdoc.Inspector(global);

dictator.map({
   '':                      'alt.jsdoc.html.Index',
   'index.html':            'alt.jsdoc.html.Index',
   'overview-frame.html':   'alt.jsdoc.html.OverviewFrame',
   'overview-summary.html': 'alt.jsdoc.html.OverviewSummary',
   'allclasses-frame.html': 'alt.jsdoc.html.AllClassesFrame',
   'style.css':             'alt.jsdoc.html.Style'
});

if (inspector.modules[dictator.path.next]) {
    
    var currentModule = dictator.path.next;
    dictator.path.pop();
    
    dictator.map({
        '': 'alt.jsdoc.html.ModuleFrame',
        'module-frame.html': 'alt.jsdoc.html.ModuleFrame'
    });
   
    if (inspector.modules[currentModule][dictator.path.next]) {
        var currentClass = dictator.path.next;
        dictator.path.pop();
        
    }
}

