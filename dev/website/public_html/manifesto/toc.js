var level = [];
var levelCount = [];
$each($$('h2,h3,h4,h5,h6'),function(item) {
	var depth = parseInt(item.get('tag').charAt(1))-1;
	while (level.length < depth) {
		var list = new Element('ol');
		if (level.length) {
			list.inject(level[level.length-1]);
		}
		level.push(list);
		levelCount.push(0);
	}
	level.length = depth;
	levelCount.length = depth;
	
	levelCount[levelCount.length-1]++;
	
	var currentLevel = levelCount.join('.');
	
	var li = new Element('li');
	new Element('a',{
	  href: '#'+currentLevel,
	  text: item.get('text')
	}).inject(li);
	
	new Element('a',{name:currentLevel}).inject(item,'top');
	
	li.inject(level[level.length-1]);
});
level[0].inject($('toc'),'top');
