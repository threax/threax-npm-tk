﻿import {ExternalPromise} from './externalPromise';

var lessc = require('less');
var fs = require('fs-extra');
var Glob = require("glob").Glob;
var path = require('path');

export interface LessConfig {
    encoding: string;
    importPaths: string[];
    input: string;
    basePath: string;
    out: string;
    compress: boolean;
}

export function compile(settings: LessConfig) {
    var ep = new ExternalPromise();

    if(!settings.basePath){
        return ep.reject(new Error("Cannot find basePath setting when compiling less for " + settings.input));
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

function compileFile(settings, inFile, outFile){
    var ep = new ExternalPromise();

    fs.readFile(inFile, settings.encoding, (err, data) => {
        if (err){ return ep.reject(err); }
        lessc.render(data,
            {
                paths: settings.importPaths,
                filename: inFile,
                compress: settings.compress
            },
            (err, output) => {
                if (err){ return ep.reject(err); }
                fs.ensureFile(outFile, 
                    (err) => {
                        if (err){ return ep.reject(err); }
                        fs.writeFile(outFile, output.css, 
                            (err) => {
                                if (err){ return ep.reject(err); }
                                ep.resolve();
                            });
                    });
            });
    });

    return ep.Promise;
}