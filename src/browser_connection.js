var _ = require('underscore');

var BrowserConnection = (function(conn, token, info) {

  conn.emit('here take these devices', _.map(Object.keys(conn.conns.devices), function(id) {
    return { id: id }; // Could use backbone collection here
  }));

  conn.spark.on('end', function() {
    conn.conns.browsers[token] = null;
    delete conn.conns.browsers[token];
  });

  this.emit = conn.emit;
});

module.exports = BrowserConnection;
