var fs = require('fs-extra');
var Glob = require("glob").Glob;
import {ExternalPromise} from './externalPromise';

interface NodeStats{
    isFile();
    isDirectory();
}

/**
 * Get the node fsstat results for a path. This will return promise.
 */
export function fsstat(path): Promise<NodeStats>{
    var ep = new ExternalPromise<NodeStats>();

    fs.stat(path, (err, stats) =>{
        if(err){ return ep.reject(err); }
        ep.resolve(stats);
    });

    return ep.Promise;
}

/**
 * Find all files that match the given glob. This will ignore any directories.
 */
export function globFiles(globStr: string, ignore?: string | string[]): Promise<string[]>{
    globStr = globStr.replace(/\\/g, '/');

    var ep = new ExternalPromise<string[]>();

    var globOptions: any = {};
    if(ignore){
        globOptions.ignore = ignore;
    }
    
    var mg = new Glob(globStr, globOptions, async (err: Error, files: string[]) =>{
        if(err){
            ep.reject(err);
        }
        else{
            var matches = mg.matches;
            var actuallyFiles: string[] = [];
            for(let i = 0; i < files.length; ++i){
                var file = files[i];
                if((await fsstat(file)).isFile()){
                    actuallyFiles.push(file);
                }
            }
            ep.resolve(actuallyFiles);
        }
    });

    return ep.Promise;
}

export function ensureFile(path: string): Promise<any>{
    var ep = new ExternalPromise();
    fs.ensureFile(path, err =>{
        if (err){ return ep.reject(err); }
        ep.resolve(undefined);
    });
    return ep.Promise;
}

export function ensureDir(path: string): Promise<any>{
    var ep = new ExternalPromise();
    fs.ensureDir(path, err =>{
        if (err){ return ep.reject(err); }
        ep.resolve(undefined);
    });
    return ep.Promise;
}

export function copy(src: string, dest: string){
    var ep = new ExternalPromise();
    fs.copy(src, dest, 
        err => {
            if (err){ return ep.reject(err); }
            ep.resolve();
        });
    return ep.Promise;
}

export interface ReadFileOptions {
    encoding?: string;
    flag?: string;
}

export function readFile(path: string, options?: ReadFileOptions | string): Promise<any>{
    var ep = new ExternalPromise();
    fs.readFile(path, options, (err, data) => {
        if (err){ return ep.reject(err); }
        ep.resolve(data);
    });
    return ep.Promise;
}

export function writeFile(path: string, data: any){
    var ep = new ExternalPromise();
    fs.writeFile(path, data, 
        (err) => {
            if (err){ return ep.reject(err); }
            ep.resolve();
        });
    return ep.Promise;
}

export function appendFile(path: string, data: any){
    var ep = new ExternalPromise();
    fs.appendFile(path, data, 
        (err) => {
            if (err){ return ep.reject(err); }
            ep.resolve();
        });
    return ep.Promise;
}

export function emptyDir(path: string): Promise<any>{
    var ep = new ExternalPromise();
    fs.emptyDir(path, (err, data) => {
        if (err){ return ep.reject(err); }
        ep.resolve(data);
    });
    return ep.Promise;
}

/**
 * Delete a file
 * @param path the path to the file to delete.
 */
export function unlinkFile(path: string): Promise<unknown>{
    var ep = new ExternalPromise();
    fs.unlink(path, (err) => {
        if (err){ return ep.reject(err); }
        ep.resolve();
    });
    return ep.Promise;
}

export function getLineEndings(data: string, noEndingsMode?: string) {
    if(noEndingsMode === undefined) {
        noEndingsMode = "\n";
    }
    
    if(data.search(/\r/) > -1 || data.search(/\r\n/) > -1) {
        return "\r\n";
    } 
    else if(data.search(/\n/) > -1) {
        return "\n";
    } 
    else {
        return noEndingsMode;
    }
}

export function rename(oldPath: string, newPath: string){
    var ep = new ExternalPromise();
    fs.rename(oldPath, newPath, 
        (err) => {
            if (err){ return ep.reject(err); }
            ep.resolve();
        });
    return ep.Promise;
}