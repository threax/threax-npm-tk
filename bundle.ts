import * as io from './io';
import * as sass from './sass';

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
        toplevel: false,
        compress: true,
        mangle: {
            reserved: ["jsns"]
        }
    };

    let ext = path.extname(settings.out).toLowerCase();
    let isJs = ext.endsWith(".js");
    let isCss = ext.endsWith(".css");
    if(settings.minify && !isJs && !isCss) {
        throw new Error(`Cannot determine if output file ${settings.out} is a javascript or css file and minification is turned on. Canceling bundle since output format cannot be determined.`)
    }

    try {
    await io.unlinkFile(settings.out);
    }
    catch(err){
        //Exceptions for flow control, this is their reccomendation, node: the q stands for quality.
    }
    await io.ensureFile(settings.out);
    for(let i = 0; i < settings.input.length; ++i){
        let input = settings.input[i];
        let file = path.join(input);

        let data = await io.readFile(file, {encoding: settings.encoding});
        let lineEnding = io.getLineEndings(data);

        if(settings.minify) {
            if(isJs) {
                let terserResult = Terser.minify(data, terserOptions);
                if(terserResult.error){
                    throw terserResult.error;
                }
                data = terserResult.code;
            }

            if(isCss) {
                var sassResult = await sass.compileSassPromise({
                    data: data,
                    outputStyle: "compressed"
                });
                data = sassResult.css;
            }
        }
        await io.appendFile(settings.out, data + lineEnding);
    }
}