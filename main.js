/*jslint vars: true, plusplus: true, devel: true, nomen: true, browser: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, $, PathUtils, _toggleVisibility */

define(function (require, exports, module) {
    "use strict";
    
    var PanelManager        = brackets.getModule("view/PanelManager"),
        ExtensionUtils      = brackets.getModule("utils/ExtensionUtils");
    
    var panelHTML           = require("text!panel.html");
    
    var $icon,
        $iframe;
    
    var panel,
        visible = false,
        realVisibility = false;
    
    function _resizeIframe() {
        if (visible && $iframe) {
            var iframeWidth = panel.$panel.innerWidth();
            $iframe.attr("width", iframeWidth + "px");
        }
    }
    
    function _setPanelVisibility(isVisible) {
        if (isVisible === realVisibility) {
            return;
        }
        
        realVisibility = isVisible;
        if (isVisible) {
            if (!panel) {
                var $panel = $(panelHTML),
                    $close = $panel.find(".close");
                
                $iframe = $panel.find("#output-panel-frame");
                
                panel = PanelManager.createBottomPanel("output-panel", $panel);
                $panel.on("panelResizeUpdate", function (e, newSize) {
                    $iframe.attr("height", newSize);
                });
                $iframe.attr("height", $panel.height());
                
                $close.click(function () {
                    _toggleVisibility();
                });

                window.setTimeout(_resizeIframe);
            }
            
            $icon.toggleClass("active");
            panel.show();
        } else {
            $icon.toggleClass("active");
            panel.hide();
        }
    }
    
    function _toggleVisibility() {
        visible = !visible;
        _setPanelVisibility(visible);
    }
    
    // Insert CSS for this extension
    ExtensionUtils.loadStyleSheet(module, "panel.css");
    
    // Add toolbar icon 
    $icon = $("<a>")
        .attr({
            id: "output-panel-icon",
            href: "#",
            title: "Output Panel"
        })
        .click(_toggleVisibility)
        .insertAfter($("#toolbar-go-live"));
    
    // Listen for resize events
    $(PanelManager).on("editorAreaResize", _resizeIframe);
    $("#sidebar").on("panelCollapsed panelExpanded panelResizeUpdate", _resizeIframe);
});