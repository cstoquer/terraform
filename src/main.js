#INCLUDE(loading)
#INCLUDE(canvasHelper)
#INCLUDE(Simplex2D)

preloadAssets(function (error, assets) {
	if (error) return console.error(error);

	var ctx = createAndAppendCanvas(400, 400).$ctx;
	ctx.$clear('#000');
	var perlin = new Simplex2D({
		octaves:     2,
		amplitude:   1,
		frequency:   8,
		persistance: 0.7,
		base:        0
	});

	var seed = ~(80000 * Math.random());
	perlin.seed(seed);

	// var log = {};
	for (var x = 0; x < 400; x++) {
		for (var y = 0; y < 400; y++) {
			var value = perlin.get(x / 400, y / 400);
			// log[value.toFixed(2)] = true;
			var color = ~~(value * 255);
			ctx.$setFill('rgb(' + color + ',0,0)');
			ctx.$fillRect(x, y, 1, 1);
		}
	}
	// console.log(Object.keys(log).sort(function (a, b) { return parseFloat(a) - parseFloat(b) }))


});

