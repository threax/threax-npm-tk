var fs = require('fs-extra');
var Glob = require("glob").Glob;
import {ExternalPromise} from './externalPromise';

export function glob(globStr: string): Promise<string[]>{
    var ep = new ExternalPromise();
    
    var mg = new Glob(globStr, {}, async (err: Error, files: string[]) =>{
        if(err){
            ep.reject(err);
        }
        else{
            ep.resolve(files);
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