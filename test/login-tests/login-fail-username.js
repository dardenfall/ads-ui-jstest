"use strict";
var should = require("chai").should();
var webdriver = require("selenium-webdriver");
var test = require("selenium-webdriver/testing");
var WAIT_TIME = 3000;
var factoryGirl = require("factory_girl");
factoryGirl.definitionFilePaths = [__dirname + "/factories"];
factoryGirl.findDefinitions();
var browser;

test.describe("Logon page test", function() {
  test.before("Open a clean browser window", function() {
    browser = require("../../test-buddies/browser-buddy.js").createBrowser(webdriver, WAIT_TIME);
  })

  test.describe("bad username login", function() {
    test.it("should show logon page", function() {
      browser.get("https://192.168.102.112/git/latest/");
      browser.findElement(webdriver.By.id("t1-page-container")).
        then(function(element) {
          should.exist(element);
        })
    })

    test.it("should fail to login", function() {
      var usernameField = browser.findElement(webdriver.By.className("user-name"));
      var passwordField = browser.findElement(webdriver.By.className("password"));
      var submitButton = browser.findElement(webdriver.By.className("login-action"));
      var user = factoryGirl.create("badUsername");
      usernameField.sendKeys(user.username);
      passwordField.sendKeys(user.password);
      submitButton.click();
      browser.findElement(webdriver.By.xpath("//ul[@class='error-list']//li")).getText().then(function(text) {
          text.should.deep.equal("Your username or password is incorrect");
      });
    })
  })
});
