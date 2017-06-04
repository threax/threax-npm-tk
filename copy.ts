"use strict";
import {ExternalPromise} from './externalPromise';
import * as io from './io';

var path = require('path');

export async function file(fileIn, fileOut) {
    await io.ensureFile(fileOut);
    await io.copy(fileIn, fileOut);
};

export async function dir(files, out) {
    await io.ensureDir(out);
    await io.copy(files, out);
};

export async function glob(inGlob: string, basePath: string, outDir: string, ignore?: string | string[]) {
    var files = await io.globFiles(inGlob, ignore);
    basePath = path.join(basePath); //resolve the path, removes any ../
    for (var i = 0; i < files.length; ++i) {
        var inFile = path.join(files[i]);
        var outFile = path.join(outDir, inFile.substr(basePath.length));
        await file(inFile, outFile);
    }
};