var less = require('less');
var fs = require('fs-extra');

var defaultSettings = {
    encoding: 'utf8',
    importPaths: [],
    inFile: null,
    outFile: null,
    compress: true,
}

function compileLess(settings) {
    settings.prototype = defaultSettings;

    fs.readFile(settings.inFile, settings.encoding, (err, data) => {
        if (err) throw err;
        less.render(data,
            {
                paths: settings.importPaths,
                filename: settings.inFile,
                compress: settings.compress
            },
            (err, output) => {
                if (err) throw err;
                fs.ensureFile(settings.outFile, 
                    (err) => {
                        if (err) throw err;
                        fs.writeFile(settings.outFile, output.css, 
                            (err) => {
                                if (err) throw err;
                            });
                    });
            });
    });
}
module.exports = compileLess;