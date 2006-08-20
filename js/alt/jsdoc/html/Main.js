
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
        'module-frame.html':    'alt.jsdoc.html.ModuleFrame',
        'module-summary.html':  'alt.jsdoc.html.ModuleSummary'
    });
    var currentClass = dictator.path.next;
    currentClass = currentClass.substring(0,currentClass.lastIndexOf('.'));
    Alt.log('currentclass = '+currentClass);
    
    if (currentClass && inspector.modules[currentModule][currentClass]) {
        dictator.path.pop();
        dictator.map({
            '': 'alt.jsdoc.html.Class'
        });
    }
}

