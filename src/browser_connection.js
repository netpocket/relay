var _ = require('underscore');

var BrowserConnection = (function(conn, token, info) {

  for (var dToken in conn.conns.devices) {
    conn.emit('a wild device appears', { id: dToken }, { /* missing attributes! */ });
  }

  conn.spark.on('end', function() {
    conn.conns.browsers[token] = null;
    delete conn.conns.browsers[token];
  });

  this.emit = conn.emit;
});

module.exports = BrowserConnection;
