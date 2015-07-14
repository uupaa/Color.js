(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("Color", function moduleClosure(global) {
"use strict";

// --- dependency modules ----------------------------------
var ColorCatalog = global["WebModule"]["ColorCatalog"];

// --- define / local variables ----------------------------
var W3C_NAMED_COLOR = ColorCatalog["W3C_NAMED_COLOR"];

// --- class / interfaces ----------------------------------
function Color(value) { // @arg Color|String|NumberArray|Uint8Array|Uint8ClampedArray|UINT32 = 0x000000 - Color or "#ffffff" or "rgba(,,,)" or "hsla(,,,)" or "hsva(,,,)" or "red" or 0xffffff or [r, g, b, a]
    var v = value;

//{@dev
    $valid($type(v, "Color|String|NumberArray|Uint8Array|Uint8ClampedArray|UINT32|omit"), Color, "value");
    if (v) {
        if (v instanceof Color) {
            // ok
        } else if (typeof v === "string") {
            $valid(v.length >= 0, Color, "value");
            v = v.toLowerCase().replace(/\s+/g, "");
            if (v[0] === "#") {
                $valid(v.length === 4 || v.length === 7, Color, "value");
                $valid(/^#[\d]+$/.test(v), Color, "value");
            } else if (/^(rgba|hsla|hsva)/.test(v)) {
                $valid(/^(rgba|hsla|hsva)\([\d\.]+,[\d\.]+%?,[\d\.]+%?,[\d\.]+\)$/.test(v), Color, "value");
            } else if (/^(rgb|hsl|hsv)/.test(v)) {
                $valid(/^(rgb|hsl|hsv)\([\d\.]+,[\d\.]+%?,[\d\.]+%?\)$/.test(v), Color, "value");
            } else {
                $valid(/^[a-z]+$/.test(v) && v in W3C_NAMED_COLOR, Color, "value");
            }
        } else if (typeof v === "number") {
            $valid(v >= 0x000000 && v <= 0xffffff, Color, "value"); // UINT24
        } else if (Array.isArray(v) ||
                   v instanceof Uint8Array ||
                   v instanceof Uint8ClampedArray) {
            $valid(v.length === 4, Color, "value");
        }
    }
//}@dev

    this._c = v === undefined       ? new Uint8ClampedArray(4)
            : v instanceof Color    ? v.RGBA
            : typeof v === "number" ? new Uint8ClampedArray([v >> 16 & 0xff, v >> 8 & 0xff, v & 0xff, 255])
            : typeof v === "string" ? _parseColorString( v.toLowerCase().replace(/\s+/g, "") )
                                    : new Uint8ClampedArray(v); // Array|Uint8Array|Uint8ClampedArray
}

Color["repository"] = "https://github.com/uupaa/Color.js";
Color["prototype"] = Object.create(Color, {
    "constructor":  { "value": Color          }, // new Color(value:Color|String|Uint8Array|Uint8ClampedArray|UINT32 = 0x000000):Color
    "toString":     { "value": Color_toString }, // Color#toString(hex:Boolean = false):String
    "RGBA":         { "get": function()  { return new Uint8ClampedArray(this._c); } }, // Color#RGBA:Uint8ClampedArray - [R, G, B, A]
    "HSLA":         { "get": function()  { return Color_RGBA_HSLA(this._c); } }, // Color#HSLA:Float32Array - [h, s, l, A]
    "HSVA":         { "get": function()  { return Color_RGBA_HSVA(this._c); } }, // Color#HSVA:Float32Array - [h, s, v, A]
    "YUVA":         { "get": function()  { return Color_RGBA_YUVA(this._c); } }, // Color#YUVA:Float32Array - [y,cb,cr, A]
    "R":            { "get": function()  { return this._c[0];               },   // Color#R:UINT8  (0..255)
                      "set": function(r) { this._c[0] = r;                  } },
    "G":            { "get": function()  { return this._c[1];               },   // Color#G:UINT8  (0..255)
                      "set": function(g) { this._c[1] = g;                  } },
    "B":            { "get": function()  { return this._c[2];               },   // Color#B:UINT8  (0..255)
                      "set": function(b) { this._c[2] = b;                  } },
    "A":            { "get": function()  { return this._c[3];               },   // Color#A:UINT8  (0..255)
                      "set": function(a) { this._c[3] = a;                  } },
    "r":            { "get": function()  { return this._c[0] / 255;         },   // Color#r:Number (0.0..1.0)
                      "set": function(r) { this._c[0] = r;                  } },
    "g":            { "get": function()  { return this._c[1] / 255;         },   // Color#g:Number (0.0..1.0)
                      "set": function(g) { this._c[1] = g;                  } },
    "b":            { "get": function()  { return this._c[2] / 255;         },   // Color#b:Number (0.0..1.0)
                      "set": function(b) { this._c[2] = b;                  } },
    "a":            { "get": function()  { return this._c[3] / 255;         },   // Color#a:Number (0.0..1.0)
                      "set": function(a) { this._c[3] = a;                  } },
});

// --- convert ---
Color["RGBA_HSLA"] = Color_RGBA_HSLA; // Color.RGBA_HSLA(pixelData:NumberArray|Uint8Array|Uint8ClampedArray):Float32Array - [<R, G, B, A>, ...] to [<h, s, l, A>, ...]
Color["RGBA_HSVA"] = Color_RGBA_HSVA; // Color.RGBA_HSVA(pixelData:NumberArray|Uint8Array|Uint8ClampedArray):Float32Array - [<R, G, B, A>, ...] to [<h, s, v, A>, ...]
Color["RGBA_YUVA"] = Color_RGBA_YUVA; // Color.RGBA_YUVA(pixelData:NumberArray|Uint8Array|Uint8ClampedArray):Float32Array - [<R, G, B, A>, ...] to [<y,cb,cr, A>, ...]

Color["HSLA_RGBA"] = Color_HSLA_RGBA; // Color.HSLA_RGBA(pixelData:NumberArray|Float32Array):Uint8ClampedArray - [<h, s, l, A>, ...] to [<R, G, B, A>, ...]
Color["HSVA_RGBA"] = Color_HSVA_RGBA; // Color.HSVA_RGBA(pixelData:NumberArray|Float32Array):Uint8ClampedArray - [<h, s, v, A>, ...] to [<R, G, B, A>, ...]
Color["YUVA_RGBA"] = Color_YUVA_RGBA; // Color.YUVA_RGBA(pixelData:NumberArray|Float32Array):Uint8ClampedArray - [<y,cb,cr, A>, ...] to [<R, G, B, A>, ...]

// --- effect ---
Color["reverse"]   = Color_reverse;   // Color.reverse(pixelData:NumberArray|Uint8Array|Uint8ClampedArray):Uint8ClampedArray
Color["effect"]    = Color_effect;    // Color.effect(pixelData:NumberArray|Uint8Array|Uint8ClampedArray, hslA:NumberArray|Float32Array):Uint8ClampedArray
Color["sepia"]     = Color_sepia;     // Color.sepia(pixelData:NumberArray|Uint8Array|Uint8ClampedArray, cb:Number = -0.0911, cr:Number = 0.056):Uint8ClampedArray
Color["gray"]      = Color_gray;      // Color.gray(pixelData:NumberArray|Uint8Array|Uint8ClampedArray):Uint8ClampedArray

// --- implements ------------------------------------------
function _parseColorString(value) { // @arg String - "#ffffff" or "rgba(,,,)" or "hsla(,,,)" or "hsva(,,,)" or "red"
                                    // @ret Uint8ClampedArray - [R, G, B, A]  [0..255, 0..255, 0..255, 0..255]
    var v = value;
    var n = 0x000000;
    var t = null; // string split(...) token
    var R, G, B, A;

    if (v[0] === "#") {
        switch (v.length) {
        case 7: n = parseInt(v.slice(1), 16) || 0; break; // "#RRGGBB"
        case 4: t = v.split(""); // "#RGB" -> ["#", "R", "G", "B"]
                n = parseInt(t[1] + t[1] + t[2] + t[2] + t[3] + t[3], 16) || 0; // NaN -> 0
        }
    } else if (/,/.test(v)) { // "rgb(,,)", "rgba(,,,)", "hsla(,,,)", "hsva(,,,)"
        var hasAlpha = v[3] === "a";
        var type = /^rgb/.test(v) ? 1       // "rgba(255,255,255,1.0)"
                 : /^hsl/.test(v) ? 2       // "hsla(359,100%,100%,1.0)"
                 : /^hsv/.test(v) ? 3 : 0;  // "hsva(359,100%,100%,1.0)"
        if (type) {
            t = v.slice(hasAlpha ? 5 : 4, -1).split(","); // "rgba(1,2,3,4)" -> ["1", "2", "3", "4"]
            R = parseFloat(t[0]) || 0.0; // R or H
            G = parseFloat(t[1]) || 0.0; // R or S
            B = parseFloat(t[2]) || 0.0; // R or V or L
            A = (hasAlpha ? (parseFloat(t[3]) || 0.0) : 1.0) * 255;

            switch (type) {
            case 1: return new Uint8ClampedArray([R, G, B, A]);
            case 2: return Color_HSLA_RGBA([R, G / 100, B / 100, A]);
            case 3: return Color_HSVA_RGBA([R, G / 100, B / 100, A]);
            }
        }
    } else { // W3CNamedColor. "red", "pink", ...
        if (v in W3C_NAMED_COLOR) {
            var rgb = W3C_NAMED_COLOR[v]; // [r, g, b]

            return new Uint8ClampedArray([rgb[0], rgb[1], rgb[2],
                                          v === "transparent" ? 0 : 255]);
        }
    }
    return new Uint8ClampedArray([n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 255]);
}

function Color_toString(hex) { // @arg Boolean = false
                               // @ret String - "rgba(255,255,255,1.00)" or "#FFFFFF"
    var c = this._c;

    if (hex) {
        var n = (c[0] << 16 | c[1] << 8 | c[2]);
        return "#" + (0x1000000 + n).toString(16).slice(1);
    }
    return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + (c[3] / 255).toFixed(2) + ")";
}

// === HSLA ================================================
function Color_HSLA_RGBA(pixelData) { // @arg NumberArray|Float32Array - [<h, s, l, A>, ...] [0..359, 0..1, 0..1, 0..255]
                                      // @ret Uint8ClampedArray - [<R, G, B, A>, ...]
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(pixelData, "NumberArray|Float32Array"), Color_HSLA_RGBA, "pixelData");
    }
//}@dev
    // http://www.rapidtables.com/convert/color/hsl-to-rgb.htm
    // http://gyazo.com/340bb26d09ac9047a092b7416f2fbe74.png

    var result = new Uint8ClampedArray(pixelData.length);

    for (var i = 0, iz = result.length; i < iz; i += 4) {
        var h = pixelData[i    ];
        var s = pixelData[i + 1];
        var l = pixelData[i + 2];
        var A = pixelData[i + 3];

        h = h >= 360 ? h - 360 : h;

        var c = (1 - Math.abs(2 * l - 1)) * s;
        var x = c * (1 - Math.abs((h / 60) % 2 - 1));
        var m = l - c / 2;

        var r = 0;
        var g = 0;
        var b = 0;

        c += m;
        x += m;

        switch (h / 60 | 0) {
        case 0: r = c; g = x; b = m; break;
        case 1: r = x; g = c; b = m; break;
        case 2: r = m; g = c; b = x; break;
        case 3: r = m; g = x; b = c; break;
        case 4: r = x; g = m; b = c; break;
        case 5: r = c; g = m; b = x;
        }
        result.set([r * 255, g * 255, b * 255, A], i);
    }
    return result;
}

function Color_RGBA_HSLA(pixelData) { // @arg NumberArray|Uint8Array|Uint8ClampedArray - [<R, G, B, A>, ...]
                                      // @ret Float32Array - [<h, s, l, A>, ...] <0..359, 0..1, 0..1, 0..255>
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(pixelData, "NumberArray|Uint8Array|Uint8ClampedArray"), Color_RGBA_HSLA, "pixelData");
    }
//}@dev
    // http://www.rapidtables.com/convert/color/rgb-to-hsl.htm
    // http://gyazo.com/24f284e3a85edeb6f3c197386131db73.png

    var result = new Float32Array(pixelData.length);

    for (var i = 0, iz = result.length; i < iz; i += 4) {
        var r   = pixelData[i    ] / 255; // R'
        var g   = pixelData[i + 1] / 255; // G'
        var b   = pixelData[i + 2] / 255; // B'
        var A   = pixelData[i + 3];

        var max = Math.max(r, g, b); // Cmax
        var min = Math.min(r, g, b); // Cmin
        var d   = max - min; // delta

        var l   = (max + min) / 2;
        var s   = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
        var h   = 0;

        if (!d) { // avoid division by zero
            return new Float32Array( [0, 0, l, A] );
        }

        h = (max === r) ? 60 * (((g - b) / d) % 6)
          : (max === g) ? 60 * (((b - r) / d) + 2)
          : (max === b) ? 60 * (((r - g) / d) + 4) : 0;

        if (h < 0) {
            h += 360;
        }
        result.set([h, s, l, A], i);
    }
    return result;
}

