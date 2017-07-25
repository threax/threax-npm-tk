"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var io = require("./io");
var copy = require("./copy");
var path = require('path');
var defaultGlob = "node_modules/*/artifacts.json";
/**
 * Get the default glob relative to the rootPath specified. The default glob is "node_modules\*\*tsimport.json",
 * which is all tsimport.json files in the root node_modules folder.
 * @param rootPath The root path of the project. It must contain a node_modules folder.
 */
function getDefaultGlob(rootPath) {
    return path.join(rootPath, defaultGlob);
}
exports.getDefaultGlob = getDefaultGlob;
/**
 * Load the project config and import all of the files matching the importGlobs into it.
 * This will always replace the compileroptions->paths, include, exclude and files properties
 * in your destination config. If you need to have project specific config for one of these properties,
 * supply a glob for it.
 */
function importConfigs(rootPath, outDir, importGlobs) {
    return __awaiter(this, void 0, void 0, function () {
        var json, imported, i, globs, j, currentGlob, j_1, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < importGlobs.length)) return [3 /*break*/, 9];
                    return [4 /*yield*/, io.globFiles(importGlobs[i])];
                case 2:
                    globs = _a.sent();
                    j = 0;
                    _a.label = 3;
                case 3:
                    if (!(j < globs.length)) return [3 /*break*/, 8];
                    currentGlob = globs[j];
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, io.readFile(currentGlob)];
                case 5:
                    json = _a.sent();
                    imported = JSON.parse(json);
                    if (!Array.isArray(imported)) {
                        imported = [imported];
                    }
                    for (j_1 = 0; j_1 < imported.length; ++j_1) {
                        copyFiles(imported[j_1], outDir, path.dirname(currentGlob));
                    }
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    console.error("Could not load " + currentGlob + "\nReason:" + err_1.message);
                    throw err_1;
                case 7:
                    ++j;
                    return [3 /*break*/, 3];
                case 8:
                    ++i;
                    return [3 /*break*/, 1];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.importConfigs = importConfigs;
function copyFiles(imported, outDir, artifactPath) {
    var basePath = artifactPath;
    if (imported.pathBase !== undefined) {
        basePath = path.join(basePath, imported.pathBase);
    }
    if (imported.copy) {
        var outputPath = path.join(outDir, imported.outDir);
        for (var j = 0; j < imported.copy.length; ++j) {
            var full = path.join(artifactPath, imported.copy[j]);
            // console.log(full);
            // console.log(outputPath);
            // console.log(sourcePath);
            copy.glob(full, basePath, outputPath, imported.ignore);
        }
    }
}
//# sourceMappingURL=artifacts.js.map