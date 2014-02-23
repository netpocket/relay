var _ = require('underscore');

var DeviceConnection = (function(conn, token, attributes) {
  this.type = "device";
  this.token = token;
  this.attributes = attributes;

  conn.emitToBrowsers('a wild device appears', { id: token }, attributes);

  conn.spark.on('end', function() {
    conn.emitToBrowsers('a wild device disconnected', { id: token });
    conn.conns.devices[token] = null;
    delete conn.conns.devices[token];
  });

  this.gotMessage = function(payload) {
    var recipient_identifier = this.type+':'+this.token;
    if (payload.listen === "once") {
      conn.spark.once(recipient_identifier, function(res) {
        this.emit(res);
      }.bind(this));
    }
    conn.emit('relay', recipient_identifier, payload);
  };

  this.emit = conn.emit;
});

module.exports = DeviceConnection;
