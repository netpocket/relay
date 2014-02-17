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

var connectedDevices = {};

var bindSparkEvents = function(spark) {
  spark.on('my identity', function(data) {
    connectedDevices[data.macAddress] = spark;
    console.log(Object.keys(connectedDevices));
  });
};

var Primus = require('primus')
  , http = require('http')
  , server = http.createServer()
  , primusSpec = { transformer: 'sockjs', parser: 'json' }
  , primus = new Primus(server, primusSpec);

primus.on('connection', function connection(spark) {
  spark.on('data', function (data) {
    if (spark.reserved(data.args[0])) return;
    spark.emit.apply(spark, data.args);
  });
  console.log("New device connected");
  bindSparkEvents(spark);
  spark.write({
    args: ["please identify"]
  });
});

server.listen(config.port);
console.log("Listening on "+config.port);
