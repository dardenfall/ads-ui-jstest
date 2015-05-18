FactoryGirl.define("goodLogOn", function() {
  this.username = "mcquackers";
  this.password = "mcquackers";
})

FactoryGirl.define("badUsername", function() {
  this.username = "inept";
  this.password = "inept";
})

FactoryGirl.define("badPassword", function() {
  this.username = "mcquackers";
  this.password = "inept";
})
