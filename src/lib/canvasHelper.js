//██████████████████████████████████████████████████████████████████████████████
//███████████████████████████████████████████▄ ▄█▄ ▄██████▄ ████████████████████
//█▀▄▄▀ █▀▄▄▄▀██▄ ▀▄▄▀█▄ ▄█▄ ▄▀▄▄▄▀██▀▄▄▄ ████ ▀▀▀ █▀▄▄▄▀██ █▄ ▀▄▄▀█▀▄▄▄▀█▄ ▀▄▄█
//█ █████▀▄▄▄ ███ ███ ███ █ ██▀▄▄▄ ███▄▄▄▀████ ███ █ ▄▄▄▄██ ██ ███ █ ▄▄▄▄██ ████
//█▄▀▀▀▄█▄▀▀▄ ▀█▀ ▀█▀ ▀███ ███▄▀▀▄ ▀█ ▀▀▀▄███▀ ▀█▀ ▀▄▀▀▀▀█▀ ▀█ ▀▀▀▄█▄▀▀▀▀█▀ ▀▀██
//███████████████████████████████████████████████████████████▀ ▀████████████████
/**
 * @module canvasHelper
 * @desc Canvas helper / minimizer functions
 *
 * @version 0.0.4
 *
 * @author Cedric Stoquer
 */

function $getContext2d(canvas) {
	return canvas.getContext("2d");
}

function $createCanvas(w, h) {
	var canvas = document.createElement("canvas");
	canvas["width"]  = w;
	canvas["height"] = h;
	canvas.$ctx = $getContext2d(canvas);
	return canvas;
}

function createAndAppendCanvas(width, height, zIndex) {
	var body = document.getElementsByTagName("body")[0];
	var canvas = $createCanvas(width, height);
	body.appendChild(canvas);
	var style = canvas["style"];
	style["width"]  = width  + "px";
	style["height"] = height + "px";
	if (zIndex) style["zIndex"] = zIndex;
	return canvas;
}

(function () {var proto = window.CanvasRenderingContext2D.prototype;

proto.$setAlpha = function (alpha) {
	this.globalAlpha = alpha; // TODO: obfuscate propertie name ?
};
proto.$setBlend = function (mode) {
	this.globalCompositeOperation = mode; // TODO: obfuscate propertie name ?
};
proto.$setFill = function (style) {
	this.fillStyle = style; // TODO: obfuscate propertie name ?
};
proto.$setStroke = function (style) {
	this.strokeStyle = style; // TODO: obfuscate propertie name ?
};

proto.$clear = function (color) {
	var t = this;
	var c = t["canvas"];
	t.$save();
	t.$resetTransform();
	if (color) {
		t.$setFill(color);
		t.$fillRect(0, 0, c.width, c.height);
	} else {
		t.$clearRect(0, 0, c.width, c.height);
	}
	t.$restore();
};

proto.$smooth = function (value) {
	this["imageSmoothingEnabled"] = value;
};

proto.$shader = function (func) {
	var t = this;
	var canvas = t["canvas"];
	var imageData = t.$getImage(0, 0, canvas["width"], canvas["height"]);
	var pixels = imageData["data"];
	for (var i = 0, len = pixels["length"]; i < len; i += 4) {
		var result = func(pixels[i], pixels[i+1], pixels[i+2], pixels[i+3], pixels, i);
		if (result) {
			pixels[i]   = result[0];
			pixels[i+1] = result[1];
			pixels[i+2] = result[2];
			pixels[i+3] = result[3];
		}
	}
	t.$putImage(imageData, 0, 0); 
};


/**▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
 * minimizable keywords
 */
proto.$clearRect            = proto["clearRect"];
proto.$clip                 = proto["clip"];
proto.$createLinearGradient = proto["createLinearGradient"];
proto.$createRadialGradient = proto["createRadialGradient"];
proto.$drawImage            = proto["drawImage"];
proto.$fillRect             = proto["fillRect"];
proto.$strokeRect           = proto["strokeRect"];
proto.$getImage             = proto["getImageData"];
proto.$putImage             = proto["putImageData"];
proto.$save                 = proto["save"];
proto.$restore              = proto["restore"];
proto.$rotate               = proto["rotate"];
proto.$scale                = proto["scale"];
proto.$translate            = proto["translate"];
proto.$transform            = proto["transform"];
proto.$resetTransform       = proto["resetTransform"];

})();


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

#REPLACE({
	"$ctx":                  ["$",   "$ctx"],
	"$setFill":              ["c$a", "$setFill"],
	"$setAlpha":             ["c$b", "$setAlpha"],
	"$setBlend":             ["c$c", "$setBlend"],
	"$setStroke":            ["c$d", "$setStroke"],
	"$clearRect":            ["c$e", "$clearRect"],
	"$clip":                 ["c$f", "$clip"],
	"$createLinearGradient": ["c$g", "$createLinearGradient"],
	"$createRadialGradient": ["c$h", "$createRadialGradient"],
	"$drawImage":            ["c$i", "$drawImage"],
	"$fillRect":             ["c$j", "$fillRect"],
	"$strokeRect":           ["c$k", "$strokeRect"],
	"$getImage":             ["c$l", "$getImageData"],
	"$putImage":             ["c$m", "$putImageData"],
	"$save":                 ["c$n", "$save"],
	"$restore":              ["c$o", "$restore"],
	"$rotate":               ["c$p", "$rotate"],
	"$scale":                ["c$q", "$scale"],
	"$translate":            ["c$r", "$translate"],
	"$transform":            ["c$s", "$transform"],
	"$clear":                ["c$t", "$clear"],
	"$smooth":               ["c$u", "$smooth"],
	"$shader":               ["c$v", "$shader"],
	"$createCanvas":         ["c$w", "$createCanvas"],
	"$getContext2d":         ["c$x", "$getContext2d"],
	"$resetTransform":       ["c$X", "$resetTransform"]
})
