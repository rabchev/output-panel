/*jslint vars: true, plusplus: true, devel: true, nomen: true, browser: true, regexp: true, indent: 4, maxerr: 50 */
/*global require */

// mock Brackets
window.brackets = {
    getModule: function (moduleName) {
        "use strict";
        return {};
    }
};

require.config({
    baseUrl: "http://" + window.location.host
});
    
// Load output-panel extesion
window.output = require(["./main.js"]);