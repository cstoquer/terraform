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
	var ZOOM = 60;

	var ctx = createAndAppendCanvas(SIZE, SIZE).$ctx;
	ctx.$clear('#000');
	// var seed = ~(80000 * Math.random());

	function getRandomSeed() {
		return ~~(80000 * Math.random());
	}

	var modulator1 = new Simplex2D({
		octaves:     6,
		amplitude:   0.9,
		frequency:   5.8,
		persistance: 0.4,
		base:        0,
		scale:       0.19 * ZOOM / SIZE,
		seed:        getRandomSeed()
	});

	var modulator2 = new Simplex2D({
		octaves:     6,
		amplitude:   0.8,
		frequency:   3,
		persistance: 0.5,
		base:        0,
		scale:       0.41 * ZOOM / SIZE,
		seed:        getRandomSeed()
	});

	var modulator3 = new Simplex2D({
		octaves:     6,
		amplitude:   0.9,
		frequency:   3,
		persistance: 0.5,
		base:        0,
		scale:       0.25 * ZOOM / SIZE,
		seed:        getRandomSeed()
	});

	var modulatorB1 = new Simplex2D({
		octaves:     4,
		amplitude:   0.5,
		frequency:   0.02,
		persistance: 0.2,
		base:        0,
		scale:       0.05 * ZOOM / SIZE,
		offsetX:     46.5,
		offsetY:     7.6,
		seed:        getRandomSeed()
	});

	var modulatorB2 = new Simplex2D({
		octaves:     2,
		amplitude:   2.5,
		frequency:   0.02,
		persistance: 0.2,
		base:        0,
		scale:       0.05 * ZOOM / SIZE,
		offsetX:     2.1,
		offsetY:     49.1,
		seed:        getRandomSeed()
	});

	var modulatorB3 = new Simplex2D({
		octaves:     4,
		amplitude:   2.0,
		frequency:   0.05,
		persistance: 0.2,
		base:        0,
		scale:       0.05 * ZOOM / SIZE,
		offsetX:     0.0,
		offsetY:     14.0,
		seed:        getRandomSeed()
	});

	var modulatorX = new Simplex2D({
		octaves:     3,
		amplitude:   0.4,
		frequency:   0.1,
		persistance: 0.4,
		base:        0,
		scale:       0.03 * ZOOM / SIZE,
		seed:        getRandomSeed()
	});

	var modulatorY = new Simplex2D({
		octaves:     3,
		amplitude:   0.4,
		frequency:   0.1,
		persistance: 0.4,
		base:        0,
		scale:       0.03 * ZOOM / SIZE,
		offsetX:     154.0,
		offsetY:     39.7,
		seed:        getRandomSeed()
	});

	var carrier = new Simplex2D({
		octaves:     6,
		amplitude:   1,
		frequency:   6,
		persistance: 0.3,
		base:        0,
		seed:        getRandomSeed()
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
			
			var mod1 = modulator1.get(x, y);
			var mod2 = modulator2.get(x, y);
			var mod3 = modulator3.get(x, y);
			var modB1 = modulatorB1.get(x, y);
			var modB2 = modulatorB2.get(x, y);
			var modB3 = modulatorB3.get(x, y);
			var modX = modulatorX.get(x, y);
			var modY = modulatorY.get(x, y);
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

