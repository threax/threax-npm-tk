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
var externalPromise_1 = require("./externalPromise");
var io = require("./io");
var exec = require('child_process').exec;
var path = require('path');
function tsc(options) {
    var execOptions = {};
    if (options && options.projectFolder) {
        execOptions.cwd = options.projectFolder;
    }
    var ep = new externalPromise_1.ExternalPromise();
    var child = exec('tsc', execOptions, function (error, stdout, stderr) {
        if (stdout) {
            console.log('tsc: ' + stdout);
        }
        if (stderr) {
            console.log('tsc error: ' + stderr);
        }
        if (error !== null) {
            console.log('tsc exec error: ' + error);
            ep.reject(error);
        }
        else {
            ep.resolve();
        }
    });
    return ep.Promise;
}
exports.tsc = tsc;
var defaultGlob = "node_modules/*/*tsimport.json";
function getDefaultGlob(rootPath) {
    return path.join(rootPath, defaultGlob);
}
exports.getDefaultGlob = getDefaultGlob;
/**
 * Load the project config and import all of the files matching the importGlobs into it.
 * This will always replace the compileroptions->paths, include, exclude and files properties
 * in your destination config. If you need to have project specific config for one of these properties,
 * supply a glob for it. If you don't supply a glob, the default will be "node_modules\*\*.tsimport"
 */
function importConfigs(projectConfig, rootPath, importGlobs) {
    return __awaiter(this, void 0, void 0, function () {
        var json, imported, imports, i, globs, j, currentGlob, loadedConfig, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!importGlobs) {
                        importGlobs = [getDefaultGlob(rootPath)]; //By default find all tsimport files in a flat structure
                    }
                    imports = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < importGlobs.length)) return [3 /*break*/, 7];
                    return [4 /*yield*/, io.globFiles(importGlobs[i])];
                case 2:
                    globs = _a.sent();
                    j = 0;
                    _a.label = 3;
                case 3:
                    if (!(j < globs.length)) return [3 /*break*/, 6];
                    currentGlob = globs[j];
                    return [4 /*yield*/, io.readFile(currentGlob)];
                case 4:
                    json = _a.sent();
                    imported = JSON.parse(json);
                    imported.sourcePath = path.relative(rootPath, path.dirname(currentGlob));
                    imports.push(imported);
                    _a.label = 5;
                case 5:
                    ++j;
                    return [3 /*break*/, 3];
                case 6:
                    ++i;
                    return [3 /*break*/, 1];
                case 7:
                    _a.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, io.readFile(projectConfig)];
                case 8:
                    json = _a.sent();
                    loadedConfig = JSON.parse(json);
                    return [3 /*break*/, 10];
                case 9:
                    err_1 = _a.sent();
                    loadedConfig = {};
                    return [3 /*break*/, 10];
                case 10: return [4 /*yield*/, streamImport(loadedConfig, imports)];
                case 11:
                    _a.sent();
                    json = JSON.stringify(loadedConfig, undefined, 2);
                    return [4 /*yield*/, io.writeFile(projectConfig, json)];
                case 12:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.importConfigs = importConfigs;
function streamImport(dest, imports) {
    return __awaiter(this, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            //Reset everything we replace
            if (!dest.compilerOptions) {
                dest.compilerOptions = {};
            }
            dest.compilerOptions.paths = {};
            dest.include = [];
            dest.exclude = [];
            dest.files = [];
            for (i = 0; i < imports.length; ++i) {
                mergeImports(imports[i], dest);
            }
            //If a packageManager node got defined, remove it and add it as the first file in the files list.
            //This is always done last so it will work.
            if (dest.packageManager) {
                if (!dest.files) {
                    dest.files = [];
                }
                dest.files.splice(0, 0, dest.packageManager);
                delete dest.packageManager;
            }
            return [2 /*return*/];
        });
    });
}
exports.streamImport = streamImport;
function mergeConfigs(src, dest) {
    //Merge compiler options
    if (src.compilerOptions) {
        if (!dest.compilerOptions) {
            dest.compilerOptions = {};
        }
        mergeCompilerOptions(src.compilerOptions, dest.compilerOptions, src.sourcePath);
    }
    if (src.include) {
        if (!dest.include) {
            dest.include = [];
        }
        mergePaths(src.include, dest.include, src.sourcePath);
    }
    if (src.exclude) {
        if (!dest.exclude) {
            dest.exclude = [];
        }
        mergePaths(src.exclude, dest.exclude, src.sourcePath);
    }
    if (src.files) {
        if (!dest.files) {
            dest.files = [];
        }
        mergePaths(src.files, dest.files, src.sourcePath);
    }
}
function mergeImports(src, dest) {
    mergeConfigs(src, dest);
    //Merge package manager if it is not already set, first one found wins
    if (src.packageManager && !dest.packageManager) {
        dest.packageManager = path.join(src.sourcePath, src.packageManager);
    }
}
function mergeCompilerOptions(src, dest, basePath) {
    if (src.paths) {
        if (!dest.paths) {
            dest.paths = {};
        }
        var srcPaths = src.paths;
        var destPaths = dest.paths;
        for (var key in srcPaths) {
            if (!destPaths[key]) {
                destPaths[key] = [];
            }
            mergePaths(srcPaths[key], destPaths[key], basePath);
        }
    }
}
function mergePaths(src, dest, basePath) {
    for (var i = 0; i < src.length; ++i) {
        dest.push(path.join(basePath, src[i]));
    }
}
//# sourceMappingURL=typescript.js.map