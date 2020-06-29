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
exports.getLineEndings = exports.unlinkFile = exports.emptyDir = exports.appendFile = exports.writeFile = exports.readFile = exports.copy = exports.ensureDir = exports.ensureFile = exports.globFiles = exports.fsstat = void 0;
var fs = require('fs-extra');
var Glob = require("glob").Glob;
const externalPromise_1 = require("./externalPromise");
/**
 * Get the node fsstat results for a path. This will return promise.
 */
function fsstat(path) {
    var ep = new externalPromise_1.ExternalPromise();
    fs.stat(path, (err, stats) => {
        if (err) {
            return ep.reject(err);
        }
        ep.resolve(stats);
    });
    return ep.Promise;
}
exports.fsstat = fsstat;
/**
 * Find all files that match the given glob. This will ignore any directories.
 */
function globFiles(globStr, ignore) {
    globStr = globStr.replace(/\\/g, '/');
    var ep = new externalPromise_1.ExternalPromise();
    var globOptions = {};
    if (ignore) {
        globOptions.ignore = ignore;
    }
    var mg = new Glob(globStr, globOptions, (err, files) => __awaiter(this, void 0, void 0, function* () {
        if (err) {
            ep.reject(err);
        }
        else {
            var matches = mg.matches;
            var actuallyFiles = [];
            for (let i = 0; i < files.length; ++i) {
                var file = files[i];
                if ((yield fsstat(file)).isFile()) {
                    actuallyFiles.push(file);
                }
            }
            ep.resolve(actuallyFiles);
        }
    }));
    return ep.Promise;
}
exports.globFiles = globFiles;
function ensureFile(path) {
    var ep = new externalPromise_1.ExternalPromise();
    fs.ensureFile(path, err => {
        if (err) {
            return ep.reject(err);
        }
        ep.resolve(undefined);
    });
    return ep.Promise;
}
exports.ensureFile = ensureFile;
function ensureDir(path) {
    var ep = new externalPromise_1.ExternalPromise();
    fs.ensureDir(path, err => {
        if (err) {
            return ep.reject(err);
        }
        ep.resolve(undefined);
    });
    return ep.Promise;
}
exports.ensureDir = ensureDir;
function copy(src, dest) {
    var ep = new externalPromise_1.ExternalPromise();
    fs.copy(src, dest, err => {
        if (err) {
            return ep.reject(err);
        }
        ep.resolve();
    });
    return ep.Promise;
}
exports.copy = copy;
function readFile(path, options) {
    var ep = new externalPromise_1.ExternalPromise();
    fs.readFile(path, options, (err, data) => {
        if (err) {
            return ep.reject(err);
        }
        ep.resolve(data);
    });
    return ep.Promise;
}
exports.readFile = readFile;
function writeFile(path, data) {
    var ep = new externalPromise_1.ExternalPromise();
    fs.writeFile(path, data, (err) => {
        if (err) {
            return ep.reject(err);
        }
        ep.resolve();
    });
    return ep.Promise;
}
exports.writeFile = writeFile;
function appendFile(path, data) {
    var ep = new externalPromise_1.ExternalPromise();
    fs.appendFile(path, data, (err) => {
        if (err) {
            return ep.reject(err);
        }
        ep.resolve();
    });
    return ep.Promise;
}
exports.appendFile = appendFile;
function emptyDir(path) {
    var ep = new externalPromise_1.ExternalPromise();
    fs.emptyDir(path, (err, data) => {
        if (err) {
            return ep.reject(err);
        }
        ep.resolve(data);
    });
    return ep.Promise;
}
exports.emptyDir = emptyDir;
/**
 * Delete a file
 * @param path the path to the file to delete.
 */
function unlinkFile(path) {
    var ep = new externalPromise_1.ExternalPromise();
    fs.unlink(path, (err) => {
        if (err) {
            return ep.reject(err);
        }
        ep.resolve();
    });
    return ep.Promise;
}
exports.unlinkFile = unlinkFile;
function getLineEndings(data, noEndingsMode) {
    if (noEndingsMode === undefined) {
        noEndingsMode = "\n";
    }
    if (data.search(/\r/) > -1 || data.search(/\r\n/) > -1) {
        return "\r\n";
    }
    else if (data.search(/\n/) > -1) {
        return "\n";
    }
    else {
        return noEndingsMode;
    }
}
exports.getLineEndings = getLineEndings;
//# sourceMappingURL=io.js.map