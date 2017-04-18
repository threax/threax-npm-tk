"use strict";
import {ExternalPromise} from './externalPromise';
import * as io from './io';

var path = require('path');

async function copyFile(fileIn, fileOut) {
    await io.ensureFile(fileOut);
    await io.copy(fileIn, fileOut);
};
module.exports.file = copyFile;

module.exports.dir = async function (files, out) {
    await io.ensureDir(out);
    await io.copy(files, out);
};

module.exports.glob = async function (inGlob, basePath, outDir) {
    var files = await io.glob(inGlob);
    basePath = path.join(basePath, "."); //resolve the path, removes any ../
    for(var i = 0; i < files.length; ++i){
        var file = files[i];
        var outFile = path.join(outDir, file.substr(basePath.length));
        await copyFile(file, outFile);
    }
};