var BrowserConnection = (function(conn) {


  conn.emit('here take these devices', _.map(Object.keys(conn.conns.devices), function(id) {
    return {
      id: id
    };
  }));
});

module.exports = BrowserConnection;
