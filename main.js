/*jslint vars: true, plusplus: true, devel: true, nomen: true, browser: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, $, PathUtils, _toggleVisibility */

define(function (require, exports, module) {
    "use strict";
    
    var PanelManager        = brackets.getModule("view/PanelManager"),
        ExtensionUtils      = brackets.getModule("utils/ExtensionUtils");
    
    var panelHTML           = require("text!./panel.html");
    
    var $icon,
        $iframe,
        $document,
        $content,
        $toolbar;
    
    var panel,
        linesCount          = 0,
        visible             = false,
        realVisibility      = false;
    
    function _resizeIframe() {
        if (visible && $iframe) {
            var iframeWidth = panel.$panel.innerWidth();
            $iframe.attr("width", iframeWidth + "px");
        }
    }
    
    function _init() {
        if (!panel) {
            var $panel = $(panelHTML),
                $close = $panel.find(".close"),
                htmlSource;
            
            htmlSource = "<html><head>";
            htmlSource += "<link href='" + require.toUrl("./output.css") + "' rel='stylesheet'></link>";
            htmlSource += "</head><body>";
            htmlSource += "</body></html>";
            
            $iframe = $panel.find("#output-panel-frame");
            $iframe.attr("srcdoc", htmlSource);
            
            $toolbar = $panel.find(".toolbar");
            
            panel = PanelManager.createBottomPanel("output-panel", $panel);
            $panel.on("panelResizeUpdate", function (e, newSize) {
                $iframe.attr("height", newSize - $toolbar.height());
            });
            $iframe.attr("height", $panel.height() - $toolbar.height());
            
            $close.click(function () {
                _toggleVisibility();
            });

            $document = $($iframe.contents()[0]);
            $content = $document.find("body");
            
            window.setTimeout(_resizeIframe);
        }
    }
    
    function _setPanelVisibility(isVisible) {
        if (isVisible === realVisibility) {
            return;
        }
        
        realVisibility = isVisible;
        if (isVisible) {
            _init();
            
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
    
    exports.log = function (sender, message) {
        var $p,
            $first;
        
        _init();
        
        if (!message) {
            message = sender;
            sender = "Undefined";
        }
        
        if (!message) {
            message = "";
        }
        
        if (typeof message === "string") {
            if (linesCount >= exports.maxLines) {
                $first = $content.find("#ln" + (linesCount - exports.maxLines));
                if ($first.length > 0) {
                    $first.remove();
                }
            }
            
            linesCount++;
            $p = $("<p>", {
                id          : "ln" + linesCount,
                "class"     : sender
            });
            $content.append($p);
            $p.append(message);
            $content.animate({ scrollTop: $document.height() }, "slow");
        }
    };
    
    exports.clear = function () {
        if ($content) {
            $content.empty();
            linesCount = 0;
        }
    };
    
    exports.setVisibility = function (isVisible) {
        if (typeof isVisible === "boolean" && isVisible !== visible) {
            _toggleVisibility();
        }
    };
    
    exports.isVisible = function () {
        return realVisibility;
    };
    
    exports.toggleVisibility = _toggleVisibility;
    exports.maxLines = 1000;
});