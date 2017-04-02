var fs = require('fs-extra');
var externalPromise = require('threax-npm-tk/externalPromise');

module.exports = function(files, outFile) {
    var ep = new externalPromise();

    var output = files.map((f) => {
        return fs.readFileSync(f).toString();
    }).join(';');

    fs.writeFile(outFile, output, 
    (err) => {
        if (err){ return ep.reject(err); }
        ep.resolve();
    });

    return ep.Promise;
}