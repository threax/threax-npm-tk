"use strict";
import {ExternalPromise} from './externalPromise';

var fs = require('fs-extra');
// var externalPromise = require('');
var Glob = require("glob").Glob;
var path = require('path');

async function copyFile(fileIn, fileOut) {
    var ep = new ExternalPromise();
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

module.exports.dir = async function (files, out) {
    var ep = new ExternalPromise();
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

module.exports.glob = async function (inGlob, basePath, outDir) {
    var ep = new ExternalPromise();
    
    var mg = new Glob(inGlob, {}, async (err, files) =>{
        if(err){
            ep.reject(err);
        }
        else if(files && files.length > 0){
            try{
                for(var i = 0; i < files.length; ++i){
                    var file = files[i];
                    var outFile = path.join(outDir, file.substr(basePath.length));
                    await copyFile(file, outFile);
                }

                ep.resolve();
            }
            catch(err){
                ep.reject(err);
            }
        }
        else{
            ep.resolve();
        }
    });

    return ep.Promise;
};