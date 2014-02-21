var _ = require('underscore');

var BrowserConnection = (function(conn) {

  conn.emit('here take these devices', _.map(Object.keys(conn.conns.devices), function(id) {
    return {
      id: id
    };
  }));

  this.emit = conn.emit;
});

module.exports = BrowserConnection;
