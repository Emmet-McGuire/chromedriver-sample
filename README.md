chromedriver-sample
================

The intent of this repo is to demonstrate how you can use chromedriver, cucumber, and webdriverio together to make
acceptance tests easier.

If you are brand new to cucumberjs, webdriver.io, or chromedriver - feel free to checkout the [simple](https://github.com/jhoguet/chromedriver-sample/tree/simple) branch to see
a very simple version of this repo before we tack on some of the features we discuss later.

## Getting Started (Just Node)

    npm install
    npm run start-local-chromedriver

in another terminal

    npm run acceptance-tests -- --env=live
    
## Getting Started (Docker)

	docker-compose run acceptance-tests --env=live
    
After you've done this the first time - you can add `--skip-install` to avoid the time consuming `npm install` step

## Getting Started (Docker with local Chromedriver)

    npm run start-local-chromedriver
	docker-compose run acceptance-tests --chromedriverHost={your-ip} --env=live
    
where `{your-ip}` is accesible from the container, therefore `localhost` is NOT an option :( But here is a command that will find your IP for you. 
    
    docker-compose run acceptance-tests --chromedriverHost=$(host $(hostname) | head -n 1 | awk '{print $4}') --env=live


## Environments
Often times we need to be able to run our tests against multiple environments. We accomplish this by putting our environment variables in `features/worlds/env.js`. 

There you can add any keys you want to the config object at the top and use any environment you want. 

You will find the following in `features/worlds/envWorld.js` which defaults the environment to `live` if you don't provide one - you can change that to be any value you want. 


```js
var env = cliArgs.env || 'dev';
```

Notice this is getting `env` from the cli args. So you can specify any environment using `--env=live`. Also, there is an npm feature you might not be aware of which allows you to avoid hard coding this into `scripts` of `package.json`. 

Rather than doing this`package.json` `scripts`. 

```js
"acceptance-tests:dev": "node_modules/.bin/cucumber.js -f pretty -r ./features/worlds/envWorld.js -r ./features/steps/ ./features/ --env=dev",
"acceptance-tests:live": "node_modules/.bin/cucumber.js -f pretty -r ./features/worlds/envWorld.js -r ./features/steps/ ./features/ --env=live",
```

We can do this. 

```js
"acceptance-tests": "node_modules/.bin/cucumber.js -f pretty -r ./features/worlds/envWorld.js -r ./features/steps/ ./features/"
```

And then we can call dev

	npm run acceptance-tests -- --env=dev
    
And we can call live
	
    npm run acceptance-tests -- --env=live
    
This is thanks to an npm feature which passes along arguments after the first `--`. 
	

You will find the following in `features/worlds/env.js` which uses `default` if it can't find a match for the current `env`. This makes it possible for you to just set `default` when the value is the same for every environment and just override as needed. 

```js
value = config[key].default
```

So for instance

```js
var config = {
    googleHost : {
        live : 'https://google.com'
    },
    user : {
        default : 'jonathan'
    }
};
```

We would always have the user 'jonathan' but only have `googleHost` when the `env` is `live`. 

## Skipping Scenarios in certain environments

You may need to skip certain scnearios in certain environments. You will find the following in `features/worlds/envWorld.js`

```js
['dev', 'live'].forEach(skipEnv => {
```

You can modify the array to support any environments you want to support. 

You can add the tag `@skip-{env}` where `env` is any environment you support, like `@skip-live`. And that scenario will be skipped when you specify that `env` through the cli args eg `--env=live`

## Pausing and Inspecting the Browser

One of the main drivers for this approach is that you can visually inspect the page saving a great amount of time in
troubleshooting why it works locally but not in the testing environment.

I hope to expand this repo to show how I get this working in Docker, which then enables me to run the tests easily on
a CI server like Jenkins.

## Running a Single Scenario / Feature

## Multi Scenario Tests

Most often, you want a new browser session for every scenario. That is you want a clear cache, no cookies, and no page
loaded. This is already set up for you leveraging `this.Around(...)` in `features/worlds/envWorld.js`. In some cases you
may want the browser session to run for more than one scenario. Setting that up goes beyond the scope of this doc. But
to set you up on the right path you basically need to know two things.

You need to move webdriver.io's `init` and `end` calls to happen at the right time (see `this.Around(...)` in
`features/worlds/envWorld.js`). The right time will be managed by cucumberjs [hooks](https://github.com/cucumber/cucumber-js#hooks). 

Note: these types of tests are generally discouraged and you are probably better off with a very long scenario. 

## Docker

This repo / pattern doesn't need Docker, but it supports Docker. 

Docker enables us to run with a background browser on our local machine, and can also be run on CI servers. 

But, Docker adds a layer of complexity and has and requires a significant initial investment. When you're ready for docker, here is what you need to know: 

1. **node_modules** be careful that you don't install node_modules locally using one version of node/ npm and then try and run in the container. The container (possibly running a different version of node) will see the node_modules already exist and try to use them. This is especially problematic for any node_modules that do any compiling against the local machine. This will then be problematic when the binaries compiled against your mac don't work with the linux docker container. This will rarely be a problem, but when in doubt, simple `rm -rf node_modules` 
2. **slower because of npm install** if you're running in the container over and over again (eg iterating on a test). Then it will be much slower, not really because of docker, but because it needs to install every time. We could probably find some way to detect and only npm install if we need to (which npm does quite slowly), but for now simply remove 