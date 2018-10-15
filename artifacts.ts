import * as io from './io';
import * as copy from './copy';
import * as less from './less';
import * as sass from './sass';
import * as typescript from './typescript';
import * as jsnsTools from './jsnstools';
var path = require('path');

const defaultGlob = "node_modules/*/artifacts.json";

/**
 * Get the default glob relative to the rootPath specified. The default glob is "node_modules\*\*artifacts.json",
 * which is all artifacts.json files in the root node_modules folder.
 * @param rootPath The root path of the project. It must contain a node_modules folder.
 */
export function getDefaultGlob(rootPath: string) {
    return path.join(rootPath, defaultGlob);
}

interface Artifacts {
    pathBase?: string;
    outDir?: string;
    copy?: string[];
    less?: less.LessConfig[];
    ignore?: string | string[];
    typescript?: typescript.TsArtifactOptions;
    sass?: sass.SassConfig[];
}

/**
 * Load the and process the specified artifacts.json files.
 */
export async function importConfigs(rootPath: string, outDir: string, importGlobs: string[], verbose?: boolean): Promise<void> {
    var json: string;
    var imported: Artifacts[];

    for (let i = 0; i < importGlobs.length; ++i) {
        var globs = await io.globFiles(importGlobs[i]);
        for (let j = 0; j < globs.length; ++j) {
            let currentGlob = globs[j];
            try {
                if(verbose){
                    console.log("Reading " + currentGlob);
                }
                json = await io.readFile(currentGlob);
                imported = JSON.parse(json);
                if(!Array.isArray(imported)){
                    imported = [imported];
                }
                for(let j = 0; j < imported.length; ++j){
                    var currentGlobDir = path.dirname(currentGlob);
                    await copyFiles(imported[j], outDir, currentGlobDir, verbose);
                    await compileLess(imported[j], outDir, currentGlobDir, verbose);
                    await compileSass(imported[j], outDir, currentGlobDir, verbose);
                    await compileTypescript(imported[j], outDir, currentGlobDir, verbose);
                }
            }
            catch (err) {
                console.error("Could not load " + currentGlob + "\nReason:" + err.message);
                throw err;
            }
        }
    }
}

function copyFiles(imported: Artifacts, outDir: string, artifactPath: string, verbose: boolean): Promise<any[]> {
    var promises = [];

    var basePath = artifactPath;
    if(imported.pathBase !== undefined){
        basePath = path.join(basePath, imported.pathBase);
    }
    if(imported.copy){
        var outputPath = path.join(outDir, imported.outDir);
        for(let j = 0; j < imported.copy.length; ++j) {
            var full = path.join(artifactPath, imported.copy[j]);
            if(verbose){
                console.log("  Copying files " + full + " to " + outputPath);
            }
            promises.push(copy.glob(full, basePath, outputPath, imported.ignore));
        }
    }

    return Promise.all(promises);
}

function compileLess(imported: Artifacts, outDir: string, artifactPath: string, verbose: boolean): Promise<any>{
    var promises = [];

    var basePath = artifactPath;
    if(imported.pathBase !== undefined){
        basePath = path.join(basePath, imported.pathBase);
    }
    if(imported.less){
        if(!Array.isArray(imported.less)){
            imported.less = [imported.less];
        }
        var outputPath = path.join(outDir, imported.outDir);
        for(let j = 0; j < imported.less.length; ++j) {
            var lessOptions = imported.less[j];
            if(lessOptions.importPaths !== undefined){
                for(var i = 0; i < lessOptions.importPaths.length; ++i){
                    lessOptions.importPaths[i] = path.join(artifactPath, lessOptions.importPaths[i]);
                }
            }
            if(lessOptions.input !== undefined){
                lessOptions.input = path.join(artifactPath, lessOptions.input);
            }
            if(lessOptions.basePath !== undefined){
                lessOptions.basePath = path.join(basePath, lessOptions.basePath);
            }
            else{
                lessOptions.basePath = basePath;
            }
            if(lessOptions.out !== undefined){
                lessOptions.out = path.join(outputPath, lessOptions.out);
            }
            else{
                lessOptions.out = outputPath;
            }
            if(lessOptions.encoding === undefined){
                lessOptions.encoding = 'utf8';
            }

            if(verbose){
                console.log("  Compiling less " + lessOptions.input + " to " + lessOptions.out);
            }

            promises.push(less.compile(lessOptions));
        }
    }

    return Promise.all(promises);
}

