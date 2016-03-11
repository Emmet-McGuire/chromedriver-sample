chromedriver-sample
================

The intent of this repo is to demonstrate how you can use chromedriver, cucumber, and webdriverio together to make
acceptance tests easier.

To see it in action.

    npm install
    npm run start-local-chromedriver


in another terminal
    npm run acceptance-tests

One of the main drivers for this approach is that you can visually inspect the page saving a great amount of time in
troubleshooting why it works locally but not in the testing environment.

I hope to expand this repo to show how I get this working in Docker, which then enables me to run the tests easily on
a CI server like Jnenkins.