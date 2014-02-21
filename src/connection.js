var Connection = (function(spark, connections) {
  "use strict";

  var emit = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    console.log("emitting", args);
    spark.write({args:args});
  };

  spark.on('i am a netpocketos device', function(token, info) {
    connections.devices[token] = {
      info: info,
      spark: spark
    };
    console.log(Object.keys(connections.devices));
  });

  spark.on('i am a web browser', function(token, info) {
    connections.browsers[token] = {
      info: info,
      spark: spark
    };
    console.log(Object.keys(connections.browsers));
  });

  emit("please identify");

});

module.exports = Connection;
