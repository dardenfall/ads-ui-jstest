### DMP Javascript Automated Tests Documentation
Documentation v.0.5 - Brian McQueen - MediaMath Cambridge

* ##### Browser Buddy
* ##### Login Buddy
* ##### Behavior Buddy

Note: all testBuddies are located in the "test-buddies" folder adjaced to "tests" folder and must be required at top of test class.

e.g. ` var browserBuddy = require("test-buddies/browser-buddy.js");`
###### class browserBuddy
Creates a customized Chrome browser instance.
* createBrowser(webdriver[, implicitWaitTime])
    *  creates chrome browser for automated testing and returns a reference to the browser
    *  browser is created with an implicit wait time of implicitWaitTime, or of 45 seconds if no implicitWaitTime argument is supplied.
    *  Preferred to be used in the "before" block
    *  Usage: var browser = browserBuddy.createBrowser(webdriver[, implicitWaitTime]);
        * webdriver is created at test start via "var webdriver = require("selenium-webdriver");"

###### class loginBuddy
Logs the browser in to the latest T1 dev environment
* login(webdriver, browser[, username, password])
    * Using the supplied webdriver and browser, logs in to T1
    * Uses credentials supplied; if none are supplied, defaults to "dardenfall@mm.com" for username and "dardenfall" for password
    * Leaves browser on the "Organization" tab
    * Preferred to be used in the "before" block"
    * Usage: loginBuddy.login(webdriver, browser[, username, password])

###### class behaviorBuddy
On the "create segment" frame, automates the selection of items on the "Add Behavior" frame.
* initialize(webdriver, browser)
    * Sets up the behaviorBuddy with the webdriver and browser.
    * Must be used prior to using other behaviorBuddy methods
    * Preferred to be used in "before" block.
    * Usage: behaviorBuddy.initialize(webdriver, browser)

* selectItem(stringToSelect, elements)
    * On the "Add Behavior" frame, this is used to select a single element from the behaviors.  It is useful for navigating to a selected section.
    * stringToSelect is the string of the behavior or navigation tree node to click/select.
    * elements is an array of all behavior elements and navigation tree nodes to iterate through.
    * Usage: behaviorBuddy.selectItem(stringToSelect, elements)

* selectItems(stringsToSelect, elements)
    * On the "Add Behavior" frame, this is used to select multiple elements from the behaviors.  It is best used to select behaviors at once and should not be used to navigate to different tree nodes.
    * stringsToSelect is an array of strings of behaviors to select
    * elements is an array of all behavior and navigation tree nodes to iterate through.
    * usage: behaviorBuddy.selectItems(stringsToSelect, elements)

* allBehaviorsAdded(arrayOfExpectedBehaviors, elements)
    * returns a boolean
    * On the "Create Segment" page, this is used to confirm that expected behaviors are present in `elements`
    * arrayOfExpectedBehaviors is an array of strings that match the names of behaviors desired
    * elements is an array of elements found by className = "segment-element-text", which are how T1 represents behaviors added
    * Usage: behaviorBuddy.allBehaviorsAdded(arrayofExpectedBehaviors, elements)
        * Note: this can be saved off to a varibale or used directly in an assertion test
        
* exitSegment()
    * Navigates away from the "Create Segment" or "Edit Segment" page without saving and returns the browser to the "Segments" page
    * Usage: behaviorBuddy.exitSegment()
