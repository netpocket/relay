var _ = require('underscore')._,
Backbone = require('backbone'),
Connections = Backbone.Collection.extend({
  model: require('../models/connection.js'),

  track: function(connection) {
    this.removeWhere({token: connection.get('token')}, function() {
      this.add(connection);
      connection.continue(this);
    }.bind(this));
  },

  removeWhere: function(match, done) {
    this.where(match).forEach(function(c) {
      this.remove(c);
    }.bind(this));
    done();
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
  },

  bridge: function(conn, bConn) {
    bConn.spark.on(conn.get('identifier'), function relay(payload) {
      var identifier = bConn.get('identifier');
      if (payload.listen === "once") {
        conn.spark.once(identifier, function(res) {
          bConn.emit(conn.get('identifier'), res);
        });
      } else {
        console.error("Currently only handling 'once' for relay messages");
      }
      conn.emit('relay', identifier, payload);
    });
  }
});

module.exports = Connections;
