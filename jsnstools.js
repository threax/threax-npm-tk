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
exports.saveLoadedModules = exports.streamLoadedModules = void 0;
const io = require("./io");
const vm = require('vm');
const util = require('util');
const passedRunnerSource = "JsnsTools-PassedRunner!!$$##";
function streamLoadedModules(js, runners, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (options === undefined) {
            options = {};
        }
        var ignoredSources = options.ignoredSources;
        if (ignoredSources === undefined) {
            ignoredSources = [];
        }
        ignoredSources.push(passedRunnerSource);
        var script = new vm.Script(js);
        var sandbox = {
            console: console
        };
        var context = vm.createContext(sandbox);
        script.runInContext(context);
        var jsns = sandbox.jsns;
        for (let i = 0; i < runners.length; ++i) {
            let runner = runners[i];
            jsns.run(runner, passedRunnerSource);
        }
        var modules = jsns.createFileFromLoaded(ignoredSources);
        if (options.printJsnsDebug === true) {
            jsns.debug();
        }
        return modules;
    });
}
exports.streamLoadedModules = streamLoadedModules;
function saveLoadedModules(src, runners, dest, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (options === undefined) {
            options = {};
        }
        var js = 'var jsnsOptions = jsnsOptions || { simulateModuleLoading: true };\nvar Element = { prototype: {} };\nvar window = {Promise: "nofill"};\nvar document = { querySelectorAll: function () { return []; } };\n'
            + (yield io.readFile(src));
        var modules = yield streamLoadedModules(js, runners, options);
        yield io.ensureFile(dest);
        yield io.writeFile(dest, modules);
        return modules;
    });
}
exports.saveLoadedModules = saveLoadedModules;
//# sourceMappingURL=jsnstools.js.map