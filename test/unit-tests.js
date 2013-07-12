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
    host        = "http://localhost:" + port,
    server,
    win;

describe("Unit Testing: Output Panel", function () {
    "use strict";
    
    debugger;
    
    before(function (done) {
        server = http.createServer(function (req, res) {
            send(req, req.url)
                .root(path.join(__dirname, ".."))
                .pipe(res);
        });
        
        server.listen(port);
        console.log("HTTP server running at " + host);
        
        jsdom.env({
            url: host + "/test/container.html",
            scripts: [
                "thirdparty/jquery-2.0.1.js",
                "thirdparty/mustache.js",
                "/test/main-mock.js"
            ],
            features: {
                FetchExternalResources: ["script"],
                ProcessExternalResources: ["script"],
                SkipExternalResources: false
            },
            done: function (errors, window) {
                if (errors) {
                    errors.forEach(function (err) {
                        if (err.data) {
                            console.log(err.data.error);
                            console.log(err.data.filename);
                        } else {
                            console.log(err.message);
                        }
                    });
                    throw new Error("Loading container.html failed.");
                } else {
                    win = window;
                    
                    
                    done();
                }
            }
        });
    });
    
    after(function () {
        win.close();
        server.close();
        console.log("HTTP server closed at http://localhost:" + port + "/");
    });
        
    describe("#log()", function () {
        it("should log entry", function () {
            
            
        });
    });
});