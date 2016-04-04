var spawn = require('child_process').spawn;

Promise.resolve()
    .then(function () {
        if (process.argv.indexOf('--skip-install') === -1){
            return execute('npm install');
        }
        else {
            return null;
        }
    })
    .then(function () {
        console.log('here');
        return execute('npm run acceptance-tests -- ' + process.argv.slice(2).join(' '));
    })
    .catch(error => console.error(error));

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
