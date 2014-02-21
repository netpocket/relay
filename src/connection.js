var BrowserConnection = require('./browser_connection.js');

var Connection = (function(spark, conns) {
  "use strict";
  var self = this;
  this.spark = spark;
  this.conns = conns;

  this.emit = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    spark.write({args:args});
  };

  spark.on('i am a netpocketos device', function(token, info) {
    conns.devices[token] = self;
  });

  spark.on('i am a web browser', function(token, info) {
    conns.browsers[token] = new BrowserConnection(self);
  });

  this.emit("please identify");
});

module.exports = Connection;
