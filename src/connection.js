var BrowserConnection = require('./browser_connection.js');
var DeviceConnection = require('./device_connection.js');

/*
var _ = require('underscore')._,
  backbone = require('backbone');
*/

var Connection = (function(spark, conns) {
  "use strict";
  var self = this;
  this.spark = spark;
  this.conns = conns;

  this.emit = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    spark.write({args:args});
  };

  this.emitToBrowsers = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    Object.keys(conns.browsers).forEach(function(id) {
      conns.browsers[id].emit.apply(null, args);
    });
  };

  spark.on('i am a netpocketos device', function(token, attributes) {
    conns.devices[token] = new DeviceConnection(self, token, attributes);
  });

  spark.on('i am a web browser', function(token, info) {
    conns.browsers[token] = new BrowserConnection(self, token, info);
  });

  this.emit("please identify");
});

module.exports = Connection;
