var behaviorBuddy = {};
var arraysIdentical = function(a, b) {
  var i = a.length;
  if (i != b.length) return false;
  while (i--) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

behaviorBuddy.initialize = function(browser, webdriver) {
  behaviorBuddy.browser = browser;
  behaviorBuddy.webdriver = webdriver;
};

behaviorBuddy.selectItem = function(stringToSelect, elements) {
  var asyncCatcher = 0;
  for(var i = 0; i < elements.length; i++) {
    elements[i].getText().then(function(text) {
      if(text == stringToSelect) {
        elements[asyncCatcher].click();
      }
      asyncCatcher++;
    });
  }
};

behaviorBuddy.selectItems = function(arrayOfStringsToBeSelected, elements) {
  var asyncCatcher = 0;
  for(var i = 0; i < elements.length; i++) {
    elements[i].getText().then(function(text) {
      if(arrayOfStringsToBeSelected.indexOf(text)>=0) {
        elements[asyncCatcher].click();
      }
      asyncCatcher++;
    });
  }
};

behaviorBuddy.allBehaviorsAdded = function(arrayOfExpectedBehaviors, elements) {
  var DEFAULT_BLANKS = 2;
  var segmentBehaviors = [];
  for(var i = 0; i < elements.length - DEFAULT_BLANKS; i++) {
    elements[i].getText().then(function(text) {
      var index = text.indexOf("\n");
      var pixelNameSubstring = text.substring(index+1);
      segmentBehaviors.push(pixelNameSubstring);
    });
  }
  setTimeout(function() {
    return arraysIdentical(segmentBehaviors, arrayOfExpectedBehaviors);
  }, 1000);
};

behaviorBuddy.exitSegment = function() {
  var browser = behaviorBuddy.browser;
  var webdriver = behaviorBuddy.webdriver;
  setTimeout(function() {
    browser.wait(function() {
      var saveButton = browser.findElement(webdriver.By.xpath("//*[@id='save-segment-button']"));
      return saveButton.isEnabled();
    }, 20000).then(function() {
      browser.findElement(webdriver.By.xpath("//*[@id='cancel-segment-button']")).click();
      browser.findElement(webdriver.By.xpath("//*[@id='unsaved-changes-continue-button']")).click();
    });
  }, 5000);
};

behaviorBuddy.editSegment = function(segmentToEdit) {
  var browser = behaviorBuddy.browser;
  var webdriver = behaviorBuddy.webdriver;
  var asyncCatcher = 0;
  browser.findElements(webdriver.By.className("segment-element")).then(function(elements) {
    for(var i = 0; i < elements.length; i++) {
      elements[i].getAttribute("title").then(function(title) {
        if(title.indexOf(segmentToEdit)>=0) {
          elements[asyncCatcher].findElement(webdriver.By.className("edit-control")).click();
        }
        asyncCatcher++;
      });
    }
  });
};

behaviorBuddy.selectFromDropdown = function (dropdown, stringToSelect) {
  var webdriver = behaviorBuddy.webdriver;
  dropdown.click().then(function () {
    setTimeout(function() {
      dropdown.findElements(webdriver.By.css(" * ")).then(function(elements) {
        var asyncCatcher = 0;
        for(var i = 0;i < elements.length; i++) {
          elements[i].getText().then(function(text) {
            if(text == stringToSelect){
              elements[asyncCatcher].click();
            }
            asyncCatcher++;
          });
        }
      });
    }, 1000);
  });
};

module.exports = behaviorBuddy;
