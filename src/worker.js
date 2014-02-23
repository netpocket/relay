var Connection = require('./models/connection.js');
var Connections = require('./collections/connections.js');

var Worker = (function(config) {
  "use strict";

  var conns = new Connections();

  var Primus = require('primus'),
      http = require('http'),
      domain = require('domain'),
      server = http.createServer(),
      primusSpec = { transformer: 'sockjs', parser: 'json' },
      primus = new Primus(server, primusSpec);

  primus.on('connection', function connection(spark) {
    var d = domain.create();

    d.on('error', function(err) {
      console.log("error", err.stack);
      try {
        // make sure we close down within 10 seconds
        var killtimer = setTimeout(function() {
          process.exit(1);
        }, 10000);
        // But don't keep the process open just for that!
        killtimer.unref();

        // stop taking new requests.
        server.close();

        // Let the master know we're dead.  This will trigger a
        // 'disconnect' in the cluster master, and then it will fork
        // a new worker.
        var cluster = require('cluster');
        cluster.worker.disconnect();

        // try to send an error to the request that triggered the problem
        spark.write({
          args: ["relay error", err.stack]
        });
      } catch (er2) {
        // oh well, not much we can do at this point.
        console.error('Error sending error report to client', er2.stack);
      }
    });

    d.add(conns);
    d.add(spark);

    d.run(function() {
      var connection = new Connection(spark);
      connection.identified = function() {
        conns.track(connection);
      };
      connection.finished = function() {
        conns.remove(connection);
        console.log(conns.length);
      };
      connection.emit("please identify");
    });
  });

  this.listen = function() {
    server.listen(config.port);
    console.log("Listening on "+config.port);
  };
});

module.exports = Worker;
