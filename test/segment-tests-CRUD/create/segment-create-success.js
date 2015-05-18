"use strict";
var should = require("chai").should();
var webdriver = require("selenium-webdriver");
var test = require("selenium-webdriver/testing");
var WAIT_TIME = 25000;
var advertiserSearchKey = "401_KenMaddy";
var pixelsToSelect = ["donna_confirm"];
var segmentName = "SUPER AWESOME SEGMENT NAME";
var browser;
var loginBuddy;
var behaviorBuddy;

test.describe("create segment test", function() {
  test.describe("successful creation", function () {
    test.before("Open clean browser and navigate to segments", function(done) {
      browser = require("../../../test-buddies/browser-buddy.js").
        createBrowser(webdriver, WAIT_TIME);
      loginBuddy = require("../../../test-buddies/login-buddy.js");
      behaviorBuddy = require("../../../test-buddies/behavior-buddy.js");
      behaviorBuddy.initialize(browser, webdriver);
      loginBuddy.login(webdriver, browser);
      browser.findElement(webdriver.By.className("nav-icon-segments")).
        then(function(element) {
          element.click();
          done();
        });
    })

    test.it("should be on the segments page", function() {
      browser.findElement(webdriver.By.className("title")).
        then(function(element) {
          element.getText().then(function(text) {
            text.should.deep.equal("Segments");
          });
        });
    })

    test.it("should hit the create segment page", function(done) {
      browser.findElement(webdriver.By.id("add-segment")).click();
      setTimeout(function() {
        browser.findElement(webdriver.By.className("w-head")).
          then(function(element) {
            element.getText().then(function(text) {
              text.should.deep.equal("New Segment");
              done();
            });
          });
      }, 1900);
    })

    test.it("Selected advertiser should match search key", function(done) {
      var dropDown = browser.
        findElement(webdriver.By.xpath("//*[@id='advertisers']"));
      setTimeout(function() {
        dropDown.click().then(function() {
          var searchBox = browser.
            findElement(webdriver.By.xpath("//*[@id='advertisers']/mm-input"));
          searchBox.click();
          searchBox.sendKeys(advertiserSearchKey);
          setTimeout(function() {
            browser.findElements(
                webdriver.By.xpath("//*[@id='advertisers']/mm-list-item")
                ).then(function(elements) {
              var asyncCatcher = 0;
              for(var i = 0;i < elements.length; i++) {
                elements[i].getText().then(function(text) {
                  if(text == advertiserSearchKey){
                    elements[asyncCatcher].click();
                  }
                  asyncCatcher++;
                });
              }
            });
            dropDown.getText().then(function(text) {
              text.should.deep.equal(advertiserSearchKey);
              done();
            });
          }, 10000);
        });
      }, 6000);
    })

    test.it("should have a name", function() {
      var segmentNameInput = browser.findElement(
          webdriver.By.xpath("//*[@id='segment-name-wc']")
          );
      segmentNameInput.click();
      segmentNameInput.sendKeys(segmentName);
      segmentNameInput.getAttribute("value").then(function(text) {
        text.should.deep.equal(segmentName);
      });
    })

    test.it("should hit the Add Behavior popup", function(done) {
      browser.findElement(webdriver.By.className("add-behavior-text")).click();
      setTimeout(function() {
        browser.findElement(webdriver.By.className("w-AddBehavior")).
          then(function(element) {
            should.exist(element);
            done();
          });
      }, 1200);
    })

    test.it("should successfully add Event Pixel behavior", function(done) {
      var DEFAULT_BLANKS = 2;
      var segmentBehaviors = [];
      browser.wait(function() {
        return browser.findElements(webdriver.By.className("name"));
      }, 12000).then(function(elements) {
        behaviorBuddy.selectItem(advertiserSearchKey, elements);
      });
      browser.findElements(webdriver.By.className("name")).then(function(elements) {
        behaviorBuddy.selectItem("Event Pixels", elements);
        setTimeout(function() {
          browser.findElements(webdriver.By.className("name")).then(function(elements) {
            behaviorBuddy.selectItems(pixelsToSelect, elements);
          });
          browser.findElement(webdriver.By.id("add-button")).click();
          //find all added behaviors
          browser.findElements(webdriver.By.className("segment-element-text")).then(function(elements) {
            segmentBehaviors = behaviorBuddy.allBehaviorsAdded(pixelsToSelect, elements);
            //end
            setTimeout(function() {
              behaviorBuddy.allBehaviorsAdded.should.be_true;
              done();
            }, 1500);
          });
        }, 6000);
      });
    })

    test.it("should save", function(done) {
     var saveButton = browser.findElement(webdriver.By.xpath("//*[@id='save-segment-button']"));
     saveButton.isEnabled().then(function (value) {
       value.should.be_true;
       saveButton.click();
       done();
     });
    })

    test.it("should have been added to the top", function (done) {
      behaviorBuddy.exitSegment();
    })
  })
});
