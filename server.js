'use strict';

var config = {
  port: 1337
};

var bindSparkEvents = function(spark) {
  spark.on('pong', function() {
    console.log("pong");
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
    args: ["ping"]
  });
});

server.listen(config.port);
console.log("Listening on "+config.port);
