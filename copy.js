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
exports.glob = exports.dir = exports.file = void 0;
const io = require("./io");
var path = require('path');
function file(fileIn, fileOut) {
    return __awaiter(this, void 0, void 0, function* () {
        yield io.ensureFile(fileOut);
        yield io.copy(fileIn, fileOut);
    });
}
exports.file = file;
;
function dir(files, out) {
    return __awaiter(this, void 0, void 0, function* () {
        yield io.ensureDir(out);
        yield io.copy(files, out);
    });
}
exports.dir = dir;
;
function glob(inGlob, basePath, outDir, ignore) {
    return __awaiter(this, void 0, void 0, function* () {
        var files = yield io.globFiles(inGlob, ignore);
        basePath = path.join(basePath); //resolve the path, removes any ../
        for (var i = 0; i < files.length; ++i) {
            var inFile = path.join(files[i]);
            var outFile = path.join(outDir, inFile.substr(basePath.length));
            yield file(inFile, outFile);
        }
    });
}
exports.glob = glob;
;
//# sourceMappingURL=copy.js.map