// === HSVA ================================================
function Color_HSVA_RGBA(pixelData) { // @arg NumberArray|Float32Array - [<h, s, v, A>, ...] [0..359, 0..1, 0..1, 0..255]
                                      // @ret Uint8ClampedArray - [<R, G, B, A>, ...]
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(pixelData, "NumberArray|Float32Array"), Color_HSVA_RGBA, "pixelData");
    }
//}@dev
    // http://www.rapidtables.com/convert/color/hsv-to-rgb.htm
    // http://gyazo.com/89cfc85e8f429638c16336f954c01a6e.png

    var result = new Uint8ClampedArray(pixelData.length);

    for (var i = 0, iz = result.length; i < iz; i += 4) {
        var h = pixelData[0];
        var s = pixelData[1];
        var v = pixelData[2];
        var A = pixelData[3];

        h = h >= 360 ? h - 360 : h;

        var c = v * s;
        var x = c * (1 - Math.abs((h / 60) % 2 - 1));
        var m = v - c;

        var r = 0;
        var g = 0;
        var b = 0;

        c += m;
        x += m;

        switch (h / 60 | 0) {
        case 0: r = c; g = x; b = m; break;
        case 1: r = x; g = c; b = m; break;
        case 2: r = m; g = c; b = x; break;
        case 3: r = m; g = x; b = c; break;
        case 4: r = x; g = m; b = c; break;
        case 5: r = c; g = m; b = x;
        }
        result.set([r * 255, g * 255, b * 255, A], i);
    }
    return result;
}

