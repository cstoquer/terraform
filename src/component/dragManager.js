var dragManager = {};

(function(){
var body = document.getElementsByTagName("body")[0];
var dragElem = document.createElement('div');
dragElem.style.width  = '500px';
dragElem.style.height = '500px';
var current = null;

function onMouseMove(e) {
	var x = e.clientX;
	var y = e.clientY;

	var transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
	current.$dom.style.webkitTransform = transform;
	current.$dom.style.transform       = transform;
	// console.log(e);
}


dragManager.drag = function (obj) {
	current = obj;
	// TODO: update dragDisplay to obj size
	dragElem.style.display = ''; // show
	body.addEventListener('mousemove', onMouseMove);
};


dragManager.drop = function () {
	body.removeEventListener('mousemove', onMouseMove);
	dragElem.style.display = 'none'; // hide
	current = null;
};

})()
