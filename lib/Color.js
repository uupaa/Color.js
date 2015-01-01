(function(global) {
"use strict";

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
//var _runOnNode = "process" in global;
//var _runOnWorker = "WorkerLocation" in global;
//var _runOnBrowser = "document" in global;

// --- class / interfaces ----------------------------------
function Color(color) { // @arg Color|String|Number|RGBANumberArray = 0x000000 - Color or "#ffffff" or "rgba(,,,)" or "hsla(,,,)" or "hsva(,,,)" or "red" or 0xffffff or [r, g, b, a]
//{@dev
    $valid($type(color, "Color|String|Number|RGBANumberArray|omit"), Color, "color");
    if (color) {
        if (color instanceof Color) {
            // ok
        } else if (typeof color === "string") {
            $valid(color.length >= 0, Color, "color");
            color = color.toLowerCase().replace(/\s+/g, "");
            if (color[0] === "#") {
                $valid(color.length === 4 || color.length === 7, Color, "color");
                $valid(/^#[\d]+$/.test(color), Color, "color");
            } else if (/^(rgb|hsl|hsv)$/.test(color)) {
                $valid(/^(rgb|hsl|hsv)\([\d\.]+,[\d\.]+%?,[\d\.]+%?\)$/.test(color), Color, "color");
            } else if (/^(rgba|hsla|hsva)$/.test(color)) {
                $valid(/^(rgba|hsla|hsva)\([\d\.]+,[\d\.]+%?,[\d\.]+%?,[\d\.]+\)$/.test(color), Color, "color");
            } else {
                $valid(/^[a-z]+$/.test(color), Color, "color");
            }
        } else if (typeof color === "number") {
            $valid(color >= 0x000000 && color <= 0xffffff, Color, "color");
        } else if (Array.isArray(color)) {
            $valid(color.length === 4, Color, "color");
        }
    }
//}@dev

    var r = 0, g = 0, b = 0, a = 0.0, na = null;

    if (color !== undefined) {
        if (typeof color === "number") {
            na = [ n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1 ];
        } else if (color instanceof Color) {
            na = color["toArray"]();
        } else if (Array.isArray(color)) {
            na = color;
        } else {
            na = _parseColorString( color.toLowerCase().replace(/\s+/g, "") );
        }
        r = na[0];
        g = na[1];
        b = na[2];
        a = na[3];
    }
    this["r"] = (r < 0 ? 0 : r > 255 ? 255 : r) | 0; // trim 0 - 255
    this["g"] = (g < 0 ? 0 : g > 255 ? 255 : g) | 0; // trim 0 - 255
    this["b"] = (b < 0 ? 0 : b > 255 ? 255 : b) | 0; // trim 0 - 255
    this["a"] =  a < 0 ? 0 : a > 1.0 ? 1.0 : a;      // trim 0.0 - 1.0
}

//{@dev
Color["repository"] = "https://github.com/uupaa/Color.js"; // GitHub repository URL. http://git.io/Help
//}@dev
Color["prototype"] = {
    "constructor":  Color,              // new Color(value:Number|Integer):Color
    "toString":     Color_toString,     // Color#toString(hex:Boolean = false):String
    "toArray":      Color_toArray,      // Color#toArray(percent:Boolean = false):RGBANumberArray|RGBAPercentNumberArray
    "valueOf":      Color_valueOf,      // Color#valueOf():RRGGBBColorInteger
    "reverse":      Color_reverse,      // Color#reverse():Color
    "effect":       Color_effect,       // Color#effect(c:Color, h:Number = 0, s:Number = 0, l:Number = 0):Color
    "sepia":        Color_sepia,        // Color#sepia(cb:Number = -0.091, cr:Number = 0.056):Color
    "gray":         Color_gray,         // Color#gray():Color
};
Color["RGBA_HSLA"] = Color_RGBA_HSLA;   // Color.RGBA_HSLA(rgba:RGBANumberArray):HSLANumberArray
Color["RGBA_HSVA"] = Color_RGBA_HSVA;   // Color.RGBA_HSVA(rgba:RGBANumberArray):HSVANumberArray
Color["RGBA_YUVA"] = Color_RGBA_YUVA;   // Color.RGBA_YUVA(rgba:RGBANumberArray):YUVANumberArray
Color["HSLA_RGBA"] = Color_HSLA_RGBA;   // Color.HSLA_RGBA(hsla:HSLANumberArray):RGBANumberArray
Color["HSVA_RGBA"] = Color_HSVA_RGBA;   // Color.HSVA_RGBA(hsva:HSVANumberArray):RGBANumberArray
Color["YUVA_RGBA"] = Color_YUVA_RGBA;   // Color.YUVA_RGBA(yuva:YUVANumberArray):RGBANumberArray
Color["parseRGBA"] = Color_parseRGBA;   // Color.parseRGBA(color:String):RGBANumberArray
Color["parseHSLA"] = Color_parseHSLA;   // Color.parseHSLA(color:String):HSLANumberArray
Color["parseHSVA"] = Color_parseHSVA;   // Color.parseHSVA(color:String):HSVANumberArray

// --- implements ------------------------------------------
function _parseColorString(color) { // @arg String - "#ffffff" or "rgba(,,,)" or "hsla(,,,)" or "hsva(,,,)" or "red"
                                    // @ret RGBANumberArray - [r, g, b, a]
    var n = 0x000000;

    if (color[0] === "#") {
        switch (color.length) {
        case 7: n = parseInt(color.slice(1), 16) || 0; break; // #RRGGBB
        case 4: var t = color.split(""); // #RGB
                n = parseInt(t[1] + t[1] + t[2] + t[2] + t[3] + t[3], 16) || 0; // NaN -> 0
        }
    } else if (/,/.test(color)) {
        var rgba = null, hsla = null, hsva = null;

        switch (color[2]) {
        case "b": rgba = Color_parseRGBA(color); // "rgba(255,255,255,1.0)"
                  break;
        case "l": hsla = Color_parseHSLA(color); // "hsla(360,100%,100%,1.0)"
                  if (hsla) { rgba = Color_HSLA_RGBA(hsla); }
                  break;
        case "v": hsva = Color_parseHSVA(color); // "hsva(360,100%,100%,1.0)"
                  if (hsva) { rgba = Color_HSVA_RGBA(hsva); }
        }
        if (rgba) {
            return [ rgba[0] * 255, rgba[1] * 255, rgba[2] * 255, rgba[3] ];
        }
    } else { // NamedColor. "red", "pink", ...
        if (color === "transparent") {
            return [ 0, 0, 0, 0 ];
        } else if (color in Color["DICT"]) {
            var preset = Color["DICT"][color];
            return [ preset[0], preset[1], preset[2], 1 ];
        }
    }
    return [ n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1 ];
}

function Color_toString(hex) { // @arg Boolean = false
                               // @ret String - "#FFFFFF" or "rgba(255,255,255,1.0)"
    if (hex) {
        var num = this["r"] << 16 | this["g"] << 8 | this["b"];

        return "#" + (0x1000000 + num).toString(16).slice(1);
    }
    return "rgba(" + this["r"] + "," + this["g"] + "," + this["b"] + "," +
                     this["a"] + ")";
}

function Color_toArray(percent) { // @arg Boolean = false
                                  // @ret RGBANumberArray|RGBAPercentNumberArray - [r, g, b, a]
                                  // @result.r Number|Percent - (0 - 255) or (0.0 - 1.0)
                                  // @result.g Number|Percent - (0 - 255) or (0.0 - 1.0)
                                  // @result.b Number|Percent - (0 - 255) or (0.0 - 1.0)
                                  // @result.a Percent        - (0.0 - 1.0)
    return percent ? [ this["r"] / 255, this["g"] / 255, this["b"] / 255, this["a"] ]
                   : [ this["r"],       this["g"],       this["b"],       this["a"] ];
}

function Color_valueOf() { // @ret RRGGBBColorInteger - 0xRRGGBB
    return (this["r"] << 16 | this["g"] << 8 | this["b"]) | 0;
}

function Color_reverse() { // @ret Color
    return new Color([ this["r"] ^ 255, this["g"] ^ 255, this["b"] ^ 255, this["a"] ]);
}

function Color_effect(h,   // @arg Number  = 0 - Hue        (valid range: -360 - 360)
                      s,   // @arg Percent = 0 - Saturation (valid range: -1.0 - 1.0)
                      l,   // @arg Percent = 0 - Lightness  (valid range: -1.0 - 1.0)
                      a) { // @arg Percent = 0 - Alpha      (valid range: -1.0 - 1.0)
                           // @ret Color
    var base = Color_RGBA_HSLA([ this["r"] / 255, this["g"] / 255, this["b"] / 255, this["a"] ]);
    var hsla = _effectColor(base, h || 0, s || 0, l || 0, a || 0);
    var rgba = Color_HSLA_RGBA([ hsla[0], hsla[1], hsla[2], hsla[3] ]);

    return new Color( rgba[0] * 255, rgba[1] * 255, rgba[2] * 255, rgba[3] );
}
function _effectColor(base, // @arg HSLANumberArray - [h:Number, s:Percent, l:Percent, a:Percent]
                      h,    // @arg Number  = 0 - Hue        (valid range: -360 - 360)
                      s,    // @arg Percent = 0 - Saturation (valid range: -1.0 - 1.0)
                      l,    // @arg Percent = 0 - Lightness  (valid range: -1.0 - 1.0)
                      a) {  // @arg Percent = 0 - Alpha      (valid range: -1.0 - 1.0)
                            // @ret HSLANumberArray
    var hh = base[0] + (h || 0);
    var ss = base[1] + (s || 0);
    var ll = base[2] + (l || 0);
    var aa = base[3] + (a || 0);

    while (hh < 0 || hh > 360) {
        if (hh < 0) {
            hh += 360;
        } else {
            hh -= 360;
        }
    }
    ss = (ss > 1.0) ? 1.0 : (ss < 0.0) ? 0.0 : ss;
    ll = (ll > 1.0) ? 1.0 : (ll < 0.0) ? 0.0 : ll;
    aa = (aa > 1.0) ? 1.0 : (aa < 0.0) ? 0.0 : aa;
    return [ hh, ss, ll, aa ];
}

function Color_sepia(cb,   // @arg Number = -0.0911
                     cr) { // @arg Number =  0.056
                           // @ret RGBANumberArray - [r:Percent, g:Percent, b:Percent, a:Percent]
    var yuva = Color_RGBA_YUVA(this["toArray"](true)); // [1.0, 1.0, 1.0, 1.0]
    var rgba = Color_YUVA_RGBA([ yuva[0], cb || -0.091, cr || 0.056, yuva[3] ]);

    return new Color([ rgba[0] * 255, rgba[1] * 255, rgba[2] * 255, rgba[3] ]);
}

function Color_gray() { // @ret Color
    return new Color([ this["g"], this["g"], this["g"], this["a"] ]);
}

// === RGBA ================================================
function Color_parseRGBA(color) { // @arg String - RGBAColorString - "rgba(255,255,255,1.0)" or "rgb(255,255,255)"
                                  // @ret RGBANumberArray|null - [r:Percent, g:Percent, b:Percent, a:Percent], null is parse error
    if (/^rgba?/.test(color)) {
        var hasAlpha = color[3] === "a";
        var t = color.slice(hasAlpha ? 5 : 4, -1).split(","); // "rgba(r,g,b,a)" -> [r,g,b,a]
        var r = parseFloat(t[0]) || 0.0; // "255" -> 255
        var g = parseFloat(t[1]) || 0.0; // "255" -> 255
        var b = parseFloat(t[2]) || 0.0; // "255" -> 255
        var a = hasAlpha ? (parseFloat(t[3]) || 0.0) : 1.0; // "1.0"  -> 1.0

        return [ r / 255, g / 255, b / 255, a ];
    }
    return Color_parseRGBA( color.toLowerCase().replace(/\s+/g, "") ) || null;
}

// === HSLA ================================================
function Color_parseHSLA(color) { // @arg String - HSLAColorString - "hsla(360,100%,100%,1.0)" or "hsl(360,100%,100%)"
                                  // @ret HSLANumberArray|null - [h:Number, s:Percent, l:Percent, a:Percent], null is parse error
    if (/^hsla?/.test(color)) {
        var hasAlpha = color[3] === "a";
        var t = color.slice(hasAlpha ? 5 : 4, -1).split(","); // "hsla(h,s,l,a)" -> [h,s,l,a]
        var h = parseFloat(t[0]) || 0.0; // "360"  -> 360
        var s = parseFloat(t[1]) || 0.0; // "100%" -> 100
        var l = parseFloat(t[2]) || 0.0; // "100%" -> 100
        var a = hasAlpha ? (parseFloat(t[3]) || 0.0) : 1.0; // "1.0"  -> 1.0

        return [ h, s / 100, l / 100, a ];
    }
    return Color_parseHSLA( color.toLowerCase().replace(/\s+/g, "") ) || null;
}

function Color_HSLA_RGBA(hsla) { // @arg HSLANumberArray - [h, s, l, a]
                                 // @hsla.h Number  - Hue        (0 - 360)
                                 // @hsla.s Percent - Saturation (0.0 - 1.0)
                                 // @hsla.l Percent - Lightness  (0.0 - 1.0)
                                 // @hsla.a Percent - Alpha      (0.0 - 1.0)
                                 // @ret RGBANumberArray - [r, g, b, a]
                                 // @result.r Percent - Red   (0.0 - 1.0)
                                 // @result.g Percent - Green (0.0 - 1.0)
                                 // @result.b Percent - Blue  (0.0 - 1.0)
                                 // @result.a Percent - Alpha (0.0 - 1.0)
//{@dev
    $valid($type(hsla, "NumberArray"), Color_HSLA_RGBA, "hsla");
    $valid($type(hsla[0], "Number"),   Color_HSLA_RGBA, "hsla[0]");
    $valid($type(hsla[1], "Percent"),  Color_HSLA_RGBA, "hsla[1]");
    $valid($type(hsla[2], "Percent"),  Color_HSLA_RGBA, "hsla[2]");
    $valid($type(hsla[3], "Percent"),  Color_HSLA_RGBA, "hsla[3]");
//}@dev
    // http://www.rapidtables.com/convert/color/hsl-to-rgb.htm
    // http://gyazo.com/340bb26d09ac9047a092b7416f2fbe74.png
    var h = hsla[0];
    var s = hsla[1];
    var l = hsla[2];
    var a = hsla[3];

    while (h < 0 || h > 360) {
        if (h < 0) {
            h += 360;
        } else {
            h -= 360;
        }
    }
    var c = (1 - Math.abs(2 * l - 1)) * s;
    var x = c * (1 - Math.abs((h / 60) % 2 - 1));
    var m = l - c / 2;

    c += m;
    x += m;
    switch (h / 60 | 0) {
    case 6:
    case 0: return [c, x, m, a];
    case 1: return [x, c, m, a];
    case 2: return [m, c, x, a];
    case 3: return [m, x, c, a];
    case 4: return [x, m, c, a];
    case 5: return [c, m, x, a];
    }
    return [0, 0, 0, a];
}

function Color_RGBA_HSLA(rgba) { // @arg RGBANumberArray - [r, g, b, a]
                                 // @rgba.r Percent - Red   (0.0 - 1.0)
                                 // @rgba.g Percent - Green (0.0 - 1.0)
                                 // @rgba.b Percent - Blue  (0.0 - 1.0)
                                 // @rgba.a Percent - Alpha (0.0 - 1.0);
                                 // @ret HSLANumberArray - [h, s, l, a]
                                 // @result.h Number Hue         (0 - 360)
                                 // @result.s Percent Saturation (0.0 - 1.0)
                                 // @result.l Percent Lightness  (0.0 - 1.0)
                                 // @result.a Percent Alpha      (0.0 - 1.0)
//{@dev
    $valid($type(rgba, "NumberArray"), Color_RGBA_HSLA, "rgba");
    $valid($type(rgba[0], "Percent"),  Color_RGBA_HSLA, "rgba[0]");
    $valid($type(rgba[1], "Percent"),  Color_RGBA_HSLA, "rgba[1]");
    $valid($type(rgba[2], "Percent"),  Color_RGBA_HSLA, "rgba[2]");
    $valid($type(rgba[3], "Percent"),  Color_RGBA_HSLA, "rgba[3]");
//}@dev
    // http://www.rapidtables.com/convert/color/rgb-to-hsl.htm
    // http://gyazo.com/24f284e3a85edeb6f3c197386131db73.png
    var r = rgba[0];
    var g = rgba[1];
    var b = rgba[2];
    var a = rgba[3];
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var delta = max - min;

    var h = 0;
    var s = 0;
    var l = (max + min) / 2;

    if (delta) {
        s = delta / (1 - Math.abs(2 * l - 1));
    }
    if (!s) { // avoid division by zero
        return [0, 0, l, a];
    }
    if (max === r) {
        h = (((g - b) / delta) % 6) * 60;
    } else if (max === g) {
        h = ((b - r) / delta + 2) * 60;
    } else if (max === b) {
        h = ((r - g) / delta + 4) * 60;
    }
    if (h < 0) {
        h += 360;
    }
    return [h, s, l, a];
}

// === HSVA ================================================
function Color_parseHSVA(color) { // @arg String - HSVAColorString - "hsva(360,100%,100%,1.0)" or "hsv(360,100%,100%)"
                                  // @ret HSVANumberArray|null - [h:Number, s:Percent, v:Percent, a:Percent], null is parse error
    if (/^hsva?/.test(color)) {
        var hasAlpha = color[3] === "a";
        var t = color.slice(hasAlpha ? 5 : 4, -1).split(","); // "hsva(h,s,v,a)" -> [h,s,v,a]
        var h = parseFloat(t[0]) || 0.0; // "360"  -> 360
        var s = parseFloat(t[1]) || 0.0; // "100%" -> 100
        var v = parseFloat(t[2]) || 0.0; // "100%" -> 100
        var a = hasAlpha ? (parseFloat(t[3]) || 0.0) : 1.0; // "1.0"  -> 1.0

        return [ h, s / 100, v / 100, a ];
    }
    return Color_parseHSVA( color.toLowerCase().replace(/\s+/g, "") ) || null;
}

function Color_HSVA_RGBA(hsva) { // @arg HSVANumberArray - [h, s, v, a]
                                 // @hsva.h Number - Hue        (0 - 360)
                                 // @hsva.s Percent - Saturation (0.0 - 1.0)
                                 // @hsva.v Percent - Value      (0.0 - 1.0)
                                 // @hsva.a Percent - alpha      (0.0 - 1.0)
                                 // @ret RGBANumberArray - [r, g, b, a]
                                 // @result.r Percent - Red   (0.0 - 1.0)
                                 // @result.g Percent - Green (0.0 - 1.0)
                                 // @result.b Percent - Blue  (0.0 - 1.0)
                                 // @result.a Percent - Alpha (0.0 - 1.0)
//{@dev
    $valid($type(hsva, "NumberArray"), Color_HSVA_RGBA, "hsva");
    $valid($type(hsva[0], "Number"),   Color_HSVA_RGBA, "hsva[0]");
    $valid($type(hsva[1], "Percent"),  Color_HSVA_RGBA, "hsva[1]");
    $valid($type(hsva[2], "Percent"),  Color_HSVA_RGBA, "hsva[2]");
    $valid($type(hsva[3], "Percent"),  Color_HSVA_RGBA, "hsva[3]");
//}@dev
    // http://www.rapidtables.com/convert/color/hsv-to-rgb.htm
    // http://gyazo.com/89cfc85e8f429638c16336f954c01a6e.png
    var h = hsva[0];
    var s = hsva[1];
    var v = hsva[2];
    var a = hsva[3];

    while (h < 0 || h > 360) {
        if (h < 0) {
            h += 360;
        } else {
            h -= 360;
        }
    }
    var c = v * s;
    var x = c * (1 - Math.abs((h / 60) % 2 - 1 ));
    var m = v - c;

    if (!s) { // short cut
        return [v, v, v, a];
    }

    c += m;
    x += m;
    switch (h / 60 | 0) {
    case 6:
    case 0: return [c, x, m, a];
    case 1: return [x, c, m, a];
    case 2: return [m, c, x, a];
    case 3: return [m, x, c, a];
    case 4: return [x, m, c, a];
    case 5: return [c, m, x, a];
    }
    return [0, 0, 0, a];
}

function Color_RGBA_HSVA(rgba) { // @arg RGBANumberArray - [r, g, b, a]
                                 // @rgba.r Percent - Red   (0.0 - 1.0)
                                 // @rgba.g Percent - Green (0.0 - 1.0)
                                 // @rgba.b Percent - Blue  (0.0 - 1.0)
                                 // @rgba.a Percent - Alpha (0.0 - 1.0);
                                 // @ret HSVANumberArray - [h, s, v, a]
                                 // @result.h Number Hue         (0 - 360)
                                 // @result.s Percent Saturation (0.0 - 1.0)
                                 // @result.v Percent Value      (0.0 - 1.0)
                                 // @result.a Percent Alpha      (0.0 - 1.0)
//{@dev
    $valid($type(rgba, "NumberArray"), Color_RGBA_HSVA, "rgba");
    $valid($type(rgba[0], "Percent"),  Color_RGBA_HSVA, "rgba[0]");
    $valid($type(rgba[1], "Percent"),  Color_RGBA_HSVA, "rgba[1]");
    $valid($type(rgba[2], "Percent"),  Color_RGBA_HSVA, "rgba[2]");
    $valid($type(rgba[3], "Percent"),  Color_RGBA_HSVA, "rgba[3]");
//}@dev
    // http://www.rapidtables.com/convert/color/rgb-to-hsv.htm
    // http://gyazo.com/63dc62af3e6936611e8a8cddf563fd36.png
    var r = rgba[0];
    var g = rgba[1];
    var b = rgba[2];
    var a = rgba[3];
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var delta = max - min;

    var h = 0;
    var s = 0;
    var v = max;

    if (max) {
        s = delta / max;
    }
    if (!s) { // avoid division by zero
        return [0, 0, v, a];
    }
    if (max === r) {
        h = (((g - b) / delta) % 6) * 60;
    } else if (max === g) {
        h = ((b - r) / delta + 2) * 60;
    } else if (max === b) {
        h = ((r - g) / delta + 4) * 60;
    }
    if (h < 0) {
        h += 360;
    }
    return [h, s, v, a];
}

// === YUVA ================================================
function Color_YUVA_RGBA(yuva) { // @arg YUVANumberArray - [y:Number, cb:Number, cr:Number, a:Percent]
                                 // @ret RGBANumberArray - [r:Percent, g:Percent, b:Percent, a:Percent]
//{@dev
    $valid($type(yuva, "YUVANumberArray"), Color_YUVA_RGBA, "yuva");
    $valid($type(yuva[0], "Number"),       Color_YUVA_RGBA, "yuva");
    $valid($type(yuva[1], "Number"),       Color_YUVA_RGBA, "yuva");
    $valid($type(yuva[2], "Number"),       Color_YUVA_RGBA, "yuva");
    $valid($type(yuva[3], "Percent"),      Color_YUVA_RGBA, "yuva");
//}@dev

    var y  = yuva[0];
    var cb = yuva[1];
    var cr = yuva[2];
    var a  = yuva[3];

    var r  = y + 1.402 * cr;
    var g  = y - 0.344136 * cb - 0.714136 * cr;
    var b  = y + 1.772 * cb;

    r = r < 0 ? 0 : r > 1 ? 1 : r;
    g = g < 0 ? 0 : g > 1 ? 1 : g;
    b = b < 0 ? 0 : b > 1 ? 1 : b;

    return [ r, g, b, a ];
}

function Color_RGBA_YUVA(rgba) { // @arg RGBANumberArray - [r:Percent, g:Percent, b:Percent, a:Percent]
                                 // @ret YUVANumberArray - [y:Number, cb:Number, cr:Number, a:Percent]
                                 // @desc ITU-R BT.601
                                 // y Number  - +0.0 - +1.0
                                 // cb Number - -0.5 - +0.5
                                 // cr Number - -0.5 - +0.5
//{@dev
    $valid($type(rgba, "RGBANumberArray"), Color_RGBA_YUVA, "rgba");
    $valid($type(rgba[0], "Percent"), Color_RGBA_YUVA, "rgba");
    $valid($type(rgba[1], "Percent"), Color_RGBA_YUVA, "rgba");
    $valid($type(rgba[2], "Percent"), Color_RGBA_YUVA, "rgba");
    $valid($type(rgba[3], "Percent"), Color_RGBA_YUVA, "rgba");
//}@dev

    var r  = rgba[0];
    var g  = rgba[1];
    var b  = rgba[2];
    var a  = rgba[3];

    var y  =  0.299    * r + 0.587    * g + 0.114    * b;
    var cb = -0.168736 * r - 0.331264 * g + 0.5      * b;
    var cr =  0.5      * r - 0.418688 * g - 0.081312 * b;

    return [ y, cb, cr, a ];
}

// --- validate / assertions -------------------------------
//{@dev
function $valid(val, fn, hint) { if (global["Valid"]) { global["Valid"](val, fn, hint); } }
function $type(obj, type) { return global["Valid"] ? global["Valid"].type(obj, type) : true; }
//function $keys(obj, str) { return global["Valid"] ? global["Valid"].keys(obj, str) : true; }
//function $some(val, str, ignore) { return global["Valid"] ? global["Valid"].some(val, str, ignore) : true; }
//function $args(fn, args) { if (global["Valid"]) { global["Valid"].args(fn, args); } }
//}@dev

// --- exports ---------------------------------------------
if ("process" in global) {
    module["exports"] = Color;
}
global["Color" in global ? "Color_" : "Color"] = Color; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule

