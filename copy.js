"use strict";
var fs = require('fs-extra');

module.exports.file = function (fileIn, fileOut) {
    fs.copy(
        fileIn,
        fileOut,
        err => {
            if (err){ return console.error(err); }
            console.log("Copied " + fileIn + " to " + fileOut);
        }
    );
};

module.exports.dir = function (files, out) {
    fs.ensureDir(out, err =>{
        if (err){ return console.error(err); }
        fs.copy(
            files,
            out,
            err => {
                if (err){ return console.error(err); }
                console.log("Copied " + files + " to " + out);
            }
        );
    });
};