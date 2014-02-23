var Backbone = require("backbone"), Browser = null;

(function() {
  "use strict";

  Browser = Backbone.Model.extend({

    continue: function(conn, conns) {
      conns.deviceConnections(function(dConn) {
        conn.spark.on('device:'+dConn.get('id'), function relay(payload) {
          var identifier = conn.get('identifier');
          if (payload.listen === "once") {
            dConn.spark.once(identifier, conn.emit.bind(conn));
          } else {
            console.error("Currently only handling 'once' for relay messages");
          }
          dConn.emit('relay', identifier, payload);
        }.bind(this));

        conn.emit(
          'a wild device appears',
          dConn.export(),
          dConn.model.export()
        );
      }.bind(this));
    },

    finish: function(conn, conns, done) {
      done();
    }

  });
}());

module.exports = Browser;
