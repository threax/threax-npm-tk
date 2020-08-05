import * as io from './io';
import * as copy from './copy';
import * as sass from './sass';
import * as typescript from './typescript';
import * as jsnsTools from './jsnstools';
import * as bundle from './bundle';
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
    ignore?: string | string[];
    typescript?: typescript.TsArtifactOptions;
    sass?: sass.SassConfig[];
    bundle?: bundle.BundleConfig[];
}

/**
 * Load the and process the specified artifacts.json files.
 */
export async function importConfigs(rootPath: string, outDir: string, importGlobs: string[], verbose?: boolean): Promise<void> {
    var json: string;
    var imported: Artifacts[];

    //Do primary builds
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

    //Then bundle
    for (let i = 0; i < importGlobs.length; ++i) {
        var globs = await io.globFiles(importGlobs[i]);
        for (let j = 0; j < globs.length; ++j) {
            let currentGlob = globs[j];
            try {
                if(verbose){
                    console.log("Bundling " + currentGlob);
                }
                json = await io.readFile(currentGlob);
                imported = JSON.parse(json);
                if(!Array.isArray(imported)){
                    imported = [imported];
                }
                for(let j = 0; j < imported.length; ++j){
                    var currentGlobDir = path.dirname(currentGlob);
                    await compileBundle(imported[j], outDir, currentGlobDir, verbose);
                }
            }
            catch (err) {
                console.error("Could not load " + currentGlob + "\nReason:" + err.message + "\Stack:" + err.stack);
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

        if(imported.typescript.copyToJsModules && imported.typescript.shakeModules) {
            throw new Error("You cannot turn on both copyToJsModules and shakeModules when compiling Typescript.");
        }
        
        if(imported.typescript.shakeModules) {
            //Try to load the tsconfig from the artifact path. This will determine the input file
            let tscOutputFile;
            let json = await io.readFile(artifactPath + '/tsconfig.json');
            let tsConfig = JSON.parse(json);
            if(tsConfig.compilerOptions && tsConfig.compilerOptions.outFile){
                tscOutputFile = tsConfig.compilerOptions.outFile;
            }

            let shakenOutputFile;
            //If the artifacts file defines a shake output file, use that path following the defined paths in the artifacts.json file
            if(imported.typescript.shakeModules.outFile){
                shakenOutputFile = path.join(imported.outDir, imported.typescript.shakeModules.outFile);
                shakenOutputFile = path.join(outDir, shakenOutputFile);
            }
            else{
                //Discover location of typescript output, use that path unless an outfile is specified in the shake options
                //Typescript outputs using the tsconfig settings, so we use artifactPath here.
                let tscOutPath = path.dirname(tscOutputFile);
                let shakenFile = path.basename(tscOutputFile, '.js') + ".shake.js";
                shakenOutputFile = path.join(artifactPath, tscOutPath, shakenFile);
            }

            //Scope to output path
            tscOutputFile = path.join(artifactPath, tscOutputFile);

            if(verbose){
                console.log('  Shaking jsns modules from ' + tscOutputFile + ' to ' + shakenOutputFile);
            }

            await jsnsTools.saveLoadedModules(tscOutputFile, imported.typescript.shakeModules.runners, shakenOutputFile);
        }

        if(imported.typescript.copyToJsModules) {
            let json = await io.readFile(artifactPath + '/tsconfig.json');
            let tsConfig = JSON.parse(json);
            if(!tsConfig.compilerOptions) {
                throw new Error("Your tsconfig.json file must have a compilerOptions section set to use copyToJsModules");
            }
            let tsOutDir = tsConfig.compilerOptions.outDir;
            if(!tsOutDir) {
                throw new Error("Your tsconfig.json file must have a compilerOptions.outDir value set to use copyToJsModules");
            }

            let finalDir = imported.outDir;
            if(finalDir) {
                finalDir = path.join(outDir, finalDir);
            }
            else {
                //Use the ts out dir as the final dir if one was not specified.
                //This is just relative to the artifact path since that is how the tsconfig will work
                finalDir = path.join(artifactPath, tsOutDir);
            }

            tsOutDir = path.join(artifactPath, tsOutDir);

            let paths: any = tsConfig.compilerOptions.paths;
            if(!paths) {
                throw new Error("Your tsconfig.json file must have a compilerOptions.paths value set to use copyToJsModules");
            }

            await io.ensureDir(finalDir);

            //Copy all files specified in paths renaming them to match the namespaced name.
            for (let key in paths) {
                let current: string[] = paths[key];
                let baseName: string = key.substr(0, key.length - 1);
                for(let i = 0; i < current.length; ++i) {
                    let lookup = path.join(tsOutDir, current[i]);
                    let globs = await io.globFiles(lookup);
                    if(verbose) {
                        console.log(`Copying javascript modules from: ${lookup} to ${finalDir} with baseName: ${baseName}`);
                    }
                    for(let j = 0; j < globs.length; ++j) {
                        let source = globs[j];
                        let dest = path.join(finalDir, baseName + path.basename(source));
                        await io.rename(source, dest);
                    }
                }
            }

            //Copy all remaining files
            copy.dir(tsOutDir, finalDir);
        }
    }
}

function compileBundle(imported: Artifacts, outDir: string, artifactPath: string, verbose: boolean): Promise<any>{
    var promises = [];

    var basePath = artifactPath;
    if(imported.pathBase !== undefined){
        basePath = path.join(basePath, imported.pathBase);
    }
    if(imported.bundle){
        if(!Array.isArray(imported.bundle)){
            imported.bundle = [imported.bundle];
        }
        var outputPath = path.join(outDir, imported.outDir);
        for(let j = 0; j < imported.bundle.length; ++j) {
            var bundleOptions = imported.bundle[j];
            if(bundleOptions.input !== undefined){
                for(let k = 0; k < bundleOptions.input.length; ++k){
                    bundleOptions.input[k] = path.join(artifactPath, bundleOptions.input[k]);
                }
            }
            if(bundleOptions.basePath !== undefined){
                bundleOptions.basePath = path.join(basePath, bundleOptions.basePath);
            }
            else{
                bundleOptions.basePath = basePath;
            }
            if(bundleOptions.out !== undefined){
                bundleOptions.out = path.join(outputPath, bundleOptions.out);
            }
            else{
                bundleOptions.out = outputPath;
            }
            if(bundleOptions.encoding === undefined){
                bundleOptions.encoding = 'utf8';
            }

            if(verbose){
                console.log("  Compiling bundle " + bundleOptions.input + " to " + bundleOptions.out);
            }

            promises.push(bundle.compile(bundleOptions));
        }
    }

    return Promise.all(promises);
}