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
    var ep = new ExternalPromise();

    fs.stat(path, (err, stats) =>{
        if(err){ return ep.reject(err); }
        ep.resolve(stats);
    });

    return ep.Promise;
}

/**
 * Find all files that match the given glob. This will ignore any directories.
 */
export function globFiles(globStr: string): Promise<string[]>{
    globStr = globStr.replace(/\\/g, '/');

    var ep = new ExternalPromise();
    
    var mg = new Glob(globStr, {}, async (err: Error, files: string[]) =>{
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