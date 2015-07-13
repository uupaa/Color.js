// Color test

require("../lib/WebModule.js");

//publish to global. eg: window.WebModule.Class -> window.Class
WebModule.publish = true;


require("./wmtools.js");
require("../lib/ColorCatalog.js");
require("../lib/Color.js");
require("../release/Color.n.min.js");
require("./testcase.js");

