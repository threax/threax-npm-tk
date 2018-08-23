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
var artifact = require("./artifacts");
var io = require("./io");
var path = require('path');
(function () {
    return __awaiter(this, void 0, void 0, function () {
        var filesDir, outPath, artifactsGlob, verbose, i, outDir, _a, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (process.argv.length < 3) {
                        console.log("You must include a command. Type threax-npm-tk help for help.");
                        process.exit(1);
                    }
                    filesDir = process.cwd();
                    outPath = "wwwroot";
                    artifactsGlob = [];
                    verbose = false;
                    //Process command line args
                    for (i = 3; i < process.argv.length; i += 2) {
                        switch (process.argv[i]) {
                            case '-s':
                                filesDir = process.argv[i + 1];
                                break;
                            case '-o':
                                outPath = process.argv[i + 1];
                                break;
                            case '-a':
                                artifactsGlob.push(process.argv[i + 1]);
                                break;
                            case '-v':
                                verbose = process.argv[i + 1] === 'true';
                                break;
                        }
                    }
                    //Setup default globs, if none were provided
                    if (artifactsGlob.length === 0) {
                        artifactsGlob.push(path.join(filesDir, '/artifacts.json'));
                        artifactsGlob.push(artifact.getDefaultGlob(filesDir));
                    }
                    outDir = path.join(filesDir, outPath);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 9, , 10]);
                    _a = process.argv[2];
                    switch (_a) {
                        case 'build': return [3 /*break*/, 2];
                        case 'clean': return [3 /*break*/, 4];
                        case 'help': return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 7];
                case 2:
                    console.log("Building " + filesDir + " to " + outDir);
                    return [4 /*yield*/, artifact.importConfigs(filesDir, outDir, artifactsGlob, verbose)];
                case 3:
                    _b.sent();
                    console.log("Build sucessful");
                    return [3 /*break*/, 8];
                case 4: return [4 /*yield*/, io.emptyDir(outDir)];
                case 5:
                    _b.sent();
                    console.log("Cleaned " + outDir);
                    return [3 /*break*/, 8];
                case 6:
                    console.log("build - Build the project based on artifact.json files.");
                    console.log("clean - Clean the output directory.");
                    console.log("help - Display help.");
                    console.log("Optional arguments, these go after the main command:");
                    console.log("-o -> Specify output folder, defaults to wwwroot. When cleaning this is the folder to be cleaned.");
                    console.log("-a -> Specify an archive.json file. Can be any filename and supports globbing e.g. node_modules/*/custom-artifacts.json. This argument can appear multiple times. By default this is artifacts.json in the source directory and node_modules/*/artifacts.json.");
                    console.log("-s -> Specify the source directory. Defaults to the current working directory. All paths are relative to this path.");
                    console.log("-v -> Verbose output. Use -v true to make it work. Default is false.");
                    return [3 /*break*/, 8];
                case 7:
                    console.log("Unknown command " + process.argv[2]);
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 10];
                case 9:
                    err_1 = _b.sent();
                    console.log(JSON.stringify(err_1));
                    process.exit(1);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
})();
//# sourceMappingURL=run.js.map