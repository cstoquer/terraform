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
	var ZOOM = 30;

	var ctx = createAndAppendCanvas(SIZE, SIZE).$ctx;
	ctx.$clear('#000');
	// var seed = ~(80000 * Math.random());

	var modulator1 = new Simplex2D({
		octaves:     6,
		amplitude:   0.9,
		frequency:   5.8,
		persistance: 0.4,
		base:        0,
		seed:        ~~(80000 * Math.random())
	});

	var modulator2 = new Simplex2D({
		octaves:     6,
		amplitude:   0.8,
		frequency:   3,
		persistance: 0.5,
		base:        0,
		seed:        ~~(80000 * Math.random())
	});

	var modulator3 = new Simplex2D({
		octaves:     6,
		amplitude:   0.9,
		frequency:   3,
		persistance: 0.5,
		base:        0,
		seed:        ~~(80000 * Math.random())
	});

	var modulatorB1 = new Simplex2D({
		octaves:     4,
		amplitude:   0.5,
		frequency:   0.02,
		persistance: 0.2,
		base:        0,
		seed:        ~~(80000 * Math.random())
	});

	var modulatorB2 = new Simplex2D({
		octaves:     2,
		amplitude:   2.5,
		frequency:   0.02,
		persistance: 0.2,
		base:        0,
		seed:        ~~(80000 * Math.random())
	});

	var modulatorB3 = new Simplex2D({
		octaves:     4,
		amplitude:   2.0,
		frequency:   0.05,
		persistance: 0.2,
		base:        0,
		seed:        ~~(80000 * Math.random())
	});

	var modulatorX = new Simplex2D({
		octaves:     3,
		amplitude:   0.4,
		frequency:   0.1,
		persistance: 0.4,
		base:        0,
		seed:        ~~(80000 * Math.random())
	});

	var modulatorY = new Simplex2D({
		octaves:     3,
		amplitude:   0.4,
		frequency:   0.1,
		persistance: 0.4,
		base:        0,
		seed:        ~~(80000 * Math.random())
	});

	var carrier = new Simplex2D({
		octaves:     6,
		amplitude:   1,
		frequency:   6,
		persistance: 0.3,
		base:        0,
		seed:        ~~(80000 * Math.random())
	});


	function map(value, iMin, iMax, oMin, oMax) {
		return oMin + (oMax - oMin) * (value - iMin) / (iMax - iMin);
	}

	// var diamond = diamondSquare();

	/*for (var x = 0; x < SIZE; x++) {
		for (var y = 0; y < SIZE; y++) {
			
			var value = carrier.get(x / SIZE, y / SIZE);
			// var value = 0.5 + diamond[x][y] / 256;

			var color = value < 0.5 ? 'rgb(10,60,' + ~~map(value, 0, 0.5, 30, 255) + ')' : 'rgb(' + ~~map(value, 0.5, 1, 40, 255) + ',0,0)';
			// var color = ~~(value * 255);
			ctx.$setFill(color);
			ctx.$fillRect(x, y, 1, 1);
		}
	}*/

	for (var x = 0; x < SIZE; x++) {
		for (var y = 0; y < SIZE; y++) {
			
			var mod1 = modulator1.get(0.13 * ZOOM * x / SIZE, 0.13 * ZOOM * y / SIZE);
			var mod2 = modulator2.get(0.41 * ZOOM * x / SIZE, 0.41 * ZOOM * y / SIZE);
			var mod3 = modulator3.get(0.25 * ZOOM * x / SIZE, 0.25 * ZOOM * y / SIZE);
			var modB1 = modulatorB1.get(465 + 0.05 * ZOOM * x / SIZE, 4576 + 0.05 * ZOOM * y / SIZE);
			var modB2 = modulatorB2.get(546 + 0.05 * ZOOM * x / SIZE, 9324 + 0.05 * ZOOM * y / SIZE);
			var modB3 = modulatorB3.get(2 + 0.05 * ZOOM * x / SIZE, 45 + 0.05 * ZOOM * y / SIZE);
			var modX = modulatorX.get(0.03 * ZOOM * x / SIZE, 0.03 * ZOOM * y / SIZE);
			var modY = modulatorY.get(2345 + 0.03 * ZOOM * x / SIZE, 345 + 0.03 * ZOOM * y / SIZE);
			carrier.persistance = mod1;
			carrier.frequency = 0.1 + mod2 * 2;
			carrier.amplitude = mod3;
			carrier.base = modB1 + modB2 - modB3;
			var value = carrier.get(modX * ZOOM * x / SIZE, modY * ZOOM * y / SIZE);

			var SEA_LEVEL = 0.5;

			var color = value < SEA_LEVEL ? 'rgb(10,20,' + ~~map(value, 0, SEA_LEVEL, 200, 255) + ')' : 'rgb(' + ~~map(value, SEA_LEVEL, 1.5, 40, 255) + ',0,0)';
			ctx.$setFill(color);
			ctx.$fillRect(x, y, 1, 1);
		}
	}


});

