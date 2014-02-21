var BrowserConnection = (function(conn) {
  var emit = conn.emit;



  emit(conn.conns.devices);
});

module.exports = BrowserConnection;
