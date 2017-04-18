import {ExternalPromise} from './externalPromise';

var lessc = require('less');
var fs = require('fs-extra');
var Glob = require("glob").Glob;
var path = require('path');

var defaultSettings = {
    encoding: 'utf8',
    importPaths: [],
    input: null,
    out: null,
    compress: true,
    basePath: null,
}

export function compile(settings) {
    var ep = new ExternalPromise();

    settings.prototype = defaultSettings;
    
    //Check for old style and throw errors
    if(settings.inFile){
        return ep.reject(new Error("settings.infile is deprecated, please use settings.input and specify a glob when compiling less for " + settings.paths));
    }
    if(settings.outFile){
        return ep.reject(new Error("settings.outFile is deprecated, please use settings.out and settings.basePath when compiling less for " + settings.paths));
    }

    if(!settings.basePath){
        return ep.reject(new Error("Cannot find basePath setting when compiling less for " + settings.paths));
    }

    var mg = new Glob(settings.input, {}, (err, files) =>{
        if(err){
            ep.reject(err);
        }
        else if(files && files.length > 0){
            var compilePromises = [];
            for(var i = 0; i < files.length; ++i){
                var file = files[i];
                var outFile = path.join(settings.out, file.substr(settings.basePath.length));
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