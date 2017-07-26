import * as io from './io';
import * as copy from './copy';
import * as less from './less';
var path = require('path');

const defaultGlob = "node_modules/*/artifacts.json";

/**
 * Get the default glob relative to the rootPath specified. The default glob is "node_modules\*\*tsimport.json",
 * which is all tsimport.json files in the root node_modules folder.
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
}

/**
 * Load the project config and import all of the files matching the importGlobs into it.
 * This will always replace the compileroptions->paths, include, exclude and files properties
 * in your destination config. If you need to have project specific config for one of these properties, 
 * supply a glob for it.
 */
export async function importConfigs(rootPath: string, outDir: string, importGlobs: string[]): Promise<void> {
    var json: string;
    var imported: Artifacts[];

    for (let i = 0; i < importGlobs.length; ++i) {
        var globs = await io.globFiles(importGlobs[i]);
        for (let j = 0; j < globs.length; ++j) {
            let currentGlob = globs[j];
            try {
                json = await io.readFile(currentGlob);
                imported = JSON.parse(json);
                if(!Array.isArray(imported)){
                    imported = [imported];
                }
                for(let j = 0; j < imported.length; ++j){
                    var currentGlobDir = path.dirname(currentGlob);
                    await copyFiles(imported[j], outDir, currentGlobDir);
                    await compileLess(imported[j], outDir, currentGlobDir);
                }
            }
            catch (err) {
                console.error("Could not load " + currentGlob + "\nReason:" + err.message);
                throw err;
            }
        }
    }
}

function copyFiles(imported: Artifacts, outDir: string, artifactPath: string): Promise<any[]> {
    var promises = [];

    var basePath = artifactPath;
    if(imported.pathBase !== undefined){
        basePath = path.join(basePath, imported.pathBase);
    }
    if(imported.copy){
        var outputPath = path.join(outDir, imported.outDir);
        for(let j = 0; j < imported.copy.length; ++j) {
            var full = path.join(artifactPath, imported.copy[j]);
            // console.log(full);
            // console.log(outputPath);
            // console.log(sourcePath);
            promises.push(copy.glob(full, basePath, outputPath, imported.ignore));
        }
    }

    return Promise.all(promises);
}

function compileLess(imported: Artifacts, outDir: string, artifactPath: string): Promise<any>{
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

            promises.push(less.compile(lessOptions));
        }
    }

    return Promise.all(promises);
}