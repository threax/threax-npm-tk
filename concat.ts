import {ExternalPromise} from './externalPromise';

var fs = require('fs-extra');

module.exports = function(files, outFile) {
    var ep = new ExternalPromise();

    var output = files.map((f) => {
        return fs.readFileSync(f).toString();
    }).join(';');

    fs.ensureFile(outFile, 
        (err) => {
            if (err){ return ep.reject(err); }
            fs.writeFile(outFile, output, 
                (err) => {
                    if (err){ return ep.reject(err); }
                    ep.resolve();
                });
        });

    return ep.Promise;
}