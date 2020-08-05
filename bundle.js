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
exports.compile = void 0;
const io = require("./io");
var Terser = require("terser");
var fs = require('fs-extra');
var Glob = require("glob").Glob;
var path = require('path');
function compile(settings) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!settings.basePath) {
            throw new Error("Cannot find basePath setting when compiling bundle for " + settings.input);
        }
        var terserOptions = {
            toplevel: false,
            compress: true,
            mangle: {
                reserved: ["jsns"]
            }
        };
        let ext = path.extname(settings.out).toLowerCase();
        let isJs = ext.endsWith(".js");
        let isCss = ext.endsWith(".css");
        if (settings.minify && !isJs && !isCss) {
            throw new Error(`Cannot determine if output file ${settings.out} is a javascript or css file and minification is turned on. Canceling bundle since output format cannot be determined.`);
        }
        try {
            yield io.unlinkFile(settings.out);
        }
        catch (err) {
            //Exceptions for flow control, this is their reccomendation, node: the q stands for quality.
        }
        yield io.ensureFile(settings.out);
        for (let i = 0; i < settings.input.length; ++i) {
            let input = settings.input[i];
            let file = path.join(input);
            let data = yield io.readFile(file, { encoding: settings.encoding });
            let lineEnding = io.getLineEndings(data);
            if (settings.minify) {
                if (isJs) {
                    let terserResult = Terser.minify(data, terserOptions);
                    if (terserResult.error) {
                        throw terserResult.error;
                    }
                    data = terserResult.code;
                }
                if (isCss) {
                    //Do nothing right now
                }
            }
            yield io.appendFile(settings.out, data + lineEnding);
        }
    });
}
exports.compile = compile;
//# sourceMappingURL=bundle.js.map