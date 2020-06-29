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
const artifact = require("./artifacts");
const io = require("./io");
const ts = require("./typescript");
var path = require('path');
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        //Print version number
        var packageJsonLocation = path.join(__dirname, "package.json");
        var packageJson = yield io.readFile(packageJsonLocation);
        var pkg = JSON.parse(packageJson);
        console.log("threax-npm-tk version " + pkg.version);
        if (process.argv.length < 3) {
            console.log("You must include a command. Type threax-npm-tk help for help.");
            process.exit(1);
        }
        var filesDir = process.cwd();
        var outPath = "wwwroot";
        var artifactsGlob = [];
        var verbose = false;
        //Process command line args
        for (var i = 3; i < process.argv.length; i += 2) {
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
        var outDir = path.join(filesDir, outPath);
        try {
            switch (process.argv[2]) {
                case 'build':
                    console.log("Building " + filesDir + " to " + outDir);
                    yield artifact.importConfigs(filesDir, outDir, artifactsGlob, verbose);
                    console.log("Build sucessful");
                    break;
                case 'clean':
                    yield io.emptyDir(outDir);
                    console.log("Cleaned " + outDir);
                    break;
                case 'help':
                    console.log("build - Build the project based on artifact.json files.");
                    console.log("clean - Clean the output directory.");
                    console.log("tsconfig - Import all the tsimport.json files in your project into your tsconfig.json file. This includes all the top level directories in node_modules and a tsimport.json in the working directory.");
                    console.log("help - Display help.");
                    console.log("Optional arguments, these go after the main command:");
                    console.log("-o -> Specify output folder, defaults to wwwroot. When cleaning this is the folder to be cleaned.");
                    console.log("-a -> Specify an archive.json file. Can be any filename and supports globbing e.g. node_modules/*/custom-artifacts.json. This argument can appear multiple times. By default this is artifacts.json in the source directory and node_modules/*/artifacts.json.");
                    console.log("-s -> Specify the source directory. Defaults to the current working directory. All paths are relative to this path.");
                    console.log("-v -> Verbose output. Use -v true to make it work. Default is false.");
                    break;
                case 'tsconfig':
                    //Import tsconfig files
                    var projectImport = path.join(filesDir, "tsimport.json");
                    var defaultImport = ts.getDefaultGlob(filesDir);
                    var tsconfig = path.join(filesDir, "tsconfig.json");
                    ts.importConfigs(tsconfig, [projectImport, defaultImport]);
                    break;
                default:
                    console.log("Unknown command " + process.argv[2]);
                    break;
            }
        }
        catch (err) {
            console.log(JSON.stringify(err));
            process.exit(1);
        }
    });
})();
//# sourceMappingURL=run.js.map