function compileSass(imported: Artifacts, outDir: string, artifactPath: string, verbose: boolean): Promise<any>{
    var promises = [];

    var basePath = artifactPath;
    if(imported.pathBase !== undefined){
        basePath = path.join(basePath, imported.pathBase);
    }
    if(imported.sass){
        if(!Array.isArray(imported.sass)){
            imported.sass = [imported.sass];
        }
        var outputPath = path.join(outDir, imported.outDir);
        for(let j = 0; j < imported.sass.length; ++j) {
            var sassOptions = imported.sass[j];
            if(sassOptions.importPaths !== undefined){
                for(var i = 0; i < sassOptions.importPaths.length; ++i){
                    sassOptions.importPaths[i] = path.join(artifactPath, sassOptions.importPaths[i]);
                }
            }
            if(sassOptions.input !== undefined){
                sassOptions.input = path.join(artifactPath, sassOptions.input);
            }
            if(sassOptions.basePath !== undefined){
                sassOptions.basePath = path.join(basePath, sassOptions.basePath);
            }
            else{
                sassOptions.basePath = basePath;
            }
            if(sassOptions.out !== undefined){
                sassOptions.out = path.join(outputPath, sassOptions.out);
            }
            else{
                sassOptions.out = outputPath;
            }
            if(sassOptions.encoding === undefined){
                sassOptions.encoding = 'utf8';
            }

            if(verbose){
                console.log("  Compiling sass " + sassOptions.input + " to " + sassOptions.out);
            }

            promises.push(sass.compile(sassOptions));
        }
    }

    return Promise.all(promises);
}

async function compileTypescript(imported: Artifacts, outDir: string, artifactPath: string, verbose: boolean) {
    if(imported.typescript) {
        if(verbose){
            console.log("  Compiling typescript with " + artifactPath + '/tsconfig.json');
        }
        if(imported.typescript.compile) {
            await typescript.tsc({
                projectFolder: artifactPath
            });
        }
        
        if(imported.typescript.shakeModules) {
            //Try to load the tsconfig from the artifact path. This will determine the input file
            var tscOutputFile;
            var json = await io.readFile(artifactPath + '/tsconfig.json');
            var tsConfig = JSON.parse(json);
            if(tsConfig.compilerOptions && tsConfig.compilerOptions.outFile){
                tscOutputFile = tsConfig.compilerOptions.outFile;
            }

            var shakenOutputFile;
            //If the artifacts file defines a shake output file, use that path following the defined paths in the artifacts.json file
            if(imported.typescript.shakeModules.outFile){
                shakenOutputFile = path.join(imported.outDir, imported.typescript.shakeModules.outFile);
                shakenOutputFile = path.join(outDir, shakenOutputFile);
            }
            else{
                //Discover location of typescript output, use that path unless an outfile is specified in the shake options
                //Typescript outputs using the tsconfig settings, so we use artifactPath here.
                var tscOutPath = path.dirname(tscOutputFile);
                var shakenFile = path.basename(tscOutputFile, '.js') + ".shake.js";
                shakenOutputFile = path.join(artifactPath, tscOutPath, shakenFile);
            }

            //Scope to output path
            tscOutputFile = path.join(artifactPath, tscOutputFile);

            if(verbose){
                console.log('  Shaking jsns modules from ' + tscOutputFile + ' to ' + shakenOutputFile);
            }

            await jsnsTools.saveLoadedModules(tscOutputFile, imported.typescript.shakeModules.runners, shakenOutputFile);
        }
    }
}