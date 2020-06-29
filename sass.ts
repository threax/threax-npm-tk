import {ExternalPromise} from './externalPromise';
import * as io from './io';

var sass = require('node-sass');
var fs = require('fs-extra');
var Glob = require("glob").Glob;
var path = require('path');

export interface SassConfig {
    encoding: string;
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
    var data = await io.readFile(inFile, { encoding: settings.encoding });
    var output = await compileSassPromise({
        data: data,
        includePaths: settings.importPaths
    });
    await io.ensureFile(outFile);
    await io.writeFile(outFile, output.css);
}

export interface SassSettings{
    data?: string;
    includePaths?: string[];
    outputStyle?: "nested" | "expanded" | "compact" | "compressed";
}

export interface SassResult{
    css?: string;
}

export function compileSassPromise(options: SassSettings): Promise<SassResult> {
    let ep = new ExternalPromise<SassResult>();
    sass.render(options,
        (err, output) => {
            if (err) {
                 return ep.reject(err); 
            }
            else {
                ep.resolve(output);
            }
        });

    return ep.Promise;
}