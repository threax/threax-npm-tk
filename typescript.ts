import {ExternalPromise} from './externalPromise';
import * as io from './io';

var exec = require('child_process').exec;

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
     * This is the path that this import was loaded from. All paths in the file
     * will be relative to this path - the base path.
     */
    sourcePath: string;
}

/**
 * Load the project config and import all of the files matching the importGlobs into it.
 * This will always replace the compileroptions->paths, include, exclude and files properties
 * in your destination config. If you need to have project specific config for one of these properties, 
 * supply a glob for it. If you don't supply a glob, the default will be "node_modules\*\*.tsimport"
 */
export async function importConfigs(projectConfig: string, importGlobs?: string[]): Promise<void>{
    var json;
    if(!importGlobs){
        importGlobs = ["node_modules/*/*.tsimport"] //By default find all tsimport files in a flat structure
    }

    var imports: TsImport[] = [];
    for(let i = 0; i < importGlobs.length; ++i){
        var globs = await io.globFiles(importGlobs[i])
        for(let j = 0; j < globs.length; ++i){
            json = await io.readFile(globs[j]);
            imports.push(JSON.parse(json));
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

    json = JSON.stringify(loadedConfig);
    await io.writeFile(projectConfig, json);
}

export async function streamImport(dest: TsConfig, imports: TsImport[]): Promise<void>{
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
        mergeCompilerOptions(src.compilerOptions, dest.compilerOptions);
    }
    if(src.include){
        if(!dest.include){
            dest.include = [];
        }
        mergePaths(src.include, dest.include);
    }
    if(src.exclude){
        if(!dest.exclude){
            dest.exclude = [];
        }
        mergePaths(src.exclude, dest.exclude);
    }
    if(src.files){
        if(!dest.files){
            dest.files = [];
        }
        mergePaths(src.files, dest.files);
    }
}

function mergeImports(src: TsImport, dest: TsImport){
    mergeConfigs(src, dest);
    //Merge package manager if it is not already set, first one found wins
    if(src.packageManager && !dest.packageManager){
        dest.packageManager = src.packageManager;
    }
}

function mergeCompilerOptions(src: CompilerOptions, dest:CompilerOptions){
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
            mergePaths(srcPaths[key], destPaths[key]);
        }
    }
}

function mergePaths(src: string[], dest: string[]){
    for(let i = 0; i < src.length; ++i){
        dest.push(src[i]);
    }
}