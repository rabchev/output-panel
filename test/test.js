/*jslint plusplus: true, devel: true, nomen: true, node: true, es5: true, indent: 4, maxerr: 50 */
/*global require, exports, module */

var Mocha   = require('mocha'),
    mocha   = new Mocha({
        ui: 'bdd',
        reporter: 'spec'
    }),
    path    = require("path");

mocha.addFile(path.join(__dirname, "unit-tests.js"));

mocha.run(function (failures) {
    "use strict";
    process.exit(failures);
});