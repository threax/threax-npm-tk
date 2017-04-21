import {ExternalPromise} from './externalPromise';

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