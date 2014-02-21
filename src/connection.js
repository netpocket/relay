var Connection = (function(spark, conns) {
  "use strict";

  var emit = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    spark.write({args:args});
  };

  spark.on('i am a netpocketos device', function(token, info) {
    conns.devices[token] = {
      info: info,
      spark: spark
    };
    console.log(Object.keys(conns.devices));
  });

  spark.on('i am a web browser', function(token, info) {
    conns.browsers[token] = {
      info: info,
      spark: spark
    };
    console.log(Object.keys(conns.browsers));
  });

  emit("please identify");

});

module.exports = Connection;
