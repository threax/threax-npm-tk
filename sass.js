"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileSassPromise = exports.compile = void 0;
const externalPromise_1 = require("./externalPromise");
const io = require("./io");
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
    var mg = new Glob(settings.input, {}, (err, files) => {
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
                .then(r => {
                ep.resolve();
            })
                .catch(err => {
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
    return __awaiter(this, void 0, void 0, function* () {
        var data = yield io.readFile(inFile, { encoding: settings.encoding });
        var output = yield compileSassPromise({
            data: data,
            includePaths: settings.importPaths
        });
        yield io.ensureFile(outFile);
        yield io.writeFile(outFile, output.css);
    });
}
function compileSassPromise(options) {
    let ep = new externalPromise_1.ExternalPromise();
    sass.render(options, (err, output) => {
        if (err) {
            return ep.reject(err);
        }
        else {
            ep.resolve(output);
        }
    });
    return ep.Promise;
}
exports.compileSassPromise = compileSassPromise;
//# sourceMappingURL=sass.js.map