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
      /*
      conns.browserConnections(function(bConn) {
        bConn.spark.on('device:'+conn.get('id'), function relay(payload) {
          var identifier = bConn.model.getIdentifier();
          if (payload.listen === "once") {
            conn.spark.once(identifier, bConn.emit);
          } else {
            console.error("Currently only handling 'once' for relay messages");
          }
          bConn.emit('relay', identifier, payload);
        }.bind(this));
      }.bind(this));
*/
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

