var _ = require('underscore');

var DeviceConnection = (function(conn, token, info) {


  Object.keys(conn.conns.browsers).forEach(function(id) {
    conn.conns.browsers[id].emit('a wild device appears', {
      id: token
    });
  });

  this.emit = conn.emit;
});

module.exports = DeviceConnection;
