/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, describe, it, $, chai, require, before, after, __dirname */

var fs          = require("fs"),
    path        = require("path"),
    http        = require("http"),
    send        = require("send"),
    jsdom       = require("jsdom"),
    chai        = require("chai"),
    assert      = chai.assert,
    port        = 13191,
    server,
    win;

describe("Unit Testing: Output Panel", function () {
    "use strict";
    
    debugger;
    
    before(function () {
        server = http.createServer(function (req, res) {
            send(req, req.url)
                .root(path.join(__dirname, ".."))
                .pipe(res);
        });
        
        server.listen(port);
        console.log("HTTP server running at http://localhost:" + port + "/");
        
        jsdom.env({
            url: "http://localhost:" + port + "/test/container.html",
            scripts: [
                "http://localhost:" + port + "/test/thirdparty/jquery-2.0.1.js",
                "http://localhost:" + port + "/test/thirdparty/mustache.js",
                "http://localhost:" + port + "/test/thirdparty/require.js"
            ],
            done: function (errors, window) {
                win = window;
            }
        });
    });
    
    after(function () {
        server.close();
        console.log("HTTP server closed at http://localhost:" + port + "/");
    });
        
    describe("#log()", function () {
        it("should log entry", function () {
            
            
        });
    });
});