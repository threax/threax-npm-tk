"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = void 0;
var externalPromise_1 = require("./externalPromise");
var sass = require('node-sass');
var fs = require('fs-extra');
var Glob = require("glob").Glob;
var path = require('path');
function compile(settings) {
    var ep = new externalPromise_1.ExternalPromise();
    if (!settings.basePath) {
        return ep.reject(new Error("Cannot find basePath setting when compiling sass for " + settings.input));
    }
    var basePath = path.join(settings.basePath);
    var mg = new Glob(settings.input, {}, function (err, files) {
        if (err) {
            ep.reject(err);
        }
        else if (files && files.length > 0) {
            var compilePromises = [];
            for (var i = 0; i < files.length; ++i) {
                var file = path.join(files[i]);
                var outFile = path.join(settings.out, file.substr(basePath.length));
                var parsed = path.parse(outFile);
                outFile = path.join(parsed.dir, parsed.name + ".css");
                compilePromises.push(compileFile(settings, file, outFile));
            }
            Promise.all(compilePromises)
                .then(function (r) {
                ep.resolve();
            })
                .catch(function (err) {
                ep.reject(err);
            });
        }
        else {
            ep.resolve();
        }
    });
    return ep.Promise;
}
exports.compile = compile;
function compileFile(settings, inFile, outFile) {
    var ep = new externalPromise_1.ExternalPromise();
    fs.readFile(inFile, settings.encoding, function (err, data) {
        if (err) {
            return ep.reject(err);
        }
        sass.render({
            data: data,
            includePaths: settings.importPaths
        }, function (err, output) {
            if (err) {
                return ep.reject(err);
            }
            fs.ensureFile(outFile, function (err) {
                if (err) {
                    return ep.reject(err);
                }
                fs.writeFile(outFile, output.css, function (err) {
                    if (err) {
                        return ep.reject(err);
                    }
                    ep.resolve();
                });
            });
        });
    });
    return ep.Promise;
}
//# sourceMappingURL=sass.js.map