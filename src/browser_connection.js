var _ = require('underscore');

var BrowserConnection = (function(conn, token, info) {
  this.type = "browser";
  this.token = token;

  conn.spark.on('end', function() {
    conn.conns.browsers[token] = null;
    delete conn.conns.browsers[token];
  });

  for (var dToken in conn.conns.devices) {
    var dConn = conn.conns.devices[dToken];
    conn.emit('a wild device appears', { id: dToken }, dConn.attributes);
    conn.spark.on('device:'+dToken, dConn.gotMessage.bind(this));
  }

  this.emit = conn.emit;
});

module.exports = BrowserConnection;
