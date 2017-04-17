var exec = require('child_process').exec;
var externalPromise = require('threax-npm-tk/externalPromise');

module.exports = function(){
    var ep = new externalPromise();
    var child = exec('tsc',
        function (error, stdout, stderr) {
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
            else{
                ep.resolve();
            }
        });
    return ep.Promise;
}