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
/// <reference path="node_modules/jsns/jsns.ts" />
var io = require("./io");
var vm = require('vm');
var util = require('util');
var passedRunnerSource = "JsnsTools-PassedRunner!!$$##";
function streamLoadedModules(js, runners, options) {
    return __awaiter(this, void 0, void 0, function () {
        var ignoredSources, script, sandbox, context, jsns, i, runner, modules;
        return __generator(this, function (_a) {
            if (options === undefined) {
                options = {};
            }
            ignoredSources = options.ignoredSources;
            if (ignoredSources === undefined) {
                ignoredSources = [];
            }
            ignoredSources.push(passedRunnerSource);
            script = new vm.Script(js);
            sandbox = {
                console: console
            };
            context = vm.createContext(sandbox);
            script.runInContext(context);
            jsns = sandbox.jsns;
            for (i = 0; i < runners.length; ++i) {
                runner = runners[i];
                jsns.run(runner, passedRunnerSource);
            }
            modules = jsns.createFileFromLoaded(ignoredSources);
            if (options.printJsnsDebug === true) {
                jsns.debug();
            }
            return [2 /*return*/, modules];
        });
    });
}
exports.streamLoadedModules = streamLoadedModules;
function saveLoadedModules(src, runners, dest, options) {
    return __awaiter(this, void 0, void 0, function () {
        var js, _a, modules;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (options === undefined) {
                        options = {};
                    }
                    _a = 'var jsnsOptions = jsnsOptions || { simulateModuleLoading: true };\nvar Element = { prototype: {} };\nvar window = {Promise: "nofill"};\nvar document = { querySelectorAll: function () { return []; } };\n';
                    return [4 /*yield*/, io.readFile(src)];
                case 1:
                    js = _a + (_b.sent());
                    return [4 /*yield*/, streamLoadedModules(js, runners, options)];
                case 2:
                    modules = _b.sent();
                    return [4 /*yield*/, io.writeFile(dest, modules)];
                case 3:
                    _b.sent();
                    return [2 /*return*/, modules];
            }
        });
    });
}
exports.saveLoadedModules = saveLoadedModules;
//# sourceMappingURL=jsnstools.js.map