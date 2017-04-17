"use strict";
var fs = require('fs-extra');
var externalPromise = require('threax-npm-tk/externalPromise');
var Glob = require("glob").Glob;
var path = require('path');

function copyFile(fileIn, fileOut) {
    var ep = new externalPromise();
    fs.ensureFile(fileOut, err =>{
        if (err){ return ep.reject(err); }
        fs.copy(
            fileIn,
            fileOut,
            err => {
                if (err){ return ep.reject(err); }
                ep.resolve();
            }
        );
    });
    return ep.Promise;
};
module.exports.file = copyFile;

module.exports.dir = function (files, out) {
    var ep = new externalPromise();
    fs.ensureDir(out, err =>{
        if (err){ return ep.reject(err); }
        fs.copy(
            files,
            out,
            err => {
                if (err){ return ep.reject(err); }
                ep.resolve();
            }
        );
    });
    return ep.Promise;
};

module.exports.glob = function (inGlob, basePath, outDir) {
    var ep = new externalPromise();
    
    var mg = new Glob(inGlob, {}, (err, files) =>{
        if(err){
            ep.reject(err);
        }
        else if(files && files.length > 0){
            var compilePromises = [];
            for(var i = 0; i < files.length; ++i){
                var file = files[i];
                var outFile = path.join(outDir, file.substr(basePath.length));
                compilePromises.push(copyFile(file, outFile));
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
};