var webdriverio = require('webdriverio');
var nopt = require('nopt');
var cliArgs = nopt({}, {}, process.argv);

// provide env with --env=live which will resolve to config in ./env.js
var env = cliArgs.env || 'live';
var config = require('./env')(env);

// provide --logLevel=verbose at the command line to get verbose output
var logLevel = cliArgs.logLevel || 'silent';

// provide --chromedriverHost=somehost to override the host (eg to docker)
var chromedriverHost = getChromedriverHost();

module.exports = function(){
    this.setDefaultTimeout(5 * 60 * 1000);

    var browser;

    this.registerHandler('BeforeFeatures', function(event, callback) {

        browser = webdriverio.remote({
            desiredCapabilities: { browserName: "chrome" },
            host: chromedriverHost,
            port: 4444,
            path : '/',
            logLevel :logLevel,
            coloredLogs: true,
            waitforTimeout : 10000
        })
        .then(() => callback())
        .catch(function (err) {
            console.error('Failed to start webdriverio connecting to: localhost:4444/ \nwith error:', err);
        });

    });

    this.World = function(){
        this.browser = browser;
        this.config = config;
    };

    this.Around(function (scenario, runScenario) {
        browser.init().then(function () {
                runScenario(null, () => {
                    return browser.end();
                });
            })
            .catch(function (err) {
                console.error(err);
            });
    });

    ['dev', 'live'].forEach(skipEnv => {
        this.Before(`@skip-${skipEnv}`, function (scenario, callback) {
            if (env === skipEnv){
                callback.pending();
            }
            else {
                callback();
            }
        });
    });
};


function getChromedriverHost(){
    // if there is more than one, the last one wins
    if (Array.isArray(cliArgs.chromedriverHost)){
        return cliArgs.chromedriverHost[cliArgs.chromedriverHost.length -1];
    }
    else if (cliArgs.chromedriverHost){
        return cliArgs.chromedriverHost
    }
    else if (process.env.chromedriverHost){
        return process.env.chromedriverHost;
    }
    return 'localhost';
}