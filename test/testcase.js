var ModuleTestColor = (function(global) {

global["BENCHMARK"] = false;

var test = new Test("Color", {
        disable:    false, // disable all tests.
        browser:    true,  // enable browser test.
        worker:     true,  // enable worker test.
        node:       true,  // enable node test.
        nw:         true,  // enable nw.js test.
        button:     true,  // show button.
        both:       true,  // test the primary and secondary modules.
        ignoreError:false, // ignore error.
        callback:   function() {
        },
        errorback:  function(error) {
        }
    }).add([
        testColor_getter,
        testColor_parse,
        testColor_toString,
        testColor_RGBA,
        testColor_HSLA,
        testColor_HSVA,
        testColor_YUVA,
        testColor_effect,
    ]);

if (IN_BROWSER || IN_NW) {
    test.add([
        // browser and node-webkit test
    ]);
} else if (IN_WORKER) {
    test.add([
        // worker test
    ]);
} else if (IN_NODE) {
    test.add([
        // node.js and io.js test
    ]);
}

// --- test cases ------------------------------------------
function testColor_getter(test, pass, miss) {
    var results = [
        new Color("red").R === 255,
        new Color("lime").G === 255,
        new Color("blue").B === 255,
        new Color("white").A === 255,
        new Color("transparent").A === 0,
        new Color("red").r === 1.0,
        new Color("lime").g === 1.0,
        new Color("blue").b === 1.0,
        new Color("white").a === 1.0,
        new Color("transparent").a === 0,
    ];

    var result = JSON.stringify(results, null, 2);
    console.log(result);

    if (/false/.test(result)) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testColor_parse(test, pass, miss) {
    var results = [
        m( new Color("rgba( 255, 255, 255, 1.0) ").RGBA,   [255, 255, 255, 255] ),
        m( new Color("RGBA(   0,   0,   0,   0) ").RGBA,   [  0,   0,   0,   0] ),
        m( new Color("rgb(127, 127, 127)").RGBA,           [127, 127, 127, 255] ),

        m( new Color("hsla( 360, 100%, 100%, 1.0) ").RGBA, [255, 255, 255, 255] ),
        m( new Color("HSLA(   0,   0,    0%, 0  ) ").RGBA, [  0,   0,   0,   0] ),
        m( new Color("hsl(100, 50%, 50%)").RGBA,           [106, 191,  64, 255] ),

        m( new Color("hsva( 360, 100%, 100%, 1.0) ").RGBA, [255,   0,   0, 255] ),
        m( new Color("HSVA(   0,   0,    0%, 0  ) ").RGBA, [  0,   0,   0,   0] ),
        m( new Color("hsv(100, 50%, 50%)").RGBA,           [ 85, 128,  64, 255] ),

        m( new Color("red").RGBA,                          [255,   0,   0, 255]),
        m( new Color("lime").RGBA,                         [  0, 255,   0, 255]),
        m( new Color("blue").RGBA,                         [  0,   0, 255, 255]),
    ];
    function m(valueArray, validArray) {
        return [].slice.call(valueArray).every(function(v, i) {
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

function testColor_toString(test, pass, miss) {
    var results = [
        new Color("rgba( 255, 255, 255, 0.05)  ").toString("#rrggbb") === "#ffffff",
        new Color("rgba( 255, 255, 255, 0.05)  ").toString("rgba") === "rgba(255,255,255,0.05)",
        new Color("rgba( 255, 255, 255, 0.05)  ").toString("hsla") === "hsla(0,0%,100%,0.05)",
        new Color("rgba( 255, 255, 255, 0.05)  ").toString("hsva") === "hsva(0,0%,100%,0.05)",
        new Color(new Color("hsva(0,0%,100%,0.05)").toString("hsva")).toString() === "rgba(255,255,255,0.05)",
        new Color(new Color("hsla(0,0%,100%,0.05)").toString("hsla")).toString() === "rgba(255,255,255,0.05)",
        new Color("rgba( 255, 255, 255, 0.05)  ").toString() === "rgba(255,255,255,0.05)",
        new Color("rgba( 255, 255, 255, 0.1)   ").toString() === "rgba(255,255,255,0.10)",
        new Color("rgba( 255, 255, 255, 0.128) ").toString() === "rgba(255,255,255,0.13)",
        new Color("rgba( 255, 255, 255, 0.2)   ").toString() === "rgba(255,255,255,0.20)",
        new Color("rgba( 255, 255, 255, 0.21)  ").toString() === "rgba(255,255,255,0.21)",
        new Color("rgba( 255, 255, 255, 0.25)  ").toString() === "rgba(255,255,255,0.25)",
        new Color("rgba( 255, 255, 255, 0.499) ").toString() === "rgba(255,255,255,0.50)",
        new Color("RGBA(   0,   0,   0,   0)   ").toString() === "rgba(0,0,0,0.00)",
        new Color("rgb(127, 127, 127)          ").toString() === "rgba(127,127,127,1.00)",
        new Color("rgb(127, 127, 127)          ").toString() === "rgba(127,127,127,1.00)",
    ];
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

function testColor_RGBA(test, pass, miss) {
    var results = {
        "black":    m( new Color( "black"   ).RGBA, [   0,    0,    0, 255] ),
        "white":    m( new Color( "white"   ).RGBA, [ 255,  255,  255, 255] ),
        "red":      m( new Color( "red"     ).RGBA, [ 255,    0,    0, 255] ),
        "lime":     m( new Color( "lime"    ).RGBA, [   0,  255,    0, 255] ),
        "blue":     m( new Color( "blue"    ).RGBA, [   0,    0,  255, 255] ),
        "yellow":   m( new Color( "yellow"  ).RGBA, [ 255,  255,    0, 255] ),
        "cyan":     m( new Color( "cyan"    ).RGBA, [   0,  255,  255, 255] ),
        "magenta":  m( new Color( "magenta" ).RGBA, [ 255,    0,  255, 255] ),
        "silver":   m( new Color( "silver"  ).RGBA, [ 192,  192,  192, 255] ),
        "gray":     m( new Color( "gray"    ).RGBA, [ 128,  128,  128, 255] ),
        "maroon":   m( new Color( "maroon"  ).RGBA, [ 128,    0,    0, 255] ),
        "olive":    m( new Color( "olive"   ).RGBA, [ 128,  128,    0, 255] ),
        "green":    m( new Color( "green"   ).RGBA, [   0,  128,    0, 255] ),
        "purple":   m( new Color( "purple"  ).RGBA, [ 128,    0,  128, 255] ),
        "teal":     m( new Color( "teal"    ).RGBA, [   0,  128,  128, 255] ),
        "navy":     m( new Color( "navy"    ).RGBA, [   0,    0,  128, 255] ),
    };
    function m(valueArray, validArray) {
        return [].slice.call(valueArray).every(function(v, i) {
            if (v.toFixed(2) === validArray[i].toFixed(2)) {
                return true;
            } else {
                console.error(v, validArray[i]);
                return false;
            }
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

function testColor_HSLA(test, pass, miss) {
    var results = {
        "black":    m( Color.HSLA_RGBA( Color.RGBA_HSLA( new Uint8ClampedArray( [   0,    0,    0, 255] ) ) ), [   0,    0,    0, 255] ),
        "white":    m( Color.HSLA_RGBA( Color.RGBA_HSLA( new Uint8ClampedArray( [ 255,  255,  255, 255] ) ) ), [ 255,  255,  255, 255] ),
        "red":      m( Color.HSLA_RGBA( Color.RGBA_HSLA( new Uint8ClampedArray( [ 255,    0,    0, 255] ) ) ), [ 255,    0,    0, 255] ),
        "lime":     m( Color.HSLA_RGBA( Color.RGBA_HSLA( new Uint8ClampedArray( [   0,  255,    0, 255] ) ) ), [   0,  255,    0, 255] ),
        "blue":     m( Color.HSLA_RGBA( Color.RGBA_HSLA( new Uint8ClampedArray( [   0,    0,  255, 255] ) ) ), [   0,    0,  255, 255] ),
        "yellow":   m( Color.HSLA_RGBA( Color.RGBA_HSLA( new Uint8ClampedArray( [ 255,  255,    0, 255] ) ) ), [ 255,  255,    0, 255] ),
        "cyan":     m( Color.HSLA_RGBA( Color.RGBA_HSLA( new Uint8ClampedArray( [   0,  255,  255, 255] ) ) ), [   0,  255,  255, 255] ),
        "magenta":  m( Color.HSLA_RGBA( Color.RGBA_HSLA( new Uint8ClampedArray( [ 255,    0,  255, 255] ) ) ), [ 255,    0,  255, 255] ),
        "silver":   m( Color.HSLA_RGBA( Color.RGBA_HSLA( new Uint8ClampedArray( [ 192,  192,  192, 255] ) ) ), [ 192,  192,  192, 255] ),
        "gray":     m( Color.HSLA_RGBA( Color.RGBA_HSLA( new Uint8ClampedArray( [ 127,  127,  127, 255] ) ) ), [ 127,  127,  127, 255] ),
        "maroon":   m( Color.HSLA_RGBA( Color.RGBA_HSLA( new Uint8ClampedArray( [ 127,    0,    0, 255] ) ) ), [ 127,    0,    0, 255] ),
        "olive":    m( Color.HSLA_RGBA( Color.RGBA_HSLA( new Uint8ClampedArray( [ 127,  127,    0, 255] ) ) ), [ 127,  127,    0, 255] ),
        "green":    m( Color.HSLA_RGBA( Color.RGBA_HSLA( new Uint8ClampedArray( [   0,  127,    0, 255] ) ) ), [   0,  127,    0, 255] ),
        "purple":   m( Color.HSLA_RGBA( Color.RGBA_HSLA( new Uint8ClampedArray( [ 127,    0,  127, 255] ) ) ), [ 127,    0,  127, 255] ),
        "teal":     m( Color.HSLA_RGBA( Color.RGBA_HSLA( new Uint8ClampedArray( [   0,  127,  127, 255] ) ) ), [   0,  127,  127, 255] ),
        "navy":     m( Color.HSLA_RGBA( Color.RGBA_HSLA( new Uint8ClampedArray( [   0,    0,  127, 255] ) ) ), [   0,    0,  127, 255] ),
    };
    function m(valueArray, validArray) {
        return [].slice.call(valueArray).every(function(v, i) {
            if (v.toFixed(2) === validArray[i].toFixed(2)) {
                return true;
            } else {
                console.error(v, validArray[i]);
                return false;
            }
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

function testColor_HSVA(test, pass, miss) {
    var results1 = {
        "black":    m( Color.RGBA_HSVA( new Uint8ClampedArray( [   0,    0,    0, 255] ) ), [   0,   0,   0,    255] ),
        "white":    m( Color.RGBA_HSVA( new Uint8ClampedArray( [ 255,  255,  255, 255] ) ), [   0,   0,   1,    255] ),
        "red":      m( Color.RGBA_HSVA( new Uint8ClampedArray( [ 255,    0,    0, 255] ) ), [   0,   1,   1,    255] ),
        "lime":     m( Color.RGBA_HSVA( new Uint8ClampedArray( [   0,  255,    0, 255] ) ), [ 120,   1,   1,    255] ),
        "blue":     m( Color.RGBA_HSVA( new Uint8ClampedArray( [   0,    0,  255, 255] ) ), [ 240,   1,   1,    255] ),
        "yellow":   m( Color.RGBA_HSVA( new Uint8ClampedArray( [ 255,  255,    0, 255] ) ), [  60,   1,   1,    255] ),
        "cyan":     m( Color.RGBA_HSVA( new Uint8ClampedArray( [   0,  255,  255, 255] ) ), [ 180,   1,   1,    255] ),
        "magenta":  m( Color.RGBA_HSVA( new Uint8ClampedArray( [ 255,    0,  255, 255] ) ), [ 300,   1,   1,    255] ),
        "silver":   m( Color.RGBA_HSVA( new Uint8ClampedArray( [ 192,  192,  192, 255] ) ), [   0,   0,   0.75, 255] ),
        "gray":     m( Color.RGBA_HSVA( new Uint8ClampedArray( [ 127,  127,  127, 255] ) ), [   0,   0,   0.5,  255] ),
        "maroon":   m( Color.RGBA_HSVA( new Uint8ClampedArray( [ 127,    0,    0, 255] ) ), [   0,   1,   0.5,  255] ),
        "olive":    m( Color.RGBA_HSVA( new Uint8ClampedArray( [ 127,  127,    0, 255] ) ), [  60,   1,   0.5,  255] ),
        "green":    m( Color.RGBA_HSVA( new Uint8ClampedArray( [   0,  127,    0, 255] ) ), [ 120,   1,   0.5,  255] ),
        "purple":   m( Color.RGBA_HSVA( new Uint8ClampedArray( [ 127,    0,  127, 255] ) ), [ 300,   1,   0.5,  255] ),
        "teal":     m( Color.RGBA_HSVA( new Uint8ClampedArray( [   0,  127,  127, 255] ) ), [ 180,   1,   0.5,  255] ),
        "navy":     m( Color.RGBA_HSVA( new Uint8ClampedArray( [   0,    0,  127, 255] ) ), [ 240,   1,   0.5,  255] ),
    };
    var results2 = {
        "black":    m( Color.HSVA_RGBA( Color.RGBA_HSVA( new Uint8ClampedArray( [   0,    0,    0, 255] ) ) ), [   0,    0,    0, 255] ),
        "white":    m( Color.HSVA_RGBA( Color.RGBA_HSVA( new Uint8ClampedArray( [ 255,  255,  255, 255] ) ) ), [ 255,  255,  255, 255] ),
        "red":      m( Color.HSVA_RGBA( Color.RGBA_HSVA( new Uint8ClampedArray( [ 255,    0,    0, 255] ) ) ), [ 255,    0,    0, 255] ),
        "lime":     m( Color.HSVA_RGBA( Color.RGBA_HSVA( new Uint8ClampedArray( [   0,  255,    0, 255] ) ) ), [   0,  255,    0, 255] ),
        "blue":     m( Color.HSVA_RGBA( Color.RGBA_HSVA( new Uint8ClampedArray( [   0,    0,  255, 255] ) ) ), [   0,    0,  255, 255] ),
        "yellow":   m( Color.HSVA_RGBA( Color.RGBA_HSVA( new Uint8ClampedArray( [ 255,  255,    0, 255] ) ) ), [ 255,  255,    0, 255] ),
        "cyan":     m( Color.HSVA_RGBA( Color.RGBA_HSVA( new Uint8ClampedArray( [   0,  255,  255, 255] ) ) ), [   0,  255,  255, 255] ),
        "magenta":  m( Color.HSVA_RGBA( Color.RGBA_HSVA( new Uint8ClampedArray( [ 255,    0,  255, 255] ) ) ), [ 255,    0,  255, 255] ),
        "silver":   m( Color.HSVA_RGBA( Color.RGBA_HSVA( new Uint8ClampedArray( [ 192,  192,  192, 255] ) ) ), [ 192,  192,  192, 255] ),
        "gray":     m( Color.HSVA_RGBA( Color.RGBA_HSVA( new Uint8ClampedArray( [ 127,  127,  127, 255] ) ) ), [ 127,  127,  127, 255] ),
        "maroon":   m( Color.HSVA_RGBA( Color.RGBA_HSVA( new Uint8ClampedArray( [ 127,    0,    0, 255] ) ) ), [ 127,    0,    0, 255] ),
        "olive":    m( Color.HSVA_RGBA( Color.RGBA_HSVA( new Uint8ClampedArray( [ 127,  127,    0, 255] ) ) ), [ 127,  127,    0, 255] ),
        "green":    m( Color.HSVA_RGBA( Color.RGBA_HSVA( new Uint8ClampedArray( [   0,  127,    0, 255] ) ) ), [   0,  127,    0, 255] ),
        "purple":   m( Color.HSVA_RGBA( Color.RGBA_HSVA( new Uint8ClampedArray( [ 127,    0,  127, 255] ) ) ), [ 127,    0,  127, 255] ),
        "teal":     m( Color.HSVA_RGBA( Color.RGBA_HSVA( new Uint8ClampedArray( [   0,  127,  127, 255] ) ) ), [   0,  127,  127, 255] ),
        "navy":     m( Color.HSVA_RGBA( Color.RGBA_HSVA( new Uint8ClampedArray( [   0,    0,  127, 255] ) ) ), [   0,    0,  127, 255] ),
    };
    function m(valueArray, validArray) {
        return [].slice.call(valueArray).every(function(v, i) {
            if (v.toFixed(2) === validArray[i].toFixed(2)) {
                return true;
            } else {
                console.error(v, validArray[i]);
                return false;
            }
        });
    }

    var result = JSON.stringify(results1, null, 2) + JSON.stringify(results2, null, 2);
    console.log(result);

    if (/false/.test(result)) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testColor_YUVA(test, pass, miss) {
    var results = {
        "black":    m( Color.YUVA_RGBA( Color.RGBA_YUVA( new Uint8ClampedArray( [   0,    0,    0, 255] ) ) ), [   0,    0,    0, 255] ),
        "white":    m( Color.YUVA_RGBA( Color.RGBA_YUVA( new Uint8ClampedArray( [ 255,  255,  255, 255] ) ) ), [ 255,  255,  255, 255] ),
        "red":      m( Color.YUVA_RGBA( Color.RGBA_YUVA( new Uint8ClampedArray( [ 255,    0,    0, 255] ) ) ), [ 255,    0,    0, 255] ),
        "lime":     m( Color.YUVA_RGBA( Color.RGBA_YUVA( new Uint8ClampedArray( [   0,  255,    0, 255] ) ) ), [   0,  255,    0, 255] ),
        "blue":     m( Color.YUVA_RGBA( Color.RGBA_YUVA( new Uint8ClampedArray( [   0,    0,  255, 255] ) ) ), [   0,    0,  255, 255] ),
        "yellow":   m( Color.YUVA_RGBA( Color.RGBA_YUVA( new Uint8ClampedArray( [ 255,  255,    0, 255] ) ) ), [ 255,  255,    0, 255] ),
        "cyan":     m( Color.YUVA_RGBA( Color.RGBA_YUVA( new Uint8ClampedArray( [   0,  255,  255, 255] ) ) ), [   0,  255,  255, 255] ),
        "magenta":  m( Color.YUVA_RGBA( Color.RGBA_YUVA( new Uint8ClampedArray( [ 255,    0,  255, 255] ) ) ), [ 255,    0,  255, 255] ),
        "silver":   m( Color.YUVA_RGBA( Color.RGBA_YUVA( new Uint8ClampedArray( [ 192,  192,  192, 255] ) ) ), [ 192,  192,  192, 255] ),
        "gray":     m( Color.YUVA_RGBA( Color.RGBA_YUVA( new Uint8ClampedArray( [ 127,  127,  127, 255] ) ) ), [ 127,  127,  127, 255] ),
        "maroon":   m( Color.YUVA_RGBA( Color.RGBA_YUVA( new Uint8ClampedArray( [ 127,    0,    0, 255] ) ) ), [ 127,    0,    0, 255] ),
        "olive":    m( Color.YUVA_RGBA( Color.RGBA_YUVA( new Uint8ClampedArray( [ 127,  127,    0, 255] ) ) ), [ 127,  127,    0, 255] ),
        "green":    m( Color.YUVA_RGBA( Color.RGBA_YUVA( new Uint8ClampedArray( [   0,  127,    0, 255] ) ) ), [   0,  127,    0, 255] ),
        "purple":   m( Color.YUVA_RGBA( Color.RGBA_YUVA( new Uint8ClampedArray( [ 127,    0,  127, 255] ) ) ), [ 127,    0,  127, 255] ),
        "teal":     m( Color.YUVA_RGBA( Color.RGBA_YUVA( new Uint8ClampedArray( [   0,  127,  127, 255] ) ) ), [   0,  127,  127, 255] ),
        "navy":     m( Color.YUVA_RGBA( Color.RGBA_YUVA( new Uint8ClampedArray( [   0,    0,  127, 255] ) ) ), [   0,    0,  127, 255] ),
    };
    function m(valueArray, validArray) {
        return [].slice.call(valueArray).every(function(v, i) {
            var v  = parseFloat(v.toFixed(2));
            var vv = parseFloat(validArray[i].toFixed(2));

            if (v - 1 <= vv && v + 1 >= vv) { // ±1 point
                return true;
            } else {
                console.error(v, vv);
                return false;
            }
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

function testColor_effect(test, pass, miss) {
    var results = [
        m( Color.sepia(  new Uint8ClampedArray( [128, 60,255,255, 128, 62,255,255]) ), [123,100, 61,255, 124,102, 63,255]),
        m( Color.gray(   new Uint8ClampedArray( [128, 60,255,255, 128, 62,255,255]) ), [ 60, 60, 60,255,  62, 62, 62,255]),
        m( Color.reverse(new Uint8ClampedArray( [255,255,255,255                 ]) ), [  0,  0,  0,255]),
        m( Color.reverse(new Uint8ClampedArray( [127,127,127,  0                 ]) ), [128,128,128,  0]),
        m( Color.reverse(new Uint8ClampedArray( [  0,  0,  0,  0                 ]) ), [255,255,255,  0]),
        m( Color.effect( new Uint8ClampedArray( [128,255,255,  0] ), [120,0,0,0]    ), [255,128,255,  0]),
        m( Color.effect( new Uint8ClampedArray( [128,255,255,  0] ), [240,0,0,0]    ), [255,255,128,  0]),
        m( Color.effect( new Uint8ClampedArray( [128,255,255,  0] ), [360,0,0,0]    ), [128,255,255,  0]),
        m( Color.effect( new Uint8ClampedArray( [128,255,255,  0] ), [120,0.5,0,0]  ), [255,128,255,  0]),
        m( Color.effect( new Uint8ClampedArray( [128,255,255,  0] ), [120,-0.5,0,0] ), [223,160,223,  0]),
    ];
    function m(valueArray, validArray) {
        return [].slice.call(valueArray).every(function(v, i) {
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

return test.run();

})(GLOBAL);

