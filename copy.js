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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
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
//import * as fs from 'fs-extra';
var externalPromise_1 = require("./externalPromise");
//import {Glob as Glob} from 'glob';
//import * as path from 'path';
var fs = require('fs-extra');
// var externalPromise = require('');
var Glob = require("glob").Glob;
var path = require('path');
function copyFile(fileIn, fileOut) {
    return __awaiter(this, void 0, void 0, function () {
        var ep;
        return __generator(this, function (_a) {
            ep = new externalPromise_1.ExternalPromise();
            fs.ensureFile(fileOut, function (err) {
                if (err) {
                    return ep.reject(err);
                }
                fs.copy(fileIn, fileOut, function (err) {
                    if (err) {
                        return ep.reject(err);
                    }
                    ep.resolve();
                });
            });
            return [2 /*return*/, ep.Promise];
        });
    });
}
;
module.exports.file = copyFile;
module.exports.dir = function (files, out) {
    var ep = new externalPromise_1.ExternalPromise();
    fs.ensureDir(out, function (err) {
        if (err) {
            return ep.reject(err);
        }
        fs.copy(files, out, function (err) {
            if (err) {
                return ep.reject(err);
            }
            ep.resolve();
        });
    });
    return ep.Promise;
};
module.exports.glob = function (inGlob, basePath, outDir) {
    var _this = this;
    var ep = new externalPromise_1.ExternalPromise();
    var mg = new Glob(inGlob, {}, function (err, files) { return __awaiter(_this, void 0, void 0, function () {
        var i, file, outFile, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!err) return [3 /*break*/, 1];
                    ep.reject(err);
                    return [3 /*break*/, 10];
                case 1:
                    if (!(files && files.length > 0)) return [3 /*break*/, 9];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 7, , 8]);
                    i = 0;
                    _a.label = 3;
                case 3:
                    if (!(i < files.length)) return [3 /*break*/, 6];
                    file = files[i];
                    outFile = path.join(outDir, file.substr(basePath.length));
                    return [4 /*yield*/, copyFile(file, outFile)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    ++i;
                    return [3 /*break*/, 3];
                case 6:
                    ep.resolve();
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _a.sent();
                    ep.reject(err_1);
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 10];
                case 9:
                    ep.resolve();
                    _a.label = 10;
                case 10: return [2 /*return*/];
            }
        });
    }); });
    return ep.Promise;
};
//# sourceMappingURL=copy.js.map