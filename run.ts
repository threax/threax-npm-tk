import { tsc } from './typescript';
import * as artifact from './artifacts';
import * as io from './io';

(async function () {
    var filesDir = process.cwd();
    var outDir = filesDir + "/wwwroot";
    var mainArtifacts = filesDir + '/artifacts.json';

    if(process.argv.length < 3){
        console.log("You must include a command. Type threax-npm-tk help for help.");
    }
    try{
        switch(process.argv[2]){
            case 'build':
                    console.log("Building " + filesDir + " to " + outDir);

                    await tsc({
                        projectFolder: filesDir
                    });

                    await artifact.importConfigs(filesDir, outDir, [mainArtifacts, artifact.getDefaultGlob(filesDir)]);
                break;
            case 'clean':
                await io.emptyDir(outDir);
                break;
            case 'help':
                console.log("build - Build the project based on artifact.json files.");
                console.log("clean - Clean the output directory.");
                console.log("help - Display help.");
                break;
            default:
                console.log("Unknown command " + process.argv[2]);
                break;
        }
    }
    catch(err){
        console.log(JSON.stringify(err));
        process.exit(1);
    }
})();