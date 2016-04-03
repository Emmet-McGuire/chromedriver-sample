chromedriver-sample
================

The intent of this repo is to demonstrate how you can use chromedriver, cucumber, and webdriverio together to make
acceptance tests easier.

If you are brand new to cucumberjs, webdriver.io, or chromedriver - feel free to checkout the [simple](https://github.com/jhoguet/chromedriver-sample/tree/simple) branch to see
a very simple version of this repo before we tack on some of the features we discuss later.

TODO:
- [x] env variables
- [x] init and end on each scenario
- [x] skip env tags
- [ ] docker

To see it in action.

    npm install
    npm run start-local-chromedriver


in another terminal

    npm run acceptance-tests -- --env=live

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

## Multi Scenario Tests

Most often, you want a new browser session for every scenario. That is you want a clear cache, no cookies, and no page
loaded. This is already set up for you leveraging `this.Around(...)` in `features/worlds/envWorld.js`. In some cases you
may want the browser session to run for more than one scenario. Setting that up goes beyond the scope of this doc. But
to set you up on the right path you basically need to know two things.

You need to move webdriver.io's `init` and `end` calls to happen at the right time (see `this.Around(...)` in
`features/worlds/envWorld.js`). The right time will be managed by cucumberjs [hooks](https://github.com/cucumber/cucumber-js#hooks). 

Note: these types of tests are generally discouraged and you are probably better off with a very long scenario. 