#INCLUDE(Point)

var Voronoi;
var sortVertex;

(function(){

//█████████████████████████████████████████
//█▄░▄██▄░▄█▄░▄▄▄░██████▄░█████████████████
//██▄▀██▀▄███░▀░████▀▄▄▄▀░██▀▄▄▄▀░▄█▀▄▄▄▄▀█
//███░██░████░█▄████░████░██░████░██░▄▄▄▄▄█
//████░░████▀░▀▀▀░██▄▀▀▀▄░▀█▄▀▀▀▄░██▄▀▀▀▀▀█
//███████████████████████████▀▀▀▀▄█████████
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function VEdge(start, left, right) {
	this.left  = left;  // point on left
	this.right = right; // point on right
	this.start = start; // start point
	this.end   = null;  // end point
	
	var x  = right.x - left.x;
	var y  = left.y  - right.y;

	this.f = x / y;
	this.g = start.y - this.f * start.x;
	this.direction = new Point(-y, -x);
	this.B = new Point(start.x + this.direction.x, start.y + this.direction.y);	// second point of line
	
	this.neighbour = null;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function getLineIntersection(a1, a2, b1, b2) {			
	var dax = (a1.x - a2.x), dbx = (b1.x - b2.x);
	var day = (a1.y - a2.y), dby = (b1.y - b2.y);
			
	var den = dax * dby - day * dbx;
	if (den === 0) return null;	// parallel

	var a = (a1.x * a2.y - a1.y * a2.x);
	var b = (b1.x * b2.y - b1.y * b2.x);
	
	var x = (a * dbx - dax * b) / den;
	var y = (a * dby - day * b) / den;
	return new Point(x, y);
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function getEdgeIntersection(a, b) {
	var intersection = getLineIntersection(a.start, a.B, b.start, b.B);
	
	// wrong direction of edge
	var w = (intersection.x - a.start.x) * a.direction.x < 0
		||  (intersection.y - a.start.y) * a.direction.y < 0	
		||  (intersection.x - b.start.x) * b.direction.x < 0
		||  (intersection.y - b.start.y) * b.direction.y < 0;	
			 
	if (w) return null;
	return intersection;
}


//█████████████████████████████████████████████████████████████████████████
//█▄░▄██▄░▄█▄░▄▄▄▀█████████████████████████▄░█████████████████▄░███████████
//██▄▀██▀▄███░███░██▀▄▄▄▄▀██▄░▀▄▄▄██▀▄▄▄▄▀██░▀▄▄▄▀██▀▄▄▄▄▀█████░████▀▄▄▄▄▀█
//███░██░████░▄▄▄███▀▄▄▄▄░███░██████▀▄▄▄▄░██░████░██░████░█████░████▀▄▄▄▄░█
//████░░████▀░▀█████▄▀▀▀▄░▀█▀░▀▀▀███▄▀▀▀▄░▀▀░▄▀▀▀▄██▄▀▀▀▀▄███▀▀░▀▀██▄▀▀▀▄░▀
//█████████████████████████████████████████████████████████████████████████
/**▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
 * Implement a parabola, piece of the Fortune's algorithm's beach line
 *
 * @param {Point} site
 */
function VParabola(site) {
	this.cEvent = null; // VEvent
	this.parent = null; // VParabola
	this._left  = null; // VParabola
	this._right = null; // VParabola
	this.site   = site; // Point
	this.isLeaf = site ? true : false;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// TODO: this overwrite the prototype, we want to merge setter and getter
//       with the current prototype
VParabola.prototype = {
	get left() {
		return this._left;
	},
	get right() {
		return this._right;
	},
	set left(parabola) {
		this._left = parabola;
		parabola.parent = this;
	},
	set right(parabola) {
		this._right = parabola;
		parabola.parent = this;
	}
};


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function getLeftParent(n) {
	var parent = n.parent;
	var pLast = n;
	while (parent.left === pLast) { 
		if (!parent.parent) return null;
		pLast  = parent;
		parent = parent.parent; 
	}
	return parent;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function getRightParent(n) {
	var parent = n.parent;
	var pLast = n;
	while (parent.right === pLast) {	
		if (!parent.parent) return null;
		pLast = parent;
		parent = parent.parent;	
	}
	return parent;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function getLeftChild(n) {
	if (!n) return null;
	var par = n.left;
	while (!par.isLeaf) par = par.right;
	return par;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function getRightChild(n) {
	if (!n) return null;
	var par = n.right;
	while (!par.isLeaf) par = par.left;
	return par;
};

//█████████████████████████████████████████████████████████████████
//█▄░▄██▄░▄█▄░▄▄▄▀████████████▄░███████████████████████████████████
//██▄▀██▀▄███░███░██▀▄▄▄▄▀█████░████▄░▄█▄░▄█▀▄▄▄▀░▄█▀▄▄▄▄▀██▄░▀▄▄▀█
//███░██░████░▄▄▄███░████░█████░█████▄▀█▀▄██░████░██░████░███░███░█
//████░░████▀░▀█████▄▀▀▀▀▄███▀▀░▀▀████▄▀▄███▄▀▀▀▄░██▄▀▀▀▀▄██▀░▀█▀░▀
//███████████████████████████████████▀▀░█████▀▀▀▀▄█████████████████
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// counter clock wise
// (-1,1), (1,1), (1,-1), (-1,-1)

function VPolygon() {
	this.size     = 0;
	this.vertices = [];
	this.first    = null;
	this.last     = null;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
VPolygon.prototype.addRight = function (p) {
	this.vertices.push(p);
	this.size++;
	this.last = p;
	if (this.size === 1) this.first = p;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
VPolygon.prototype.addLeft  = function (p) {
	var vs = this.vertices;
	this.vertices = [p];
	for (var i = 0; i < vs.length; i++) this.vertices.push(vs[i]);
		
	this.size++;
	this.first = p;
	if (this.size === 1) this.last = p;
};


//█████████████████████████████████████████████████
//█▄░▄██▄░▄█▄░▄▄▄░███████████████████████████▀█████
//██▄▀██▀▄███░▀░███▄░▄██▄░▄█▀▄▄▄▄▀██▄░▀▄▄▀██▄░▄▄▄██
//███░██░████░█▄█████░██░███░▄▄▄▄▄███░███░███░█████
//████░░████▀░▀▀▀░████░░████▄▀▀▀▀▀██▀░▀█▀░▀██▄▀▀▀▄█
//█████████████████████████████████████████████████
/**▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
 * @class VEvent
 * @desc  ...
 *
 * @param {Point}   point
 * @param {Boolean} pe
 */
function VEvent(point, pe) {
	this.point = point;   // Point
	this.pe    = pe;      // Boolean
	this.y     = point.y; // Number
	this.arch  = null;    // VParabola
}

//█████████████████████████████████████████████████
//█▄░▄██▄░▄██▀▄▄▄▀█████████████████████████████████
//██▄▀██▀▄██░█████░█▄░██▄░██▀▄▄▄▄▀██▄░██▄░██▀▄▄▄▄▀█
//███░██░███░█████░██░███░██░▄▄▄▄▄███░███░██░▄▄▄▄▄█
//████░░█████▄▀▀▀▄███▄▀▀▄░▀█▄▀▀▀▀▀███▄▀▀▄░▀█▄▀▀▀▀▀█
//████████████▄▄▄▄▄████████████████████████████████
/**▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
 * @class VEvent Queue
 * @desc  implement a priority List of vertice. priority is defined by 
 *        vertices y coordinate
 *
 * @TODO: reimplement this using a priority queue (to get better complexity)
 */
function VQueue() {
	this.queue = new Array();
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Add a new Vertice in the list */
VQueue.prototype.enqueue = function(vEvent) {
	this.queue.push(vEvent);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Remove and return Vertice with the greatest y */
VQueue.prototype.dequeue = function () {
	if (this.queue.length === 0) throw new Error("Cannot dequeue empty VQueue.");
	this.queue.sort(function (a, b) {
		return a.y - b.y;
	});
	return this.queue.pop();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Remove a Vertice */
VQueue.prototype.remove = function (vEvent) {
	var index = this.queue.indexOf(vEvent);
	if (index === -1) throw new Error("Cannot remove element from VQueue: element do not exist.");
	this.queue.splice(index, 1);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** empty test */
VQueue.prototype.isEmpty = function () {
	return (this.queue.length === 0);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** clear queue */
VQueue.prototype.clear = function () {
	this.queue = [];
};


//█████████████████████████████████████████████████████████
//█▄░▄██▄░▄████████████████████████████████████████████▄███
//██▄▀██▀▄██▀▄▄▄▄▀██▄░▀▄▄▄██▀▄▄▄▄▀██▄░▀▄▄▀██▀▄▄▄▄▀███▄▄░███
//███░██░███░████░███░██████░████░███░███░██░████░█████░███
//████░░████▄▀▀▀▀▄██▀░▀▀▀███▄▀▀▀▀▄██▀░▀█▀░▀█▄▀▀▀▀▄███▀▀░▀▀█
//█████████████████████████████████████████████████████████
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Voronoi = function Voronoi() {
	this.queue  = new VQueue;  // VQueue
	this.root   = null;        // VParabola
	this.places = null;        // Point[]
	this.edges  = null;        // VEdge[]
	this.cells  = null;        // VPolygon[]
	this.fp     = null;        // Point

	this.width  = 0;
	this.height = 0;
	this.ly     = 0;
	this.lasty  = 0;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Voronoi.prototype.Compute = function(points, width, height) {
	if (points.length < 2) return [];

	this.root   = null;
	this.places = points;
	this.edges  = [];
	this.cells  = [];
	this.width  = width;
	this.height = height;
	
	this.queue.clear();
	
	for (i = 0; i < this.places.length; i++) {
		var ev   = new VEvent(this.places[i], true);
		var cell = new VPolygon();
		this.places[i].cell = cell;
		this.queue.enqueue(ev);
		this.cells.push(cell);
	}
	
	// var lasty = Number.MAX_VALUE;
	// var num = 0;
	while (!this.queue.isEmpty()) {
		var e = this.queue.dequeue();  
		this.ly = e.point.y;
		if (e.pe) this.insertParabola(e.point);
		else this.removeParabola(e);
		
		this.lasty = e.y;
	}
	this.finishEdge(this.root);
	
	for (i = 0; i < this.edges.length; i++)
		if(this.edges[i].neighbour) this.edges[i].start = this.edges[i].neighbour.end;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Voronoi.prototype.getEdges = function() {
	return this.edges;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Voronoi.prototype.getCells = function() {
	return this.cells;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
		
Voronoi.prototype.insertParabola = function (point) {
	if (!this.root) {
		this.root = new VParabola(point);
		this.fp = point;
		return;
	}
	
	// TODO: magic number: 0.01
	if (this.root.isLeaf && this.root.site.y - point.y < 0.01) {
		this.root.isLeaf = false;
		this.root.left  = new VParabola(this.fp);
		this.root.right = new VParabola(point);
		var s = new Point((point.x + this.fp.x) / 2, this.height);
		if (point.x > this.fp.x) this.root.edge = new VEdge(s, this.fp, p);
		else                     this.root.edge = new VEdge(s, p, this.fp);
		this.edges.push(this.root.edge);
		return;
	}
	
	var parabola = this.getParabolaByX(point.x);
	
	if (parabola.cEvent) {
		this.queue.remove(parabola.cEvent);
		parabola.cEvent = null;
	}

	var start = new Point(point.x, this.getY(parabola.site, point.x));
	
	var edgeLeft  = new VEdge(start, parabola.site, point);
	var edgeRight = new VEdge(start, point, parabola.site);
	
	edgeLeft.neighbour = edgeRight;
	this.edges.push(edgeLeft);
	
	parabola.edge = edgeRight;
	parabola.isLeaf = false;
	
	var parab0 = new VParabola(parabola.site);
	var parab1 = new VParabola(point);
	var parab2 = new VParabola(parabola.site);
	
	parabola.right = parab2;
	parabola.left  = new VParabola();
	parabola.left.edge = edgeLeft;

	parabola.left.left  = parab0;
	parabola.left.right = parab1;
	
	this.checkCircle(parab0);
	this.checkCircle(parab2);
}
		
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Voronoi.prototype.removeParabola = function (e) {						
	var p1 = e.arch;
	
	var xl = getLeftParent(p1);
	var xr = getRightParent(p1);
		
	var p0 = getLeftChild(xl);
	var p2 = getRightChild(xr);
	
	if (p0.cEvent) {this.queue.remove(p0.cEvent); p0.cEvent = null;}
	if (p2.cEvent) {this.queue.remove(p2.cEvent); p2.cEvent = null;}

	var p = new Point(e.point.x, this.getY(p1.site, e.point.x));
	
	if (p0.site.cell.last === p1.site.cell.first ) p1.site.cell.addLeft(p);
	else p1.site.cell.addRight(p);
	
	p0.site.cell.addRight(p);
	p2.site.cell.addLeft(p);
	
	this.lasty = e.point.y;
		
	xl.edge.end = p;
	xr.edge.end = p;
	
	var higher;
	var par = p1;
	while (par !== this.root) {
		par = par.parent;
		if (par === xl) higher = xl;
		if (par === xr) higher = xr;
	}
	
	higher.edge = new VEdge(p, p0.site, p2.site);

	this.edges.push(higher.edge);
	
	var gparent = p1.parent.parent;
	if (p1.parent.left === p1) {
		if (gparent.left  === p1.parent) gparent.left  = p1.parent.right;
		else p1.parent.parent.right = p1.parent.right;
	}
	else {
		if (gparent.left  === p1.parent) gparent.left  = p1.parent.left;
		else gparent.right = p1.parent.left;
	}
	
	this.checkCircle(p0);
	this.checkCircle(p2)
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Voronoi.prototype.finishEdge = function (n) {
	var mx;
	if (n.edge.direction.x > 0.0) {
		mx = Math.max(this.width, n.edge.start.x + 10);
	} else {
		mx = Math.min(0.0, n.edge.start.x - 10);
	}
	n.edge.end = new Point(mx, n.edge.f * mx + n.edge.g);
	
	if (!n.left.isLeaf)  this.finishEdge(n.left);
	if (!n.right.isLeaf) this.finishEdge(n.right);
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Voronoi.prototype.getXOfEdge = function (par, y) {
	var left =	getLeftChild (par);
	var right =	getRightChild(par);
			
	var p = left.site;
	var r = right.site;
	
	var dp = 2 * (p.y - y);
	var a1 = 1 / dp;
	var b1 = -2 * p.x / dp;
	var c1 = y + dp * 0.25 + p.x * p.x / dp;
	
	dp = 2 * (r.y - y);
	var a2 = 1 / dp;
	var b2 = -2 * r.x / dp;
	var c2 = y + dp * 0.25 + r.x * r.x / dp;
	
	var a = a1 - a2;
	var b = b1 - b2;
	var c = c1 - c2;
	
	var disc = b * b - 4 * a * c;
	var x1 = (-b + Math.sqrt(disc)) / (2 * a);
	var x2 = (-b - Math.sqrt(disc)) / (2 * a);

	var ry;
	if (p.y < r.y) ry = Math.max(x1, x2);
	else           ry = Math.min(x1, x2);
	
	return ry;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Voronoi.prototype.getParabolaByX = function (xx) {
	var parabola = this.root;
	var x = 0;
	while (!parabola.isLeaf) {
		x = this.getXOfEdge(parabola, this.ly);
		if (x > xx) parabola = parabola.left;
		else        parabola = parabola.right;				
	}
	return parabola;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Voronoi.prototype.getY = function (point, x) {
	var dp = 2 * (point.y - this.ly);
	var b1 = -2 * point.x / dp;
	var c1 = this.ly + dp / 4 + point.x * point.x / dp;
	return x * x / dp + b1 * x + c1;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Voronoi.prototype.checkCircle = function (b) {
	var lp = getLeftParent(b);
	var rp = getRightParent(b);
	
	var leftChild  = getLeftChild(lp);
	var rightChild = getRightChild(rp);
	
	if (!leftChild || !rightChild || leftChild.site === rightChild.site) return;
	
	var intersection = getEdgeIntersection(lp.edge, rp.edge);
	if (!intersection) return;
	
	var distance = intersection.distance(leftChild.site);
	//if(distance > 5000) return;
	if (intersection.y - distance >= this.ly) return;
	
	var e = new VEvent(new Point(intersection.x, intersection.y - distance), false);
	
	b.cEvent = e;
	e.arch = b;
	this.queue.enqueue(e);
};


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function centroid(points) {
	var x = 0;
	var y = 0;
	var len = points.length;
	for (var i = 0; i < len; i++) {
		x += points[i].x;
		y += points[i].y;
	}
	x /= len;
	y /= len;
	return new Point(x, y);
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
sortVertex = function sortVertex(points) {
	var p = [];
	var c = centroid(points);

	for (var i = 0; i < points.length; i++) {
		var point = points[i];
		var x = point.x - c.x;
		var y = point.y - c.y;
		point._angle = Math.atan2(y, x);
		p.push(point)
	}

	p.sort(function (a, b) {
		return a._angle - b._angle;
	});

	return p;
}


})();