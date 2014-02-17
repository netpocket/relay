'use strict';
try {
  var memwatch = require('memwatch');
  memwatch.on('leak', function(info) {
    console.log("leak", info);
  });
  console.log("Watching for memory leaks");
} catch (e) {
  console.log("Not watching for memory leaks -- npm install memwatch to do so");
}

var config = {
  port: 1337
};

// Move this to Redis
var connectedDevices = {}
  , connectedBrowsers = {};

var cluster = require('cluster');
if (cluster.isMaster) {

  // One worker for now -- but later can check # of cpus
  cluster.fork();

  cluster.on('disconnect', function(worker) {
    console.error("disconnect!");
    cluster.fork();
  });

} else {
  // the worker

  var Primus = require('primus')
    , http = require('http')
    , domain = require('domain')
    , server = http.createServer()
    , primusSpec = { transformer: 'sockjs', parser: 'json' }
    , primus = new Primus(server, primusSpec);

  primus.on('connection', function connection(spark) {

    var d = domain.create();

    d.on('error', function(err) {
      console.log("error", err.stack);
      try {
        // make sure we close down within 30 seconds
        var killtimer = setTimeout(function() {
          process.exit(1);
        }, 5000);
        // But don't keep the process open just for that!
        killtimer.unref();

        // stop taking new requests.
        server.close();

        // Let the master know we're dead.  This will trigger a
        // 'disconnect' in the cluster master, and then it will fork
        // a new worker.
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

    d.add(spark);

    d.run(function() {
      spark.on('data', function (data) {
        if (spark.reserved(data.args[0])) return;
        spark.emit.apply(spark, data.args);
      });

      spark.on('i am a netpocketos device', function(token, info) {
        connectedDevices[token] = {
          info: info,
          spark: spark
        };
        console.log(Object.keys(connectedDevices));
      });

      spark.write({
        args: ["please identify"]
      });
    });
  });

  server.listen(config.port);
  console.log("Listening on "+config.port);
}

