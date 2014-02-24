var Backbone = require("backbone"),
Device = null;

(function() {
  "use strict";

  Device = Backbone.Model.extend({

    export: function() {
      return {
        name: this.get('name'),
        features: this.get('features')
      };
    },

    continue: function(conn, conns) {
      conns.browserConnections(function(bConn) {
        conns.bridge(conn, bConn);
        conn.appearTo(bConn);
      });
    },

    finish: function(conn, conns, done) {
      conns.browserConnections(function(bConn) {
        conn.disappearTo(bConn);
      });
      done();
    }

  });
}());

module.exports = Device;

