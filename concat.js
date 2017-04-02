var fs = require('fs-extra');

function concat(files, outFile) {
    var output = files.map((f) => {
        return fs.readFileSync(f).toString();
    }).join(';');

    fs.writeFileSync(outFile, output);
}