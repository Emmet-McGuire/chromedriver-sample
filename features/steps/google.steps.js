var urlJoin = require('url').resolve;

module.exports = function () {
    this.When(/^I go to "([^"]*)"$/, function (path) {
        return this.browser.url(urlJoin(this.config.googleHost, path));
    });

    this.Then(/^I should be able to search$/, function () {
        return this.browser.waitForExist('input[name=q]');
    });

    this.When(/^pause$/, function () {
        return this.browser.debug();
    });
};

