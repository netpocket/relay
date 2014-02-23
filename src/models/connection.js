var Backbone = require('backbone'), Connection = null,
Device = require('./device.js'),
Browser = require('./browser.js');

(function() {
  "use strict";

  Connection = Backbone.Model.extend({

    export: function() {
      return {
        id: this.get('token'),
        model: this.get('model')
      };
    },

    onData: function(data) {
      if (this.reserved(data.args[0])) return;
      if (process.env.NODE_ENV === "development") {
        console.log('receiving', data.args);
      }
      this.emit.apply(this, data.args);
    },

    emit: function() {
      var args = Array.prototype.slice.call(arguments, 0);
      if (process.env.NODE_ENV === "development") {
        console.log('emitting', args);
      }
      this.spark.write({args:args});
    },

    initialize: function(spark) {
      this.spark = spark;
      spark.on('data', this.onData);
      spark.on('i am a netpocketos device', this.isDevice.bind(this));
      spark.on('i am a web browser', this.isBrowser.bind(this));
      spark.on('end', this.finish.bind(this));
    },

    isDevice: function(token, attributes) {
      this.set('token', token);
      this.set('model', 'device');
      this.set('identifier', this.get('model')+':'+token);
      this.model = new Device(attributes);
      this.identified(token);
    },

    isBrowser: function(token, attributes) {
      this.set('token', token);
      this.set('model', 'browser');
      this.set('identifier', this.get('model')+':'+token);
      this.model = new Browser(attributes);
      this.identified(token);
    },

    continue: function(conns) {
      this.conns = conns;
      this.model.continue(this, conns);
    },

    identified: function() {
      // Override
    },

    finish: function() {
      this.model.finish(this, this.conns, this.finished);
    }

  });
}());

module.exports = Connection;
