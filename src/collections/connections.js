var _ = require('underscore')._,
Backbone = require('backbone'),
Connections = Backbone.Collection.extend({
  model: require('../models/connection.js'),

  track: function(connection) {
    this.removeWhere({id: connection.get('id')});
    this.add(connection);
    connection.continue(this);
    console.log(this.length);
  },

  removeWhere: function(match) {
    _.each(this.where(match), function(c) {
      this.remove(c);
    }.bind(this));
  },

  emitToBrowsers: function() {
    var args = Array.prototype.slice.call(arguments, 0);
    _.each(this.where({model:'browser'}), function(c) {
      c.emit.apply(c, args);
    }.bind(this));
  },

  deviceConnections: function(cb) {
    _.each(this.where({model:'device'}), function(c) {
      cb(c);
    });
  },

  browserConnections: function(cb) {
    _.each(this.where({model:'browser'}), function(c) {
      cb(c);
    });
  }
});

module.exports = Connections;
