var diamondSquare;

(function(){

/**▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
 * Construct a new 2D array
 *
 * @param {Number} w - width
 * @param {Number} h - height
 * @param {*}      v - value (can be a function)
 */
function table(w, h, v) {
	h = h || w;
	var t = [];
	for (var x = 0; x < w; x++) {
		var c = [];
		for (var y = 0; y < h; y++) {
			if (v && typeof v === 'function') c.push(v(x, y));
			else c.push(v);
		}
		t.push(c);
	}
	return t;
}

/**▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
 * Return a random integer in the range [-r .. r]
 */
function scrand(r) {
	r = r || 127;
	return ~~(2 * r * (Math.random() - 0.5));
}

/**▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
 */
function mpdIterate(base, base_n, r) {
	var n = (2 * base_n) - 1;
	var map = table(n, n, 0);

	// Resize
	// 1 0 1
	// 0 0 0
	// 1 0 1
	for (var i = 0; i < n; i += 2) {
		for (var j = !(i % 2 === 0); j < n; j += 2) {
			map[i][j] = base[~~(i / 2)][~~(j / 2)];
		}
	}

	// Diamond algorithm
	// 0 0 0
	// 0 X 0
	// 0 0 0
	for (var i = 1; i < n; i += 2) {
		for (var j = 1; j < n; j += 2) {
			var a = map[i - 1][j - 1];
			var b = map[i - 1][j + 1];
			var c = map[i + 1][j - 1];
			var d = map[i + 1][j + 1];
			// TODO: bound value
			map[i][j] = scrand(r) + (a + b + c + d) / 4;
		}
	}

	// Square algorithm
	// . b .
	// a # d
	// . c .
	for (var i = 0; i < n; i++) {
		for (var j = (i % 2 == 0); j < n; j += 2) {
			var map_ij = map[i][j];

			// get surrounding values
			var a = 0;
			var b = 0;
			var c = 0;
			var d = 0;

			if (i > 0)     a = map[i - 1][j];
			if (j > 0)     b = map[i][j - 1];
			if (j + 1 < n) c = map[i][j + 1];
			if (i + 1 < n) d = map[i + 1][j];

			// average calculation
			if (i == 0) map_ij = (b + c + d) / 3;
			else if (j == 0) map_ij = (a + c + d) / 3;
			else if (j + 1 == n) map_ij = (a + b + d) / 3;
			else if (i + 1 == n) map_ij = (a + b + c) / 3;
			else map_ij = (a + b + c + d) / 4;

			// TODO: bound value
			map_ij += scrand(r);
			map[i][j] = map_ij;
		}
	}

	return map;
}

/**▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
 */
diamondSquare = function () {
	var n = 512;
	var heightMap = table(n, n, function (x, y) {
		return scrand();
	});

	for (var i = 1; i < 6; i++) heightMap = mpdIterate(heightMap, n, ~~(64 / i));
	return heightMap;
}

})();