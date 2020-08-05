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
var exec = require('child_process').exec;
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
        var output = yield compileSassPromise({
            input: inFile,
            output: outFile,
            includePaths: settings.importPaths,
            outputStyle: "compressed"
        });
    });
}
function compileSassPromise(options) {
    var execOptions = {};
    var command = 'sass --no-source-map ';
    if (options.includePaths) {
        for (let i = 0; i < options.includePaths.length; ++i) {
            var item = options.includePaths[i];
            command += `--load-path=${item} `;
        }
    }
    if (options.outputStyle) {
        command += `--style=${options.outputStyle} `;
    }
    command += `${options.input} ${options.output}`;
    //console.log(command);
    var ep = new externalPromise_1.ExternalPromise();
    var child = exec(command, execOptions, function (error, stdout, stderr) {
        if (stdout) {
            console.log('sass: ' + stdout);
        }
        if (stderr) {
            console.log('sass error: ' + stderr);
        }
        if (error !== null) {
            console.log('sass exec error: ' + error);
            ep.reject(error);
        }
        else {
            ep.resolve();
        }
    });
    return ep.Promise;
}
exports.compileSassPromise = compileSassPromise;
//# sourceMappingURL=sass.js.map