"use strict";
var should = require("chai").should();
var webdriver = require("selenium-webdriver");
var test = require("selenium-webdriver/testing");
var WAIT_TIME = 25000;
var advertiserSearchKey = "401_KenMaddy";
var pixelsToSelect = ["donna_confirm"];
var segmentName = "SUPER AWESOME SEGMENT NAME";
var browser;

test.describe("create segment test", function() {
  test.describe("successful creation", function () {
    test.before("Open clean browser and navigate to segments", function(done) {
      browser = require("../../../test-buddies/browser-buddy.js").
        createBrowser(webdriver, WAIT_TIME);
      var loginBuddy = require("../../../test-buddies/login-buddy.js");
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
      //Add Behavior - Click first item - AdvertiserName
      browser.wait(function() {
        return browser.findElements(webdriver.By.className("name"));
      }, 12000).then(function(elements) {
        var asyncCatcher = 0;
        for(var i = 0; i < elements.length; i++) {
          elements[i].getText().then(function(text) {
            if(text == advertiserSearchKey) {
              elements[asyncCatcher].click();
            }
            asyncCatcher++;
          });
        }
      });
      //end
      //Add Behavior - Open event pixels
      browser.findElements(webdriver.By.className("name")).then(function(elements) {
        var asyncCatcher = 0;
        for(var i = 0; i < elements.length; i ++) {
          elements[i].getText().then(function(text) {
            if(text == "Event Pixels") {
              elements[asyncCatcher].click();
            }
            asyncCatcher++;
          });
        }
        //end
        setTimeout(function() {
          //select numerous Event Pixels
          browser.findElements(webdriver.By.className("name")).then(function(elements) {
            asyncCatcher = 0;
            for(var i = 0; i < elements.length; i++) {
              elements[i].getText().then(function(text) {
                if(pixelsToSelect.indexOf(text)>=0) {
                  elements[asyncCatcher].click();
                }
                asyncCatcher++;
              });
            }
          });
          //end
          browser.findElement(webdriver.By.id("add-button")).click();
          //find all added behaviors
          browser.findElements(webdriver.By.className("segment-element-text")).then(function(elements) {
            for(var i = 0; i < elements.length - DEFAULT_BLANKS; i++) {
              elements[i].getText().then(function(text) {
                var index = text.indexOf("\n");
                var pixelNameSubstring = text.substring(index+1);
                segmentBehaviors.push(pixelNameSubstring);
              });
            }
            //end
            setTimeout(function() {
              segmentBehaviors.should.deep.equal(pixelsToSelect);
              done();
            }, 1500);
          });
        }, 6000);
      });
    })

    test.it("should save", function(done) {
      browser.findElement(webdriver.By.id("save-segment-button")).click();
      setTimeout(function() {
      browser.findElement(webdriver.By.id("create-edit-footer")).getText().then(function(text) {
        console.log(text);
        done();
      });
      }, 1500);

    })
  })
});