function Color_RGBA_HSVA(pixelData) { // @arg NumberArray|Uint8Array|Uint8ClampedArray - [<R, G, B, A>, ...]
                                      // @ret Float32Array - [<h, s, v, A>, ...] <0..359, 0..1, 0..1, 0..255>
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(pixelData, "NumberArray|Uint8Array|Uint8ClampedArray"), Color_RGBA_HSVA, "pixelData");
    }
//}@dev
    // http://www.rapidtables.com/convert/color/rgb-to-hsv.htm
    // http://gyazo.com/63dc62af3e6936611e8a8cddf563fd36.png

    var result = new Float32Array(pixelData.length);

    for (var i = 0, iz = result.length; i < iz; i += 4) {
        var r   = pixelData[i    ] / 255; // R'
        var g   = pixelData[i + 1] / 255; // G'
        var b   = pixelData[i + 2] / 255; // B'
        var A   = pixelData[i + 3];

        var max = Math.max(r, g, b); // Cmax
        var min = Math.min(r, g, b); // Cmin
        var d   = max - min; // delta

        var v   = max;
        var s   = max === 0 ? 0 : d / max;
        var h   = 0;

        if (!d) { // avoid division by zero
            return new Float32Array( [0, 0, v, A] );
        }

        h = (max === r) ? 60 * (((g - b) / d) % 6)
          : (max === g) ? 60 * (((b - r) / d) + 2)
          : (max === b) ? 60 * (((r - g) / d) + 4) : 0;

        if (h < 0) {
            h += 360;
        }
        result.set([h, s, v, A], i);
    }
    return result;
}

