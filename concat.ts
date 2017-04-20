import {ExternalPromise} from './externalPromise';
import * as io from './io';

var fs = require('fs-extra');

module.exports = async function(files: string[], outFile: string, ignore?: string | string[]) {
    var ensurePromise = io.ensureFile(outFile);

    var separator = "";
    var output = "";
    for(var i = 0; i < files.length; ++i){
        var glob = files[i];
        var globbed = await io.globFiles(glob, ignore);
        for(var j = 0; j < globbed.length; ++j){
            output += separator + await io.readFile(globbed[j]);
            separator = ';\n';
        }
    }

    await ensurePromise;

    await io.writeFile(outFile, output);
}