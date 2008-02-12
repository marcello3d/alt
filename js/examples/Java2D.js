
// Some helpful aliases
//
// It would be nice to wrap these up in some JavaScript library for Alt
//  
var BufferedImage = java.awt.image.BufferedImage;
var Color = java.awt.Color;
var Line = java.awt.geom.Line2D.Double;
var Font = java.awt.Font;
var ImageIO = Packages.javax.imageio.ImageIO;
var RenderingHints = java.awt.RenderingHints;
var Rectangle = java.awt.geom.Rectangle2D.Double;
var BasicStroke = java.awt.BasicStroke;

// Make new image
var img = new BufferedImage(200,200,BufferedImage.TYPE_INT_RGB);

// Get graphics
var g = img.graphics;

// Enable antialiasing
g.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
					RenderingHints.VALUE_ANTIALIAS_ON);

// Draw background
g.color = new Color(0xE0E0FF);
g.fill(new Rectangle(0,0,img.width,img.height));

// Draw a few strokes
g.stroke = new BasicStroke(20);
g.color = Color.BLACK;
g.draw(new Line(30,30,170,170));
g.color = new Color(0x8080A0);
g.draw(new Line(35,30,175,170));

// Set font
g.font = new Font("Verdana",Font.PLAIN,30);

// Draw some text
g.color = Color.BLACK;
g.drawString("la la la!", 8, 190);
g.color = new Color(0x8080A0);
g.drawString("la la la!", 9, 191);

// Draw some more text
g.color = Color.BLACK;

g.font = new Font("Verdana",Font.PLAIN,10);
g.drawString("homg ip! "+request.remoteAddr, 50, 20);
g.drawString("homg host? "+request.remoteHost, 50, 30);

// Set response information
response.contentType = 'image/png';

// Write image out to user
ImageIO.write(img, "png", response.outputStream);
