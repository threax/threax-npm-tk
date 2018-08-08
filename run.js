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
var typescript_1 = require("./typescript");
var artifact = require("./artifacts");
var io = require("./io");
(function () {
    return __awaiter(this, void 0, void 0, function () {
        var filesDir, outDir, mainArtifacts, _a, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    filesDir = process.cwd();
                    outDir = filesDir + "/wwwroot";
                    mainArtifacts = filesDir + '/artifacts.json';
                    if (process.argv.length < 3) {
                        console.log("You must include a command. Type threax-npm-tk help for help.");
                        process.exit(1);
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 10, , 11]);
                    _a = process.argv[2];
                    switch (_a) {
                        case 'build': return [3 /*break*/, 2];
                        case 'clean': return [3 /*break*/, 5];
                        case 'help': return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 8];
                case 2:
                    console.log("Building " + filesDir + " to " + outDir);
                    return [4 /*yield*/, typescript_1.tsc({
                            projectFolder: filesDir
                        })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, artifact.importConfigs(filesDir, outDir, [mainArtifacts, artifact.getDefaultGlob(filesDir)])];
                case 4:
                    _b.sent();
                    console.log("Build sucessful");
                    return [3 /*break*/, 9];
                case 5: return [4 /*yield*/, io.emptyDir(outDir)];
                case 6:
                    _b.sent();
                    console.log("Cleaned " + outDir);
                    return [3 /*break*/, 9];
                case 7:
                    console.log("build - Build the project based on artifact.json files.");
                    console.log("clean - Clean the output directory.");
                    console.log("help - Display help.");
                    return [3 /*break*/, 9];
                case 8:
                    console.log("Unknown command " + process.argv[2]);
                    return [3 /*break*/, 9];
                case 9: return [3 /*break*/, 11];
                case 10:
                    err_1 = _b.sent();
                    console.log(JSON.stringify(err_1));
                    process.exit(1);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
})();
//# sourceMappingURL=run.js.map