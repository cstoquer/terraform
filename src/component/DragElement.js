#INCLUDE(DragManager)


function DragElement(tag, params) {
	this.$dom = null;
	return this._init(tag, params);
};


(function(){
var proto = DragElement.prototype;
var body = document.getElementsByTagName("body")[0];

proto._init = function (tag, params) {
	this.$dom = document.createElement(tag);
	return this.$dom;
};


proto.drag = function () {
	DragManager.drag(this);
};


})()