// === YUV ================================================
function Color_YUVA_RGBA(pixelData) { // @arg NumberArray|Float32Array - [<y, cb, cr, A>, ...] <0..1, -0.5..0.5, -0.5..0.5, 0..255>
                                      // @ret Uint8ClampedArray - [<R, G, B, A>, ...]
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(pixelData, "NumberArray|Float32Array"), Color_YUVA_RGBA, "pixelData");
    }
//}@dev
    // ITU-R BT.601

    var result = new Uint8ClampedArray(pixelData.length);

    for (var i = 0, iz = result.length; i < iz; i += 4) {
        var y  = pixelData[i    ];
        var cb = pixelData[i + 1];
        var cr = pixelData[i + 2];
        var A  = pixelData[i + 3];

        var r  = y + 1.402    * cr;
        var g  = y - 0.344136 * cb - 0.714136 * cr;
        var b  = y + 1.772    * cb;

        result.set([r * 255, g * 255, b * 255, A], i);
    }
    return result;
}

function Color_RGBA_YUVA(pixelData) { // @arg NumberArray|Uint8Array|Uint8ClampedArray - [<R, G, B, A>, ...]
                                      // @ret Float32Array - [<y, cb, cr, A>, ...] [0..1, -0.5..0.5, -0.5..0.5, 0..255]
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(pixelData, "NumberArray|Uint8Array|Uint8ClampedArray"), Color_RGBA_YUVA, "pixelData");
    }
