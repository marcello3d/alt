
Alt.require('alt.resource.Loader', true);

function Image(resource) {
	return Packages.javax.imageio.ImageIO.read(resource.stream);
}

for each (var format in Packages.javax.imageio.ImageIO.readerFormatNames)
	Loader.defineType(Image, format);
