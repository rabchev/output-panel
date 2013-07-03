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
        $filter;
    
    var panel,
        selCat              = "all",
        _maxLines           = 1000,
        filter              = {},
        linesCount          = 0,
        tlBarHeight         = 0,
        visible             = false,
        realVisibility      = false,
        buffer              = [],
        scrolling           = false;
    
    function _pushToPanel(category, message, timestamp) {
        var $p,
            $first;
        
        if (!filter[category]) {
            filter[category] = category.replace(/\s/g, "-");
            $filter.append($("<option>", {
                value   : category,
                text    : category
            }));
        }
        
        if (!$document) {
            $document = $($iframe.contents()[0]);
            $content = $document.find("body");
        }
        
        if (linesCount >= exports.maxLines()) {
            $first = $content.find("#ln" + (linesCount - exports.maxLines()));
            if ($first.length > 0) {
                $first.remove();
            }
        }
        
        linesCount++;
        $p = $("<div>", {
            id          : "ln" + linesCount,
            "class"     : "msg " + filter[category]
        });
        if (selCat !== "all" && selCat !== category) {
            $p.addClass("hide");
        }
        $content.append($p);
        $p.append($("<span>", {
            text: timestamp.toISOString()
        }));
        $p.append(message);
        if (!scrolling) {
            scrolling = true;
            window.setTimeout(function () {
                $content.animate({ scrollTop: $document.height() }, "fast");
                scrolling = false;
            }, 10);
        }
    }
    
    function _pushToBuffer(category, message, timestamp) {
        if (buffer.length >= exports.maxLines()) {
            buffer.splice(0, 1);
        }
        buffer.push({
            category: category,
            message: message,
            timestamp: timestamp
        });
    }
    
    function _resizeIframe() {
        if (visible && $iframe) {
            var iframeWidth = panel.$panel.innerWidth();
            $iframe.attr("width", iframeWidth + "px");
        }
    }
    
    function _init() {
        if (!panel) {
            var $panel      = $(panelHTML),
                $clearAll   = $panel.find("#output-panel-clear-all"),
                $close      = $panel.find(".close"),
                htmlSource;
            
            htmlSource = "<html><head>";
            htmlSource += "<link href='" + require.toUrl("./output.css") + "' rel='stylesheet'></link>";
            htmlSource += "</head><body>";
            htmlSource += "</body></html>";
            
            $filter = $panel.find("#output-panel-category");
            $iframe = $panel.find("#output-panel-frame");
            $iframe.attr("srcdoc", htmlSource);
            
            panel = PanelManager.createBottomPanel("output-panel", $panel);
            $panel.on("panelResizeUpdate", function (e, newSize) {
                $iframe.attr("height", newSize - tlBarHeight);
            });
            
            $clearAll.click(function () {
                exports.clear();
            });
            
            $close.click(function () {
                _toggleVisibility();
            });
            
            $filter.change(function () {
                var sel = $filter.val();
                if (sel === "all") {
                    $content.find(".hide")
                        .removeClass("hide");
                } else {
                    $content.find(".msg:not(:has(." + filter[sel] + "))")
                        .addClass("hide");
                    $content.find("." + filter[sel])
                        .removeClass("hide");
                }
                selCat = sel;
            });
            
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
            if (buffer.length > 0) {
                buffer.forEach(function (el) {
                    _pushToPanel(el.category, el.message);
                });
                buffer.length = 0;
            }
            $icon.toggleClass("active");
            panel.show();
            if (tlBarHeight === 0) {
                tlBarHeight = panel.$panel.find(".toolbar").height();
                tlBarHeight += panel.$panel.find(".vert-resizer").height() + 5;
                $iframe.attr("height", panel.$panel.height() - tlBarHeight);
            }
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
    
    exports.log = function (category, message) {
        _init();
        
        if (!message) {
            message = category;
            category = "Undefined";
        }
        
        if (!message) {
            message = "";
        }
        
        if (typeof message === "string") {
            if (realVisibility) {
                _pushToPanel(category, message, new Date());
            } else {
                _pushToBuffer(category, message, new Date());
            }
        }
    };
    
    exports.clear = function () {
        if ($content) {
            $content.empty();
            linesCount = 0;
            
            filter = {};
            selCat = "all";
            $filter
                .find("option")
                .remove()
                .end()
                .append($("<option>", {
                    value   : "all",
                    text    : "All"
                }));
        }
        buffer.length = 0;
    };
    
    exports.setVisibility = function (isVisible) {
        if (typeof isVisible === "boolean" && isVisible !== visible) {
            _toggleVisibility();
        }
    };
    
    exports.isVisible = function () {
        return realVisibility;
    };
    
    exports.maxLines = function (val) {
        if (val) {
            if (val < _maxLines) {
                
                if (linesCount > val) {
                    var i,
                        $el,
                        from = linesCount > _maxLines ? linesCount - _maxLines : 0,
                        to = linesCount - val;
                    
                    for (i = from; i < to; i++) {
                        $el = $content.find("#ln" + i);
                        if ($el.length > 0) {
                            $el.remove();
                        }
                    }
                }
                
                if (buffer.length > val) {
                    buffer.splice(0, buffer.length - val);
                }
            }
            _maxLines = val;
        }
        
        return _maxLines;
    };
    
    exports.toggleVisibility = _toggleVisibility;
    
});