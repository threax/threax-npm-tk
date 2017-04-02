"use strict";
var fs = require('fs-extra');
var externalPromise = require('threax-npm-tk/externalPromise');

module.exports.file = function (fileIn, fileOut) {
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