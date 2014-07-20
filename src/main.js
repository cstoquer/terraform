#INCLUDE(loading)
#INCLUDE(canvasHelper)

preloadAssets(function (error, assets) {
	if (error) return console.error(error);

	var ctx = createAndAppendCanvas(400, 400).$ctx;
	ctx.$clear('#000');

});