//}@dev
    // ITU-R BT.601

    var result = new Float32Array(pixelData.length);

    for (var i = 0, iz = result.length; i < iz; i += 4) {
        var r  = pixelData[i    ] / 255;
        var g  = pixelData[i + 1] / 255;
        var b  = pixelData[i + 2] / 255;
        var A  = pixelData[i + 3];

        var y  =  0.299    * r + 0.587    * g + 0.114    * b;
        var cb = -0.168736 * r - 0.331264 * g + 0.5      * b;
        var cr =  0.5      * r - 0.418688 * g - 0.081312 * b;

        result.set([y, cb, cr, A], i);
    }
    return result;
}

// === EFFECT ==============================================
function Color_reverse(pixelData) { // @arg NumberArray|Uint8Array|Uint8ClampedArray - pixel data. [<R, G, B, A>, ...]
                                    // @ret Uint8ClampedArray - new pixel data. [<R, G, B, A>, ...]
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(pixelData, "NumberArray|Uint8Array|Uint8ClampedArray"), Color_reverse, "pixelData");
    }
//}@dev

    var data = pixelData;
    var result = new Uint8ClampedArray(data.length);

    for (var i = 0, iz = result.length; i < iz; i += 4) {
        result.set([data[i + 0] ^ 255, data[i + 1] ^ 255, data[i + 2] ^ 255, data[i + 3]], i);
    }
    return result;
}

function Color_effect(pixelData, // @arg NumberArray|Uint8Array|Uint8ClampedArray - pixel data. [<R, G, B, A>, ...]
                      hslA) {    // @arg NumberArray|Float32Array - effect values. [<h, s, l, A>] [-359..359, -1..1, -1..1, 0..255]
                                 // @ret Uint8ClampedArray - new pixel data. [<R, G, B, A>, ...]
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(pixelData, "NumberArray|Uint8Array|Uint8ClampedArray"), Color_effect, "pixelData");
        $valid($type(hslA, "Float32Array|NumberArray"), Color_effect, "hslA");
    }
//}@dev

    var f32 = Color_RGBA_HSLA(pixelData);
    var h = hslA[0];
    var s = hslA[1];
    var l = hslA[2];
    var A = hslA[3];
    var ff = new Float32Array(f32.length);

    for (var i = 0, iz = f32.length; i < iz; i += 4) {
        var hh = f32[i    ] + h;
        var ss = f32[i + 1] + s;
        var ll = f32[i + 2] + l;
        var AA = f32[i + 3] + A;

        while (hh < 0 || hh > 360) {
            if (hh < 0) {
                hh += 360;
            } else {
                hh -= 360;
            }
        }
        ss = (ss > 1.0) ? 1.0 : (ss < 0.0) ? 0.0 : ss;
        ll = (ll > 1.0) ? 1.0 : (ll < 0.0) ? 0.0 : ll;
        AA = (AA > 255) ? 255 : (AA < 0)   ? 0   : AA;

        ff.set([hh, ss, ll, AA], i);
    }
    return Color_HSLA_RGBA(ff);
}

function Color_sepia(pixelData, // @arg NumberArray|Uint8Array|Uint8ClampedArray - pixel data. [<R, G, B, A>, ...]
                     cb,        // @arg Number = -0.0911
                     cr) {      // @arg Number =  0.056
                                // @ret Uint8ClampedArray - pixel data
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(pixelData, "NumberArray|Uint8Array|Uint8ClampedArray"), Color_sepia, "pixelData");
        $valid($type(cb, "Number|omit"), Color_sepia, "cb");
        $valid($type(cr, "Number|omit"), Color_sepia, "cr");
    }
//}@dev

    cb = cb === undefined ? -0.0911 : cb;
    cr = cr === undefined ?  0.056  : cr;

    var ff  = new Float32Array(pixelData.length);
    var f32 = Color_RGBA_YUVA(pixelData);

    for (var i = 0, iz = f32.length; i < iz; i += 4) {
        ff.set([ f32[i], cb, cr, f32[i + 3] ], i);
    }
    return Color_YUVA_RGBA(ff);
}

function Color_gray(pixelData) { // @arg NumberArray|Uint8Array|Uint8ClampedArray - pixel data. [<R, G, B, A>, ...]
                                 // @ret Uint8ClampedArray - pixel data. [<R, G, B, A>, ...]
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(pixelData, "NumberArray|Uint8Array|Uint8ClampedArray"), Color_gray, "pixelData");
    }
//}@dev

    var data = pixelData;
    var result = new Uint8ClampedArray(data.length);

    for (var i = 0, iz = data.length; i < iz; i += 4) {
        result.set([ data[i + 1], data[i + 1], data[i + 1], data[i + 3] ], i);
    }
    return result;
}

return Color; // return entity

});

