var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

console.log(process.argv);
execute('npm install')
    .then(function () {
        return execute('npm run acceptance-tests -- ' + process.argv.slice(2).join(' '));
    });

function execute(cmd){

    var parts = cmd.split(' ');

    var ps = spawn(parts[0], parts.slice(1), { stdio : 'inherit'});

    return new Promise(function (resolve, reject) {
        ps.on('close', function (code) {
            if (code === 0){
                resolve();
            }
            else {
                reject(code);
            }
        });
    });
}

function executeForResponse(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
}

function probeToEnsureLocalChromeDriverIsUp(chromeDriverUrl){
    var request = require('request-promise');
    debug('checking if chromedriver is up at ', chromeDriverUrl);
    return request(chromeDriverUrl).then(function (res) {
            debug('recevied response', res);
            // assuming success means its up
            return true
        })
        .catch(function (err) {
            debug('received error', err);
            if (err && err.statusCode){
                debug('assuming it is up since someone answered :)');
                return true;
            }
            // assuming it is not up
            return false;
        });
}

function debug(){
    if (cliArgs.verbose){
        console.log.apply(console, arguments);
    }
}