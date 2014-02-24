var Backbone = require("backbone"), Device = null;

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
        // replace with Bridge
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
        }.bind(this));
      }.bind(this));

      conns.emitToBrowsers(
        'a wild device appears',
        conn.export(),
        this.export()
      );
    },

    finish: function(conn, conns, done) {
      conns.emitToBrowsers(
        'a wild device disconnected',
        conn.export()
      );
      done();
    }

  });
}());

module.exports = Device;

