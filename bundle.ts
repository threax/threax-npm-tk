import * as io from './io';

var Terser = require("terser");
var fs = require('fs-extra');
var Glob = require("glob").Glob;
var path = require('path');

export interface BundleConfig {
    encoding: string;
    input: string[];
    basePath: string;
    out: string;
    minify: boolean;
}

interface FileLoadResult {
    file: string,
    data: string
}

export async function compile(settings: BundleConfig): Promise<any> {

    if(!settings.basePath){
        throw new Error("Cannot find basePath setting when compiling bundle for " + settings.input);
    }

    var terserOptions = {
        toplevel: true,
        compress: true,
        mangle: true
    };

    try {
    await io.unlinkFile(settings.out);
    }
    catch(err){
        //Exceptions for flow control, this is their reccomendation, node: the q stands for quality.
    }
    await io.ensureFile(settings.out);
    for(let i = 0; i < settings.input.length; ++i){
        let input = settings.input[i];

        var file = path.join(input);
        var data = await io.readFile(file, {encoding: settings.encoding});
        if(settings.minify) {
            let terserResult = Terser.minify(data, terserOptions);
            if(terserResult.error){
                throw terserResult.error;
            }
            data = terserResult.code;
        }
        await io.appendFile(settings.out, data);
    }
}