import * as ts from './typescript';

var path = require('path');

(async function(){
    var cwd = process.cwd();
    var projectImport = path.join(cwd, "tsimport.json");
    var defaultImport = ts.getDefaultGlob(cwd);
    var tsconfig = path.join(cwd, "tsconfig.json");
    ts.importConfigs(tsconfig, [projectImport, defaultImport]);
})();