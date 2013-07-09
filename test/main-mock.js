/*jslint vars: true, plusplus: true, devel: true, nomen: true, browser: true, regexp: true, indent: 4, maxerr: 50 */
/*global define */

define(function (require, exports, module) {
    "use strict";
    
    // brackets mock
    var brackets = {
        getModule: function (moduleName) {
            return {};
        }
    };
    
    window.brackets = brackets;
    
    // Load output-panel extesion
    //window.output = require("../main");
});