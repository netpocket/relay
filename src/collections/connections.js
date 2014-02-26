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

  deviceConnections: function(cb) {
    _.each(this.where({model:'device'}), cb);
  },

  browserConnections: function(cb) {
    _.each(this.where({model:'browser'}), cb);
  },

  bridge: function(conn, bConn) {
    // Request/Reponse
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

    // Model changes
    conn.model.on('change', function(m) {
      bConn.emit(conn.get('identifier')+':changed', m.changed);
    });
  }
});

module.exports = Connections;
