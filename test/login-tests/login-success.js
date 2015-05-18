"use strict";
var should = require("chai").should();
var webdriver = require("selenium-webdriver");
var test = require("selenium-webdriver/testing");
var WAIT_TIME = 3000;
var factoryGirl = require("factory_girl");
factoryGirl.definitionFilePaths = [__dirname + "/factories"];
factoryGirl.findDefinitions();
var browser;
var usernameField,
  passwordField,
  submitButton,
  user;

test.describe("Logon page test", function() {
  test.describe("Successful login", function () {
    test.before("Open a clean browser window", function(done) {
      browser = require("../../test-buddies/browser-buddy.js").createBrowser(webdriver, WAIT_TIME);
      // browser = new webdriver.
      //   Builder().
      //   withCapabilities(webdriver.Capabilities.chrome()).
      //   build();
      // browser.manage().timeouts().implicitlyWait(WAIT_TIME);
      done();
    })

    test.after("Close the browser window", function() {
      browser.quit();
    })


    test.it("should show logon page", function() {
      browser.get("https://192.168.102.112/git/latest/");
      browser.findElement(webdriver.By.id("t1-page-container")).
        then(function(element) {
          should.exist(element);
        })
    })

    test.it("should successfully log in", function() {
      usernameField = browser.findElement(webdriver.By.className("user-name"));
      passwordField = browser.findElement(webdriver.By.className("password"));
      submitButton = browser.findElement(webdriver.By.className("login-action"));
      user = factoryGirl.create("goodLogOn");
      usernameField.sendKeys(user.username);
      passwordField.sendKeys(user.password);
      submitButton.click();
      browser.findElement(webdriver.By.className("sticky-notification-msg")).then(function(notification) {
        notification.getText().then(function(text) {
          text.should.deep.equal("You are now logged in!");
        });
      });
    })
  })
});
