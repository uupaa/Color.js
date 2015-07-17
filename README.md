# Color.js [![Build Status](https://travis-ci.org/uupaa/Color.js.svg)](https://travis-ci.org/uupaa/Color.js)

[![npm](https://nodei.co/npm/uupaa.color.js.svg?downloads=true&stars=true)](https://nodei.co/npm/uupaa.color.js/)

Color functions.

- Please refer to [Spec](https://github.com/uupaa/Color.js/wiki/) and [API Spec](https://github.com/uupaa/Color.js/wiki/Color) links.
- The Color.js is made of [WebModule](https://github.com/uupaa/WebModule).

## Browser and NW.js(node-webkit)

```js
<script src="<module-dir>/lib/WebModule.js"></script>
<script src="<module-dir>/lib/ColorCatalog.js"></script>
<script src="<module-dir>/lib/Color.js"></script>
<script>

console.log( new Color("red").toString()            );  // -> "rgba(255,0,0,1.00)"
console.log( new Color("red").toString("#rrggbb")   );  // -> "#ff0000"
console.log( new Color("rgba(255,0,0,1.0)").R       );  // -> 255
console.log( new Color("red").r                     );  // -> 1.0
console.log( new Color("red").A                     );  // -> 255
console.log( new Color("red").a                     );  // -> 1.0
console.log( new Color("red").RGBA                  );  // -> [255, 0, 0, 255]
console.log( new Color("red").HSLA                  );  // -> [0, 1, 0.5, 255]
console.log( new Color("red").HSVA                  );  // -> [0, 1, 1, 255]
console.log( new Color("red").YUVA                  );  // -> [0.29899999499320984, -0.16873599588871002, 0.5, 255]
console.log( new Color("hsla(360,100%,100%,1)").RGBA);  // -> [255, 255, 255, 255]
console.log( new Color("hsva(360,100%,100%,1)").RGBA);  // -> [255,   0,   0, 255]

// --- convert ---
var pixelData = new Uint8ClampedArray([255, 0, 0, 255]);

Color.RGBA_HSLA(pixelData);                     // -> [0, 1, 0.5, 255]
Color.RGBA_HSVA(pixelData);                     // -> [0, 1, 1, 255]
Color.RGBA_YUVA(pixelData);                     // -> [0.29899999499320984, -0.16873599588871002, 0.5, 255]

Color.HSLA_RGBA( Color.RGBA_HSLA(pixelData) );  // -> [255, 0, 0, 255]
Color.HSVA_RGBA( Color.RGBA_HSVA(pixelData) );  // -> [255, 0, 0, 255]
Color.YUVA_RGBA( Color.RGBA_YUVA(pixelData) );  // -> [255, 0, 0, 255]

// --- effect ---
var hue        = 120; // Hue effect.        -360..+360
var saturation = 0;   // Saturation effect. -1.0..+1.0
var lightness  = 0;   // Lightness effect.  -1.0..+1.0
var alpha      = 0;   // Alpha effect.         0..255
var hslA_effect = new Float32Array([ hue, saturation, lightness, alpha ]);

Color.reverse(pixelData);                               // -> [0, 255, 255, 255, ...]
Color.effect(pixelData, hslA_effect);                   // -> [0, 255,   0, 255, ...]
Color.sepia(pixelData);                                 // -> [96, 74, 35, 255, ...]
Color.gray(new Color("pink").RGBA);                     // -> [192, 192, 192, 255]

</script>
```

## WebWorkers

```js
importScripts("<module-dir>lib/WebModule.js");
importScripts("<module-dir>lib/ColorCatalog.js");
importScripts("<module-dir>lib/Color.js");

```

## Node.js

```js
require("<module-dir>lib/WebModule.js");
require("<module-dir>lib/ColorCatalog.js");
require("<module-dir>lib/Color.js");

```

