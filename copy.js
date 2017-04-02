"use strict";
var fs = require('fs-extra');

module.exports.file = function (fileIn, fileOut) {
    fs.ensureFile(fileOut, err =>{
        if (err){ return console.error(err); }
        fs.copy(
            fileIn,
            fileOut,
            err => {
                if (err){ return console.error(err); }
            }
        );
    });
};

module.exports.dir = function (files, out) {
    fs.ensureDir(out, err =>{
        if (err){ return console.error(err); }
        fs.copy(
            files,
            out,
            err => {
                if (err){ return console.error(err); }
            }
        );
    });
};