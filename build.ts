import { tsc } from './typescript';
import * as artifact from './artifacts';

var filesDir = process.cwd();
var outDir = filesDir + "/wwwroot";
var mainArtifacts = filesDir + '/artifacts.json';

console.log("Building " + filesDir + " to " + outDir);

(async function () {
    try{
        await tsc({
            projectFolder: filesDir
        });

        await artifact.importConfigs(filesDir, outDir, [mainArtifacts, artifact.getDefaultGlob(filesDir)]);
    }
    catch(err){
        console.log(JSON.stringify(err));
        process.exit(1);
    }
})();