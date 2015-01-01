var ModuleTestColor = (function(global) {

var _runOnNode = "process" in global;
var _runOnWorker = "WorkerLocation" in global;
var _runOnBrowser = "document" in global;

return new Test("Color", {
        disable:    false,
        browser:    true,
        worker:     true,
        node:       true,
        button:     true,
        both:       true, // test the primary module and secondary module
    }).add([
        testColor_parse,
        testColor_gray,
        testColor_sepia,
        testColor_reverse,

        testRGBA_HSLA,
        testHSLA_RGBA,
        testRGBA_HSVA,
        testHSVA_RGBA,

        testYUVA_codec,
    ]).run().clone();

function testColor_parse(test, pass, miss) {
    var results = {
        "0":  m( Color.parseRGBA("rgba( 255, 255, 255, 1.0) "),   [1, 1, 1, 1] ),
        "1":  m( Color.parseRGBA("RGBA(   0,   0,   0,   0) "),   [0, 0, 0, 0] ),
        "2":  m( Color.parseRGBA("rgb(127, 127, 127)"),           [0.5, 0.5, 0.5, 1.0]),

        "10": m( Color.parseHSLA("hsla( 360, 100%, 100%, 1.0) "), [360, 1, 1, 1] ),
        "11": m( Color.parseHSLA("HSLA(   0,   0,    0%, 0  ) "), [  0, 0, 0, 0] ),
        "12": m( Color.parseHSLA("hsl(100, 50%, 50%)"),           [100, 0.5, 0.5, 1.0]),

        "20": m( Color.parseHSVA("hsva( 360, 100%, 100%, 1.0) "), [360, 1, 1, 1] ),
        "21": m( Color.parseHSVA("HSVA(   0,   0,    0%, 0  ) "), [  0, 0, 0, 0] ),
        "22": m( Color.parseHSVA("hsv(100, 50%, 50%)"),           [100, 0.5, 0.5, 1.0]),

        "30": m( new Color("red").toArray(true),                  [1.0, 0.0, 0.0, 1.0]),
        "31": m( new Color("lime").toArray(true),                [0.0, 1.0, 0.0, 1.0]),
        "32": m( new Color("blue").toArray(true),                 [0.0, 0.0, 1.0, 1.0]),
    };
    function m(valueArray, validArray) {
        return valueArray.every(function(v, i) {
            return v.toFixed(2) === validArray[i].toFixed(2);
        });
    }

    var result = JSON.stringify(results, null, 2);
    console.log(result);

    if (/false/.test(result)) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testColor_gray(test, pass, miss) {
    var results = {
        "0": m( new Color([255,255,255, 1]).gray(), [255,255,255,1]),
        "1": m( new Color([  0,255,  0, 0]).gray(), [255,255,255,0]),
        "2": m( new Color([  0,  0,  0, 0]).gray(), [  0,  0,  0,0]),
    };
    function m(valueArray, validArray) {
        return valueArray.toArray().every(function(v, i) {
            return v.toFixed(2) === validArray[i].toFixed(2);
        });
    }

    var result = JSON.stringify(results, null, 2);
    console.log(result);

    if (/false/.test(result)) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testColor_sepia(test, pass, miss) {
    var rgba = new Color([255,255,255,1]).sepia();

    console.log(rgba);

    test.done(pass());
}

function testColor_reverse(test, pass, miss) {
    var results = {
        "0": m( new Color([255,255,255, 1]).reverse(), [  0,  0,  0,1]),
        "1": m( new Color([127,127,127, 0]).reverse(), [128,128,128,0]),
        "2": m( new Color([  0,  0,  0, 0]).reverse(), [255,255,255,0]),
    };
    function m(valueArray, validArray) {
        return valueArray.toArray().every(function(v, i) {
            return v.toFixed(2) === validArray[i].toFixed(2);
        });
    }

    var result = JSON.stringify(results, null, 2);
    console.log(result);

    if (/false/.test(result)) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testRGBA_HSLA(test, pass, miss) {
    var results = {
        "black":    m( Color.RGBA_HSLA( [  0,   0,   0, 1] ), [  0, 0, 0,   1] ),
        "white":    m( Color.RGBA_HSLA( [  1,   1,   1, 1] ), [  0, 0, 1,   1] ),
        "red":      m( Color.RGBA_HSLA( [  1,   0,   0, 1] ), [  0, 1, 0.5, 1] ),
        "lime":     m( Color.RGBA_HSLA( [  0,   1,   0, 1] ), [120, 1, 0.5, 1] ),
        "blue":     m( Color.RGBA_HSLA( [  0,   0,   1, 1] ), [240, 1, 0.5, 1] ),
        "yellow":   m( Color.RGBA_HSLA( [  1,   1,   0, 1] ), [ 60, 1, 0.5, 1] ),
        "cyan":     m( Color.RGBA_HSLA( [  0,   1,   1, 1] ), [180, 1, 0.5, 1] ),
        "magenta":  m( Color.RGBA_HSLA( [  1,   0,   1, 1] ), [300, 1, 0.5, 1] ),
        "silver":   m( Color.RGBA_HSLA( [0.75,0.75,0.75,1] ), [  0, 0, 0.75,1]),
        "gray":     m( Color.RGBA_HSLA( [0.5, 0.5, 0.5, 1] ), [  0, 0, 0.5, 1] ),
        "maroon":   m( Color.RGBA_HSLA( [0.5,   0,   0, 1] ), [  0, 1, 0.25,1] ),
        "olive":    m( Color.RGBA_HSLA( [0.5, 0.5,   0, 1] ), [ 60, 1, 0.25,1] ),
        "green":    m( Color.RGBA_HSLA( [  0, 0.5,   0, 1] ), [120, 1, 0.25,1] ),
        "purple":   m( Color.RGBA_HSLA( [0.5,   0, 0.5, 1] ), [300, 1, 0.25,1] ),
        "teal":     m( Color.RGBA_HSLA( [  0, 0.5, 0.5, 1] ), [180, 1, 0.25,1] ),
        "navy":     m( Color.RGBA_HSLA( [  0,   0, 0.5, 1] ), [240, 1, 0.25,1] ),
    };
    function m(valueArray, validArray) {
        return valueArray.every(function(v, i) {
            return v.toFixed(2) === validArray[i].toFixed(2);
        });
    }

    var result = JSON.stringify(results, null, 2);
    console.log(result);

    if (/false/.test(result)) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testHSLA_RGBA(test, pass, miss) {
    var results = {
        "black":    m( Color.HSLA_RGBA( [  0, 0, 0,   1] ), [  0,   0,   0, 1] ),
        "white":    m( Color.HSLA_RGBA( [  0, 0, 1,   1] ), [  1,   1,   1, 1] ),
        "red":      m( Color.HSLA_RGBA( [  0, 1, 0.5, 1] ), [  1,   0,   0, 1] ),
        "lime":     m( Color.HSLA_RGBA( [120, 1, 0.5, 1] ), [  0,   1,   0, 1] ),
        "blue":     m( Color.HSLA_RGBA( [240, 1, 0.5, 1] ), [  0,   0,   1, 1] ),
        "yellow":   m( Color.HSLA_RGBA( [ 60, 1, 0.5, 1] ), [  1,   1,   0, 1] ),
        "cyan":     m( Color.HSLA_RGBA( [180, 1, 0.5, 1] ), [  0,   1,   1, 1] ),
        "magenta":  m( Color.HSLA_RGBA( [300, 1, 0.5, 1] ), [  1,   0,   1, 1] ),
        "silver":   m( Color.HSLA_RGBA( [  0, 0, 0.75,1] ), [0.75,0.75,0.75,1] ),
        "gray":     m( Color.HSLA_RGBA( [  0, 0, 0.5, 1] ), [0.5, 0.5, 0.5, 1] ),
        "maroon":   m( Color.HSLA_RGBA( [  0, 1, 0.25,1] ), [0.5,   0,   0, 1] ),
        "olive":    m( Color.HSLA_RGBA( [ 60, 1, 0.25,1] ), [0.5, 0.5,   0, 1] ),
        "green":    m( Color.HSLA_RGBA( [120, 1, 0.25,1] ), [  0, 0.5,   0, 1] ),
        "purple":   m( Color.HSLA_RGBA( [300, 1, 0.25,1] ), [0.5,   0, 0.5, 1] ),
        "teal":     m( Color.HSLA_RGBA( [180, 1, 0.25,1] ), [  0, 0.5, 0.5, 1] ),
        "navy":     m( Color.HSLA_RGBA( [240, 1, 0.25,1] ), [  0,   0, 0.5, 1] ),
    };
    function m(valueArray, validArray) {
        return valueArray.every(function(v, i) {
            return v.toFixed(2) === validArray[i].toFixed(2);
        });
    }

    var result = JSON.stringify(results, null, 2);
    console.log(result);

    if (/false/.test(result)) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testRGBA_HSVA(test, pass, miss) {
    var results = {
        "black":    m( Color.RGBA_HSVA( [  0,   0,   0, 1] ), [  0, 0, 0,   1] ),
        "white":    m( Color.RGBA_HSVA( [  1,   1,   1, 1] ), [  0, 0, 1,   1] ),
        "red":      m( Color.RGBA_HSVA( [  1,   0,   0, 1] ), [  0, 1, 1,   1] ),
        "lime":     m( Color.RGBA_HSVA( [  0,   1,   0, 1] ), [120, 1, 1,   1] ),
        "blue":     m( Color.RGBA_HSVA( [  0,   0,   1, 1] ), [240, 1, 1,   1] ),
        "yellow":   m( Color.RGBA_HSVA( [  1,   1,   0, 1] ), [ 60, 1, 1,   1] ),
        "cyan":     m( Color.RGBA_HSVA( [  0,   1,   1, 1] ), [180, 1, 1,   1] ),
        "magenta":  m( Color.RGBA_HSVA( [  1,   0,   1, 1] ), [300, 1, 1,   1] ),
        "silver":   m( Color.RGBA_HSVA( [0.75,0.75,0.75,1] ), [  0, 0, 0.75,1]),
        "gray":     m( Color.RGBA_HSVA( [0.5, 0.5, 0.5, 1] ), [  0, 0, 0.5, 1] ),
        "maroon":   m( Color.RGBA_HSVA( [0.5,   0,   0, 1] ), [  0, 1, 0.5, 1] ),
        "olive":    m( Color.RGBA_HSVA( [0.5, 0.5,   0, 1] ), [ 60, 1, 0.5, 1] ),
        "green":    m( Color.RGBA_HSVA( [  0, 0.5,   0, 1] ), [120, 1, 0.5, 1] ),
        "purple":   m( Color.RGBA_HSVA( [0.5,   0, 0.5, 1] ), [300, 1, 0.5, 1] ),
        "teal":     m( Color.RGBA_HSVA( [  0, 0.5, 0.5, 1] ), [180, 1, 0.5, 1] ),
        "navy":     m( Color.RGBA_HSVA( [  0,   0, 0.5, 1] ), [240, 1, 0.5, 1] ),
    };
    function m(valueArray, validArray) {
        return valueArray.every(function(v, i) {
            return v.toFixed(2) === validArray[i].toFixed(2);
        });
    }

    var result = JSON.stringify(results, null, 2);
    console.log(result);

    if (/false/.test(result)) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testHSVA_RGBA(test, pass, miss) {
    var results = {
        "black":    m( Color.HSVA_RGBA( [  0, 0, 0,   1] ), [  0,   0,   0, 1] ),
        "white":    m( Color.HSVA_RGBA( [  0, 0, 1,   1] ), [  1,   1,   1, 1] ),
        "red":      m( Color.HSVA_RGBA( [  0, 1, 1,   1] ), [  1,   0,   0, 1] ),
        "lime":     m( Color.HSVA_RGBA( [120, 1, 1,   1] ), [  0,   1,   0, 1] ),
        "blue":     m( Color.HSVA_RGBA( [240, 1, 1,   1] ), [  0,   0,   1, 1] ),
        "yellow":   m( Color.HSVA_RGBA( [ 60, 1, 1,   1] ), [  1,   1,   0, 1] ),
        "cyan":     m( Color.HSVA_RGBA( [180, 1, 1,   1] ), [  0,   1,   1, 1] ),
        "magenta":  m( Color.HSVA_RGBA( [300, 1, 1,   1] ), [  1,   0,   1, 1] ),
        "silver":   m( Color.HSVA_RGBA( [  0, 0, 0.75,1] ), [0.75,0.75,0.75,1] ),
        "gray":     m( Color.HSVA_RGBA( [  0, 0, 0.5, 1] ), [0.5, 0.5, 0.5, 1] ),
        "maroon":   m( Color.HSVA_RGBA( [  0, 1, 0.5, 1] ), [0.5,   0,   0, 1] ),
        "olive":    m( Color.HSVA_RGBA( [ 60, 1, 0.5, 1] ), [0.5, 0.5,   0, 1] ),
        "green":    m( Color.HSVA_RGBA( [120, 1, 0.5, 1] ), [  0, 0.5,   0, 1] ),
        "purple":   m( Color.HSVA_RGBA( [300, 1, 0.5, 1] ), [0.5,   0, 0.5, 1] ),
        "teal":     m( Color.HSVA_RGBA( [180, 1, 0.5, 1] ), [  0, 0.5, 0.5, 1] ),
        "navy":     m( Color.HSVA_RGBA( [240, 1, 0.5, 1] ), [  0,   0, 0.5, 1] ),
    };
    function m(valueArray, validArray) {
        return valueArray.every(function(v, i) {
            return v.toFixed(2) === validArray[i].toFixed(2);
        });
    }

    var result = JSON.stringify(results, null, 2);
    console.log(result);

    if (/false/.test(result)) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testYUVA_codec(test, pass, miss) {

    var source = [1,1,1,1];
    var yuva = Color.RGBA_YUVA(source);
    var rgba = Color.YUVA_RGBA(yuva);

    if (source[0].toFixed(2) === rgba[0].toFixed(2) &&
        source[1].toFixed(2) === rgba[1].toFixed(2) &&
        source[2].toFixed(2) === rgba[2].toFixed(2) &&
        source[3].toFixed(2) === rgba[3].toFixed(2)) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

})((this || 0).self || global);

