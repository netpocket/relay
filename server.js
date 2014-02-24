(function() {
  "use strict";

  var config = {
    port: process.env.PORT || 1337
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
    worker = new Worker(config);

    worker.listen();
  }
})();
