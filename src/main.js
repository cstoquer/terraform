#INCLUDE(loading)
#INCLUDE(canvasHelper)
#INCLUDE(Simplex2D)
#INCLUDE(diamondSquare)

#INCLUDE(VoronoiTest)

preloadAssets(function (error, assets) {
	if (error) return console.error(error);

	// VoronoiTest(800, 600);
	// return;


	var SIZE = 512;

	var ctx = createAndAppendCanvas(SIZE, SIZE).$ctx;
	ctx.$clear('#000');
	var seed = ~(80000 * Math.random());
	var perlin = new Simplex2D({
		octaves:     6,
		amplitude:   1,
		frequency:   6,
		persistance: 0.3,
		base:        0,
		seed:        seed
	});


	function map(value, iMin, iMax, oMin, oMax) {
		return oMin + (oMax - oMin) * (value - iMin) / (iMax - iMin);
	}

	var diamond = diamondSquare();

	// var log = {};
	for (var x = 0; x < SIZE; x++) {
		for (var y = 0; y < SIZE; y++) {
			
			var value = perlin.get(x / SIZE, y / SIZE);
			// var value = 0.5 + diamond[x][y] / 256;

			// log[value.toFixed(2)] = true;
			var color = value < 0.5 ? 'rgb(10,60,' + ~~map(value, 0, 0.5, 30, 255) + ')' : 'rgb(' + ~~map(value, 0.5, 1, 40, 255) + ',0,0)';
			// var color = ~~(value * 255);
			ctx.$setFill(color);
			ctx.$fillRect(x, y, 1, 1);
		}
	}
	// console.log(Object.keys(log).sort(function (a, b) { return parseFloat(a) - parseFloat(b) }))


});

