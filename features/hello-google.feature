Feature: Demonstrate how to use cucumber, chromedriver, and webdriverio for acceptance testing

  Scenario: Go Google
    When I go to "/"
    Then I should be able to search
    #uncomment the next line to see that you can inspect / interact with the browser
#    Then pause
