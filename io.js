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
var fs = require('fs-extra');
var Glob = require("glob").Glob;
var externalPromise_1 = require("./externalPromise");
/**
 * Get the node fsstat results for a path. This will return promise.
 */
function fsstat(path) {
    var ep = new externalPromise_1.ExternalPromise();
    fs.stat(path, function (err, stats) {
        if (err) {
            return ep.reject(err);
        }
        ep.resolve(stats);
    });
    return ep.Promise;
}
exports.fsstat = fsstat;
/**
 * Find all files that match the given glob. This will ignore any directories.
 */
function globFiles(globStr, ignore) {
    var _this = this;
    globStr = globStr.replace(/\\/g, '/');
    var ep = new externalPromise_1.ExternalPromise();
    var globOptions = {};
    if (ignore) {
        globOptions.ignore = ignore;
    }
    var mg = new Glob(globStr, globOptions, function (err, files) { return __awaiter(_this, void 0, void 0, function () {
        var matches, actuallyFiles, i, file;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!err) return [3 /*break*/, 1];
                    ep.reject(err);
                    return [3 /*break*/, 6];
                case 1:
                    matches = mg.matches;
                    actuallyFiles = [];
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < files.length)) return [3 /*break*/, 5];
                    file = files[i];
                    return [4 /*yield*/, fsstat(file)];
                case 3:
                    if ((_a.sent()).isFile()) {
                        actuallyFiles.push(file);
                    }
                    _a.label = 4;
                case 4:
                    ++i;
                    return [3 /*break*/, 2];
                case 5:
                    ep.resolve(actuallyFiles);
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    }); });
    return ep.Promise;
}
exports.globFiles = globFiles;
function ensureFile(path) {
    var ep = new externalPromise_1.ExternalPromise();
    fs.ensureFile(path, function (err) {
        if (err) {
            return ep.reject(err);
        }
        ep.resolve(undefined);
    });
    return ep.Promise;
}
exports.ensureFile = ensureFile;
function ensureDir(path) {
    var ep = new externalPromise_1.ExternalPromise();
    fs.ensureDir(path, function (err) {
        if (err) {
            return ep.reject(err);
        }
        ep.resolve(undefined);
    });
    return ep.Promise;
}
exports.ensureDir = ensureDir;
function copy(src, dest) {
    var ep = new externalPromise_1.ExternalPromise();
    fs.copy(src, dest, function (err) {
        if (err) {
            return ep.reject(err);
        }
        ep.resolve();
    });
    return ep.Promise;
}
exports.copy = copy;
function readFile(path) {
    var ep = new externalPromise_1.ExternalPromise();
    fs.readFile(path, function (err, data) {
        if (err) {
            return ep.reject(err);
        }
        ep.resolve(data);
    });
    return ep.Promise;
}
exports.readFile = readFile;
function writeFile(path, data) {
    var ep = new externalPromise_1.ExternalPromise();
    fs.writeFile(path, data, function (err) {
        if (err) {
            return ep.reject(err);
        }
        ep.resolve();
    });
    return ep.Promise;
}
exports.writeFile = writeFile;
function emptyDir(path) {
    var ep = new externalPromise_1.ExternalPromise();
    fs.emptyDir(path, function (err, data) {
        if (err) {
            return ep.reject(err);
        }
        ep.resolve(data);
    });
    return ep.Promise;
}
exports.emptyDir = emptyDir;
//# sourceMappingURL=io.js.map