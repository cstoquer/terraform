

/**▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
 * @classdesc Seeds and create a random number generator
 * @constructor
 *
 * @author Brice Chevalier
 *
 * @param {number} seed
 */
RandomNumberGenerator = function (seed) {
	var s = seed;

	this.next = function () {
		var hi = s / 44488.07041494893;
		var lo = s % 44488.07041494893;
		s = 48271 * lo - 3399 * hi;
		if (s < 0) {
			s = s + 2147483647;
		}
		return (s / 2147483647);
	};
};