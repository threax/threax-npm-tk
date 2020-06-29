"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamImport = exports.importConfigs = exports.getDefaultGlob = exports.tsc = void 0;
const externalPromise_1 = require("./externalPromise");
const io = require("./io");
var exec = require('child_process').exec;
var path = require('path');
function tsc(options) {
    var execOptions = {};
    if (options && options.projectFolder) {
        execOptions.cwd = options.projectFolder;
    }
    var ep = new externalPromise_1.ExternalPromise();
    var child = exec('tsc', execOptions, function (error, stdout, stderr) {
        if (stdout) {
            console.log('tsc: ' + stdout);
        }
        if (stderr) {
            console.log('tsc error: ' + stderr);
        }
        if (error !== null) {
            console.log('tsc exec error: ' + error);
            ep.reject(error);
        }
        else {
            ep.resolve();
        }
    });
    return ep.Promise;
}
exports.tsc = tsc;
const defaultGlob = "node_modules/*/*tsimport.json";
/**
 * Get the default glob relative to the rootPath specified. The default glob is "node_modules\*\*tsimport.json",
 * which is all tsimport.json files in the root node_modules folder.
 * @param rootPath The root path of the project. It must contain a node_modules folder.
 */
function getDefaultGlob(rootPath) {
    return path.join(rootPath, defaultGlob);
}
exports.getDefaultGlob = getDefaultGlob;
/**
 * Load the project config and import all of the files matching the importGlobs into it.
 * This will always replace the compileroptions->paths, include, exclude and files properties
 * in your destination config. If you need to have project specific config for one of these properties,
 * supply a glob for it.
 */
function importConfigs(projectConfig, importGlobs) {
    return __awaiter(this, void 0, void 0, function* () {
        var rootPath = path.dirname(projectConfig);
        var json;
        var imported;
        var imports = [];
        for (let i = 0; i < importGlobs.length; ++i) {
            var globs = yield io.globFiles(importGlobs[i]);
            for (let j = 0; j < globs.length; ++j) {
                let currentGlob = globs[j];
                try {
                    json = yield io.readFile(currentGlob);
                    imported = JSON.parse(json);
                    imported.sourcePath = path.relative(rootPath, path.dirname(currentGlob));
                    imports.push(imported);
                }
                catch (err) {
                    console.error("Could not load " + currentGlob + "\nReason:" + err.message);
                    throw err;
                }
            }
        }
        var loadedConfig;
        try {
            json = yield io.readFile(projectConfig);
            loadedConfig = JSON.parse(json);
        }
        catch (err) {
            loadedConfig = {};
        }
        yield streamImport(loadedConfig, imports);
        json = JSON.stringify(loadedConfig, undefined, 2);
        yield io.writeFile(projectConfig, json);
    });
}
exports.importConfigs = importConfigs;
function streamImport(dest, imports) {
    return __awaiter(this, void 0, void 0, function* () {
        //Reset everything we replace
        if (dest.compilerOptions) {
            delete dest.compilerOptions.paths;
        }
        delete dest.include;
        delete dest.exclude;
        delete dest.files;
        for (let i = 0; i < imports.length; ++i) {
            mergeImports(imports[i], dest);
        }
        //If a packageManager node got defined, remove it and add it as the first file in the files list.
        //This is always done last so it will work.
        if (dest.packageManager) {
            if (!dest.files) {
                dest.files = [];
            }
            dest.files.splice(0, 0, dest.packageManager);
            delete dest.packageManager;
        }
    });
}
exports.streamImport = streamImport;
function mergeConfigs(src, dest) {
    //Merge compiler options
    if (src.compilerOptions) {
        if (!dest.compilerOptions) {
            dest.compilerOptions = {};
        }
        mergeCompilerOptions(src.compilerOptions, dest.compilerOptions, src.sourcePath);
    }
    if (src.include) {
        if (!dest.include) {
            dest.include = [];
        }
        mergePaths(src.include, dest.include, src.sourcePath);
    }
    if (src.exclude) {
        if (!dest.exclude) {
            dest.exclude = [];
        }
        mergePaths(src.exclude, dest.exclude, src.sourcePath);
    }
    if (src.files) {
        if (!dest.files) {
            dest.files = [];
        }
        mergePaths(src.files, dest.files, src.sourcePath);
    }
}
function mergeImports(src, dest) {
    mergeConfigs(src, dest);
    //Merge package manager if it is not already set, first one found wins
    if (src.packageManager && !dest.packageManager) {
        dest.packageManager = path.join(src.sourcePath, src.packageManager);
    }
}
function mergeCompilerOptions(src, dest, basePath) {
    if (src.paths) {
        if (!dest.paths) {
            dest.paths = {};
        }
        var srcPaths = src.paths;
        var destPaths = dest.paths;
        for (let key in srcPaths) {
            if (!destPaths[key]) {
                destPaths[key] = [];
            }
            mergePaths(srcPaths[key], destPaths[key], basePath);
        }
    }
}
function mergePaths(src, dest, basePath) {
    for (let i = 0; i < src.length; ++i) {
        dest.push(path.join(basePath, src[i]));
    }
}
//# sourceMappingURL=typescript.js.map