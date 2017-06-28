import * as ts from '../../typescript';

(async function () {
    var first: ts.TsImport = {
        compilerOptions: {
            paths: {
                "firstpath.*": [
                    "src/*.ts"
                ]
            }
        },
        include: [
            "firstfile1",
            "firstfile2"
        ],
        packageManager: "correctpackagemanager",
        sourcePath: "node_modules/first"
    };
    var second: ts.TsImport = {
        compilerOptions: {
            paths: {
                "secondpath.*": [
                    "src2/*.ts"
                ]
            }
        },
        include: [
            "secondfile1",
            "secondfile2"
        ],
        exclude: [
            "secondexcluded"
        ],
        files: [
            "secondfiles"
        ],
        packageManager: "incorrectpackagemanager",
        sourcePath: "node_modules/second/"
    };

    var merged: ts.TsConfig = {};

    await ts.streamImport(merged, [first, second]);
    console.log(JSON.stringify(merged, undefined, 2));

    ts.importConfigs(__dirname + "/tsconfig.json", __dirname); //This will write the results to tsconfig.json in this folder.
})();