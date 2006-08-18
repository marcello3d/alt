
Alt.require('alt.jsdoc.Inspector');

if (!inspector)
    alt.jsdoc.html.inspector = new alt.jsdoc.Inspector(global);
else
    inspector.reinspect();

dictator.map({
   '':                      'alt.jsdoc.html.Index',
   'index.html':            'alt.jsdoc.html.Index',
   'overview-frame.html':   'alt.jsdoc.html.OverviewFrame',
   'overview-summary.html': 'alt.jsdoc.html.OverviewSummary',
   'allclasses-frame.html': 'alt.jsdoc.html.AllClassesFrame',
});
