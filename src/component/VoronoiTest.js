#INCLUDE(canvasHelper)
#INCLUDE(Voronoi)

var VoronoiTest;

(function(){

var voronoi = true;
var delaunay = true;
var canv = null;
var colors = [];
var c, v, h, w;
var points = [];


VoronoiTest = function main(width, height) {
	canv = createAndAppendCanvas(width, height);
	canv.onmousemove = onMove;
	canv.onclick = onClick;
	c = canv.getContext("2d");
	w = canv.width;
	h = canv.height;
	v = new Voronoi();
	
	for (i = 0; i < 1; i++) {
		points.push(new Point(Math.random() * w, Math.random() * h));
		colors.push(rndCol());
	}
		
	redraw();
}


function mouseX(e){	return e.clientX - e.target.offsetLeft;}
function mouseY(e){	return e.clientY - e.target.offsetTop; }

function onMove(e) {
	var last = points[points.length - 1];
	last.x = mouseX(e);
	last.y = mouseY(e);
	redraw();
}

function onClick(e) {
	var last = points[points.length - 1];
	last.x += Math.random();
	last.y += Math.random();
	points.push( new Point(mouseX(e), mouseY(e)));
	colors.push(rndCol());
	console.log(v.cells);
}


function redraw() {
	c.fillStyle = "#ffffff";
	c.fillRect (0, 0, w, h);
	
	v.Compute(points, w, h);
	edges = v.edges;
	cells = v.cells;
	
	// c.save();
	// c.scale(0.25, 0.25);
	// c.translate(w/2, h/2);
	
	for (var i = 0; i < cells.length; i++) {
		var p = sortVertex(cells[i].vertices);
		// var p = cells[i].vertices;
		if (p.length === 0) continue;
		if (p.length < 3) continue;
		
		c.fillStyle = colors[i];
		c.beginPath();
		c.moveTo(p[0].x, p[0].y);
		// TODO: we need to reorder edges correctly
		for (var j = 1; j < p.length; j++) c.lineTo(p[j].x, p[j].y);
		c.closePath();
		c.fill();
	}
	
	if (voronoi) {
		c.lineWidth = 2;
		c.strokeStyle = "#000";
		for (i = 0; i < edges.length; i++) {
			var e = edges[i];
			c.beginPath();
			c.moveTo(e.start.x, e.start.y);
			c.lineTo(e.end.x, e.end.y);
			c.closePath();
			c.stroke();
		}
	}

	if (delaunay) {
		c.lineWidth = 1;
		c.strokeStyle = "#AAA";
		for(i = 0; i < edges.length; i++) {
			var e = edges[i];
			c.beginPath();
			c.moveTo(e.left.x, e.left.y);
			c.lineTo(e.right.x, e.right.y);
			c.closePath();
			c.stroke();
		}
	}
	
	c.fillStyle = "rgb(0,0,0)";
	for (i = 0; i < points.length; i++) {
		if (i === points.length - 1) c.fillStyle = "rgb(0,100,255)";
		var p = points[i];
		c.beginPath();
		c.arc(p.x, p.y, 3, 0, Math.PI*2, true);
		c.closePath();
		c.fill();
	}

	// c.restore();
}

function rndCol() {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++ ) {
		color += letters[Math.round(Math.random() * 15)];
	}
	return color;
}

})();

