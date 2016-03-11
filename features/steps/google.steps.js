module.exports = function () {
    this.When(/^I go to "([^"]*)"$/, function (url) {
        return this.browser.url(url);
    });

    this.Then(/^I should be able to search$/, function () {
        return this.browser.waitForExist('input[name=q]');
    });

    this.When(/^pause$/, function () {
        return this.browser.debug();
    });
};

