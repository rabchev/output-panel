/*jslint vars: true, plusplus: true, devel: true, nomen: true, browser: true, regexp: true, indent: 4, maxerr: 50 */
/*global require, define, $ */

// Since jsdom doesn't work with requirejs we have to mock it.

var mockCache = {},
    currentlyAdding;

function loadModule(url) {
    "use strict";
    
}

function loadText(url) {
    "use strict";
    
}

window.define = function (definition) {
    "use strict";
    
    var exports     = {},
        module      = {
            name: currentlyAdding,
            exports: exports
        };
    currentlyAdding = null;
    
    if (typeof definition === "function") {
        definition(window.require, exports, module);
    } else {
        module.exports = definition;
    }
    mockCache[module.name] = module;
};
    
window.require = function (moduleName) {
    "use strict";
    
    var module = mockCache[moduleName];
    if (module) {
        return module.exports;
    }
    
    currentlyAdding = moduleName;
    switch (moduleName) {
    case "view/PanelManager":
        window.define({
        
        });
        break;
    case "widgets/Dialogs":
        window.define({
        
        });
        break;
    case "preferences/PreferencesManager":
        window.define({
        
        });
        break;
    case "utils/ExtensionUtils":
        window.define({
        
        });
        break;
    case "strings":
        loadModule("../nls/root/strings.js");
        break;
    case "text!./panel.html":
        loadText("panel.html");
        break;
    case "text!./options.html":
        loadText("options.html");
        break;
    }
};

window.brackets = {
    getModule: function (moduleName) {
        "use strict";
        
        return window.require(moduleName);
    }
};

