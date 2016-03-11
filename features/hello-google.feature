Feature: Demonstrate how to use cucumber, chromedriver, and webdriverio for acceptance testing

  Scenario: Go Google
    When I go to "https://google.com"
    Then I should be able to search
    #Then pause #uncomment this to line to see that you can inspect / interact with the browser
