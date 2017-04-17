"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var externalPromise_1 = require("./externalPromise");
var exec = require('child_process').exec;
module.exports = function () {
    var ep = new externalPromise_1.ExternalPromise();
    var child = exec('tsc', function (error, stdout, stderr) {
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
};
//# sourceMappingURL=typescript.js.map