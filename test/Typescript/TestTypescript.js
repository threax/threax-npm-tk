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
const ts = require("../../typescript");
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        var first = {
            compilerOptions: {
                paths: {
                    "firstpath.*": [
                        "src/*.ts"
                    ]
                }
            },
            include: [
                "firstfile1",
                "firstfile2"
            ],
            packageManager: "correctpackagemanager",
            sourcePath: "node_modules/first"
        };
        var second = {
            compilerOptions: {
                paths: {
                    "secondpath.*": [
                        "src2/*.ts"
                    ]
                }
            },
            include: [
                "secondfile1",
                "secondfile2"
            ],
            exclude: [
                "secondexcluded"
            ],
            files: [
                "secondfiles"
            ],
            packageManager: "incorrectpackagemanager",
            sourcePath: "node_modules/second/"
        };
        var merged = {};
        yield ts.streamImport(merged, [first, second]);
        console.log(JSON.stringify(merged, undefined, 2));
        ts.importConfigs(__dirname + "/tsconfig.json", [ts.getDefaultGlob(__dirname)]); //This will write the results to tsconfig.json in this folder.
    });
})();
//# sourceMappingURL=TestTypescript.js.map