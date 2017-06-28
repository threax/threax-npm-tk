import * as ts from './typescript';

var path = require('path');

/**
 * This is a default import that should work for most projects. It will scan
 * the cwd of the call to this file for a tsconfig.json. It will import
 * a tsimport.json from the same folder, which can have project defaults, from
 * there it will load all the top level tsimport.jsons from the node_modules
 * folder. If you need to do something more custom you can import typescript
 * into a custom build folder and use the methods there to import.
 */
(async function(){
    var cwd = process.cwd();
    var projectImport = path.join(cwd, "tsimport.json");
    var defaultImport = ts.getDefaultGlob(cwd);
    var tsconfig = path.join(cwd, "tsconfig.json");
    ts.importConfigs(tsconfig, [projectImport, defaultImport]);
})();