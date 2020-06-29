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
const ts = require("./typescript");
var path = require('path');
/**
 * This is a default import that should work for most projects. It will scan
 * the cwd of the call to this file for a tsconfig.json. It will import
 * a tsimport.json from the same folder, which can have project defaults, from
 * there it will load all the top level tsimport.jsons from the node_modules
 * folder. If you need to do something more custom you can import typescript
 * into a custom build folder and use the methods there to import.
 *
 * This is here mostly for backward compatibility now.
 */
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        var cwd = process.cwd();
        var projectImport = path.join(cwd, "tsimport.json");
        var defaultImport = ts.getDefaultGlob(cwd);
        var tsconfig = path.join(cwd, "tsconfig.json");
        ts.importConfigs(tsconfig, [projectImport, defaultImport]);
    });
})();
//# sourceMappingURL=tsimport.js.map