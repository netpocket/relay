var Backbone = require("backbone"),
Browser = null;

(function() {
  "use strict";

  Browser = Backbone.Model.extend({

    continue: function(conn, conns) {
      conns.deviceConnections(function(dConn) {
        conns.bridge(dConn, conn);
        dConn.appearTo(conn);
      }.bind(this));
    },

    finish: function(conn, conns, done) {
      done();
    }

  });
}());

module.exports = Browser;
