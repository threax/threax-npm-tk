import {ExternalPromise} from './externalPromise';
import * as io from './io';

var exec = require('child_process').exec;
var Glob = require("glob").Glob;
var path = require('path');

export interface SassConfig {
    importPaths: string[];
    input: string;
    basePath: string;
    out: string;
}

export function compile(settings: SassConfig) {

    var ep = new ExternalPromise();

    if(!settings.basePath){
        return ep.reject(new Error("Cannot find basePath setting when compiling sass for " + settings.input));
    }

    var basePath = path.join(settings.basePath);

    var mg = new Glob(settings.input, {}, (err, files) =>{
        if(err){
            ep.reject(err);
        }
        else if(files && files.length > 0){
            var compilePromises = [];
            for(var i = 0; i < files.length; ++i){
                var file = path.join(files[i]);
                var outFile = path.join(settings.out, file.substr(basePath.length));
                var parsed = path.parse(outFile);
                outFile = path.join(parsed.dir, parsed.name + ".css");
                compilePromises.push(compileFile(settings, file, outFile));
            }

            Promise.all(compilePromises)
                .then(r =>{
                    ep.resolve();
                })
                .catch(err => {
                    ep.reject(err);   
                });
        }
        else{
            ep.resolve();
        }
    });

    return ep.Promise;
}

async function compileFile(settings, inFile, outFile){
    var output = await compileSassPromise({
        input: inFile,
        output: outFile,
        includePaths: settings.importPaths,
        outputStyle: "compressed"
    });
}

interface SassSettings{
    input: string;
    output: string;
    includePaths?: string[];
    outputStyle?: "expanded" | "compressed";
}

interface ExecOptions{
    cwd?: string;
}

export function compileSassPromise(options: SassSettings): Promise<void> {
    var execOptions: ExecOptions = {};

    var command = 'sass --no-source-map ';
    if(options.includePaths){
        for(let i = 0; i < options.includePaths.length; ++i){
            var item = options.includePaths[i];
            command += `--load-path=${item} `;
        }
    }

    if(options.outputStyle){
        command += `--style=${options.outputStyle} `;
    }

    command += `${options.input} ${options.output}`;
    //console.log(command);

    var ep = new ExternalPromise<void>();
    var child = exec(command, execOptions,
        function (error, stdout, stderr) {
            if (stdout) {
                console.log('sass: ' + stdout);
            }
            if (stderr) {
                console.log('sass error: ' + stderr);
            }
            if (error !== null) {
                console.log('sass exec error: ' + error);
                ep.reject(error);
            }
            else{
                ep.resolve();
            }
        });
    return ep.Promise;
}