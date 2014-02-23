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

      // Need to create a bridge here with the browsers

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

