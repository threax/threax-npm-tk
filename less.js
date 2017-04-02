var less = require('less');
var fs = require('fs-extra');
var externalPromise = require('threax-npm-tk/externalPromise');

var defaultSettings = {
    encoding: 'utf8',
    importPaths: [],
    inFile: null,
    outFile: null,
    compress: true,
}

function compileLess(settings) {
    var ep = new externalPromise();

    settings.prototype = defaultSettings;

    fs.readFile(settings.inFile, settings.encoding, (err, data) => {
        if (err){ return ep.reject(err); }
        less.render(data,
            {
                paths: settings.importPaths,
                filename: settings.inFile,
                compress: settings.compress
            },
            (err, output) => {
                if (err){ return ep.reject(err); }
                fs.ensureFile(settings.outFile, 
                    (err) => {
                        if (err){ return ep.reject(err); }
                        fs.writeFile(settings.outFile, output.css, 
                            (err) => {
                                if (err){ return ep.reject(err); }
                                ep.resolve();
                            });
                    });
            });
    });

    return ep.Promise;
}
module.exports = compileLess;