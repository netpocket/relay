(function() {
  "use strict";

  var config = {
    port: 1337
  };

  // Move this to Redis
  var connections = {
    devices: {},
    browsers: {},
  };

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

    try {
      var memwatch = require('memwatch');
      memwatch.on('leak', function(info) {
        console.log("leak", info);
      });
      console.log("Watching for memory leaks");
    } catch (e) {
      console.log("Not watching for memory leaks -- npm install memwatch to do so");
    }

    var Worker = require('./src/worker.js'),
    worker = new Worker(cluster, connections, config);

    worker.listen();
  }
})();
