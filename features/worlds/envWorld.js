var webdriverio = require('webdriverio');
var nopt = require('nopt');
var cliArgs = nopt({}, {}, process.argv);

// provide env with --env=live which will resolve to config in ./env.js
var env = cliArgs.env || 'live';
var config = require('./env')(env);

// provide --logLevel=verbose at the command line to get verbose output
var logLevel = cliArgs.logLevel || 'silent';

module.exports = function(){
    this.setDefaultTimeout(5 * 60 * 1000);

    var browser;

    this.registerHandler('BeforeFeatures', function(event, callback) {
        // provide --chromedriverHost=somehost to override the host (eg to docker)

        browser = webdriverio.remote({
            desiredCapabilities: { browserName: "chrome" },
            host: 'localhost',
            port: 4444,
            path : '/',

            // provide --logLevel=verbose at the command line to get verbose output
            logLevel :logLevel,
            coloredLogs: true,
            waitforTimeout : 10000
        })
        .init()
        .then(() => callback())
        .catch(function (err) {
            console.error('Failed to start webdriverio connecting to: localhost:4444/ \nwith error:', err);
        });

    });

    this.World = function(){
        this.browser = browser;
        this.config = config;
    };

    this.registerHandler('AfterFeatures', function(event, callback) {
        browser.end().then(() => callback());
    });
};
