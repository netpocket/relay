var _ = require('underscore');

var DeviceConnection = (function(conn, token, attributes) {

  conn.emitToBrowsers('a wild device appears', { id: token }, attributes);

  conn.spark.on('end', function() {
    conn.emitToBrowsers('a wild device disconnected', { id: token });
    conn.conns.devices[token] = null;
    delete conn.conns.devices[token];
  });

  this.emit = conn.emit;
});

module.exports = DeviceConnection;
