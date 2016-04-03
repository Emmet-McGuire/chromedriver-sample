chromedriver-sample
================

The intent of this repo is to demonstrate how you can use chromedriver, cucumber, and webdriverio together to make
acceptance tests easier.

If you are brand new to cucumberjs, webdriver.io, or chromedriver - feel free to checkout the [simple](https://github.com/jhoguet/chromedriver-sample/tree/simple) branch to see
a very simple version of this repo before we tack on some of the features we discuss later.

TODO:
- [x] env variables
- [ ] init and end on each scenario
- [ ] skip env tags
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

## Pausing and Inspecting the Browser

One of the main drivers for this approach is that you can visually inspect the page saving a great amount of time in
troubleshooting why it works locally but not in the testing environment.

I hope to expand this repo to show how I get this working in Docker, which then enables me to run the tests easily on
a CI server like Jenkins.