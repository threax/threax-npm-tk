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
var less = require("./less");
var sass = require("./sass");
var typescript = require("./typescript");
var jsnsTools = require("./jsnstools");
var path = require('path');
var defaultGlob = "node_modules/*/artifacts.json";
/**
 * Get the default glob relative to the rootPath specified. The default glob is "node_modules\*\*artifacts.json",
 * which is all artifacts.json files in the root node_modules folder.
 * @param rootPath The root path of the project. It must contain a node_modules folder.
 */
function getDefaultGlob(rootPath) {
    return path.join(rootPath, defaultGlob);
}
exports.getDefaultGlob = getDefaultGlob;
/**
 * Load the and process the specified artifacts.json files.
 */
function importConfigs(rootPath, outDir, importGlobs, verbose) {
    return __awaiter(this, void 0, void 0, function () {
        var json, imported, i, globs, j, currentGlob, j_1, currentGlobDir, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < importGlobs.length)) return [3 /*break*/, 16];
                    return [4 /*yield*/, io.globFiles(importGlobs[i])];
                case 2:
                    globs = _a.sent();
                    j = 0;
                    _a.label = 3;
                case 3:
                    if (!(j < globs.length)) return [3 /*break*/, 15];
                    currentGlob = globs[j];
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 13, , 14]);
                    if (verbose) {
                        console.log("Reading " + currentGlob);
                    }
                    return [4 /*yield*/, io.readFile(currentGlob)];
                case 5:
                    json = _a.sent();
                    imported = JSON.parse(json);
                    if (!Array.isArray(imported)) {
                        imported = [imported];
                    }
                    j_1 = 0;
                    _a.label = 6;
                case 6:
                    if (!(j_1 < imported.length)) return [3 /*break*/, 12];
                    currentGlobDir = path.dirname(currentGlob);
                    return [4 /*yield*/, copyFiles(imported[j_1], outDir, currentGlobDir, verbose)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, compileLess(imported[j_1], outDir, currentGlobDir, verbose)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, compileSass(imported[j_1], outDir, currentGlobDir, verbose)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, compileTypescript(imported[j_1], outDir, currentGlobDir, verbose)];
                case 10:
                    _a.sent();
                    _a.label = 11;
                case 11:
                    ++j_1;
                    return [3 /*break*/, 6];
                case 12: return [3 /*break*/, 14];
                case 13:
                    err_1 = _a.sent();
                    console.error("Could not load " + currentGlob + "\nReason:" + err_1.message);
                    throw err_1;
                case 14:
                    ++j;
                    return [3 /*break*/, 3];
                case 15:
                    ++i;
                    return [3 /*break*/, 1];
                case 16: return [2 /*return*/];
            }
        });
    });
}
exports.importConfigs = importConfigs;
function copyFiles(imported, outDir, artifactPath, verbose) {
    var promises = [];
    var basePath = artifactPath;
    if (imported.pathBase !== undefined) {
        basePath = path.join(basePath, imported.pathBase);
    }
    if (imported.copy) {
        var outputPath = path.join(outDir, imported.outDir);
        for (var j = 0; j < imported.copy.length; ++j) {
            var full = path.join(artifactPath, imported.copy[j]);
            if (verbose) {
                console.log("  Copying files " + full + " to " + outputPath);
            }
            promises.push(copy.glob(full, basePath, outputPath, imported.ignore));
        }
    }
    return Promise.all(promises);
}
function compileLess(imported, outDir, artifactPath, verbose) {
    var promises = [];
    var basePath = artifactPath;
    if (imported.pathBase !== undefined) {
        basePath = path.join(basePath, imported.pathBase);
    }
    if (imported.less) {
        if (!Array.isArray(imported.less)) {
            imported.less = [imported.less];
        }
        var outputPath = path.join(outDir, imported.outDir);
        for (var j = 0; j < imported.less.length; ++j) {
            var lessOptions = imported.less[j];
            if (lessOptions.importPaths !== undefined) {
                for (var i = 0; i < lessOptions.importPaths.length; ++i) {
                    lessOptions.importPaths[i] = path.join(artifactPath, lessOptions.importPaths[i]);
                }
            }
            if (lessOptions.input !== undefined) {
                lessOptions.input = path.join(artifactPath, lessOptions.input);
            }
            if (lessOptions.basePath !== undefined) {
                lessOptions.basePath = path.join(basePath, lessOptions.basePath);
            }
            else {
                lessOptions.basePath = basePath;
            }
            if (lessOptions.out !== undefined) {
                lessOptions.out = path.join(outputPath, lessOptions.out);
            }
            else {
                lessOptions.out = outputPath;
            }
            if (lessOptions.encoding === undefined) {
                lessOptions.encoding = 'utf8';
            }
            if (verbose) {
                console.log("  Compiling less " + lessOptions.input + " to " + lessOptions.out);
            }
            promises.push(less.compile(lessOptions));
        }
    }
    return Promise.all(promises);
}
function compileSass(imported, outDir, artifactPath, verbose) {
    var promises = [];
    var basePath = artifactPath;
    if (imported.pathBase !== undefined) {
        basePath = path.join(basePath, imported.pathBase);
    }
    if (imported.sass) {
        if (!Array.isArray(imported.sass)) {
            imported.sass = [imported.sass];
        }
        var outputPath = path.join(outDir, imported.outDir);
        for (var j = 0; j < imported.sass.length; ++j) {
            var sassOptions = imported.sass[j];
            if (sassOptions.importPaths !== undefined) {
                for (var i = 0; i < sassOptions.importPaths.length; ++i) {
                    sassOptions.importPaths[i] = path.join(artifactPath, sassOptions.importPaths[i]);
                }
            }
            if (sassOptions.input !== undefined) {
                sassOptions.input = path.join(artifactPath, sassOptions.input);
            }
            if (sassOptions.basePath !== undefined) {
                sassOptions.basePath = path.join(basePath, sassOptions.basePath);
            }
            else {
                sassOptions.basePath = basePath;
            }
            if (sassOptions.out !== undefined) {
                sassOptions.out = path.join(outputPath, sassOptions.out);
            }
            else {
                sassOptions.out = outputPath;
            }
            if (sassOptions.encoding === undefined) {
                sassOptions.encoding = 'utf8';
            }
            if (verbose) {
                console.log("  Compiling sass " + sassOptions.input + " to " + sassOptions.out);
            }
            promises.push(sass.compile(sassOptions));
        }
    }
    return Promise.all(promises);
}
function compileTypescript(imported, outDir, artifactPath, verbose) {
    return __awaiter(this, void 0, void 0, function () {
        var tscOutputFile, json, tsConfig, shakenOutputFile, tscOutPath, shakenFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!imported.typescript) return [3 /*break*/, 5];
                    if (verbose) {
                        console.log("  Compiling typescript with " + artifactPath + '/tsconfig.json');
                    }
                    if (!imported.typescript.compile) return [3 /*break*/, 2];
                    return [4 /*yield*/, typescript.tsc({
                            projectFolder: artifactPath
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (!imported.typescript.shakeModules) return [3 /*break*/, 5];
                    return [4 /*yield*/, io.readFile(artifactPath + '/tsconfig.json')];
                case 3:
                    json = _a.sent();
                    tsConfig = JSON.parse(json);
                    if (tsConfig.compilerOptions && tsConfig.compilerOptions.outFile) {
                        tscOutputFile = tsConfig.compilerOptions.outFile;
                    }
                    //If the artifacts file defines a shake output file, use that path following the defined paths in the artifacts.json file
                    if (imported.typescript.shakeModules.outFile) {
                        shakenOutputFile = path.join(imported.outDir, imported.typescript.shakeModules.outFile);
                        shakenOutputFile = path.join(outDir, shakenOutputFile);
                    }
                    else {
                        tscOutPath = path.dirname(tscOutputFile);
                        shakenFile = path.basename(tscOutputFile, '.js') + ".shake.js";
                        shakenOutputFile = path.join(artifactPath, tscOutPath, shakenFile);
                    }
                    //Scope to output path
                    tscOutputFile = path.join(artifactPath, tscOutputFile);
                    if (verbose) {
                        console.log('  Shaking jsns modules from ' + tscOutputFile + ' to ' + shakenOutputFile);
                    }
                    return [4 /*yield*/, jsnsTools.saveLoadedModules(tscOutputFile, imported.typescript.shakeModules.runners, shakenOutputFile)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=artifacts.js.map