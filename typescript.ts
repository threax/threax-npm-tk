import {ExternalPromise} from './externalPromise';
import * as io from './io';

var exec = require('child_process').exec;
var path = require('path');

export interface TypescriptOptions{
    /**
     * The folder to use for the tsc working directory. Set this to the directory your tsconfig resides in. 
     */
    projectFolder?: string;
}

interface ExecOptions{
    cwd?: string;
}

export function tsc(options?: TypescriptOptions): Promise<void>{
    var execOptions: ExecOptions = {};

    if(options && options.projectFolder){
        execOptions.cwd = options.projectFolder;
    }

    var ep = new ExternalPromise<void>();
    var child = exec('tsc', execOptions,
        function (error, stdout, stderr) {
            if (stdout) {
                console.log('tsc: ' + stdout);
            }
            if (stderr) {
                console.log('tsc error: ' + stderr);
            }
            if (error !== null) {
                console.log('tsc exec error: ' + error);
                ep.reject(error);
            }
            else{
                ep.resolve();
            }
        });
    return ep.Promise;
}

export interface ImportConfigOptions{
    /**
     * A set of globs to describe what files to open for merge.
     */
    globs: string[];
}

export interface Paths{
    [key: string]: string[];
}

export interface CompilerOptions{
    paths?: Paths;
}

/**
 * This interface defines the parts of tsconfig.json that we care about.
 */
export interface TsConfig{
    compilerOptions?: CompilerOptions;
    include?: string[];
    exclude?: string[];
    files?: string[];
}

/**
 * This is the customized ts import.
 */
export interface TsImport extends TsConfig{

    /**
     * If this string is found on an import it will become the package manager, which
     * means it is the first file in the compiled output.
     */
    packageManager?: string;

    /**
     * This is the path that this import was loaded from. This path should be relative
     * to your project root if you are specifying it manually.
     */
    sourcePath: string;
}

const defaultGlob = "node_modules/*/*tsimport.json";

/**
 * Get the default glob relative to the rootPath specified. The default glob is "node_modules\*\*tsimport.json",
 * which is all tsimport.json files in the root node_modules folder.
 * @param rootPath The root path of the project. It must contain a node_modules folder.
 */
export function getDefaultGlob(rootPath: string){
    return path.join(rootPath, defaultGlob);
}

/**
 * Load the project config and import all of the files matching the importGlobs into it.
 * This will always replace the compileroptions->paths, include, exclude and files properties
 * in your destination config. If you need to have project specific config for one of these properties, 
 * supply a glob for it.
 */
export async function importConfigs(projectConfig: string, importGlobs: string[]): Promise<void>{
    var rootPath = path.dirname(projectConfig);
    var json: string;
    var imported: TsImport
    var imports: TsImport[] = [];

    for(let i = 0; i < importGlobs.length; ++i){
        var globs = await io.globFiles(importGlobs[i]);
        for(let j = 0; j < globs.length; ++j){
            let currentGlob = globs[j];
            json = await io.readFile(currentGlob);
            imported = JSON.parse(json);
            imported.sourcePath = path.relative(rootPath, path.dirname(currentGlob));
            imports.push(imported);
        }
    }

    var loadedConfig: TsConfig;
    try{
        json = await io.readFile(projectConfig);
        loadedConfig = JSON.parse(json);
    }
    catch(err){
        loadedConfig = {};
    }

    await streamImport(loadedConfig, imports);

    json = JSON.stringify(loadedConfig, undefined, 2);
    await io.writeFile(projectConfig, json);
}

export async function streamImport(dest: TsConfig, imports: TsImport[]): Promise<void>{
    //Reset everything we replace
    if(!dest.compilerOptions){
        dest.compilerOptions = {};
    }
    dest.compilerOptions.paths = {};
    dest.include = [];
    dest.exclude = [];
    dest.files = [];

    for(let i = 0; i < imports.length; ++i){
        mergeImports(imports[i], <TsImport>dest);
    }

    //If a packageManager node got defined, remove it and add it as the first file in the files list.
    //This is always done last so it will work.
    if((<TsImport>dest).packageManager){
        if(!dest.files){
            dest.files = [];
        }
        dest.files.splice(0, 0, (<TsImport>dest).packageManager);
        delete (<TsImport>dest).packageManager;
    }
}

function mergeConfigs(src: TsImport, dest: TsConfig){
    //Merge compiler options
    if(src.compilerOptions){
        if(!dest.compilerOptions){
            dest.compilerOptions = {};
        }
        mergeCompilerOptions(src.compilerOptions, dest.compilerOptions, src.sourcePath);
    }
    if(src.include){
        if(!dest.include){
            dest.include = [];
        }
        mergePaths(src.include, dest.include, src.sourcePath);
    }
    if(src.exclude){
        if(!dest.exclude){
            dest.exclude = [];
        }
        mergePaths(src.exclude, dest.exclude, src.sourcePath);
    }
    if(src.files){
        if(!dest.files){
            dest.files = [];
        }
        mergePaths(src.files, dest.files, src.sourcePath);
    }
}

function mergeImports(src: TsImport, dest: TsImport){
    mergeConfigs(src, dest);
    //Merge package manager if it is not already set, first one found wins
    if(src.packageManager && !dest.packageManager){
        dest.packageManager = path.join(src.sourcePath, src.packageManager);
    }
}

function mergeCompilerOptions(src: CompilerOptions, dest:CompilerOptions, basePath: string){
    if(src.paths){
        if(!dest.paths){
            dest.paths = {};
        }

        var srcPaths = src.paths;
        var destPaths = dest.paths;

        for(let key in srcPaths){
            if(!destPaths[key]){
                destPaths[key] = [];
            }
            mergePaths(srcPaths[key], destPaths[key], basePath);
        }
    }
}

function mergePaths(src: string[], dest: string[], basePath: string){
    for(let i = 0; i < src.length; ++i){
        dest.push(path.join(basePath, src[i]));
    }
}