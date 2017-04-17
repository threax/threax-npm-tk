"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var externalPromise_1 = require("./externalPromise");
var fs = require('fs-extra');
module.exports = function (files, outFile) {
    var ep = new externalPromise_1.ExternalPromise();
    var output = files.map(function (f) {
        return fs.readFileSync(f).toString();
    }).join(';');
    fs.ensureFile(outFile, function (err) {
        if (err) {
            return ep.reject(err);
        }
        fs.writeFile(outFile, output, function (err) {
            if (err) {
                return ep.reject(err);
            }
            ep.resolve();
        });
    });
    return ep.Promise;
};
//# sourceMappingURL=concat.js.map