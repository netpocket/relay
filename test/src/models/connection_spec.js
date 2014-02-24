require('../../spec_helper.js');
var Connection = require('../../../src/models/connection.js');

describe("Connection Model", function() {
  var conn = null,
      raw = [
        'label',
        {
          some: [
            'of', 'my', { 'data':2 }
          ]
        },
        { 'arg2': ['and', 'more'] }
      ],
      label = raw[0],
      arg1 = raw[1],
      arg2 = raw[2];

  beforeEach(function() {
    conn = new Connection(sparkSpy());
  });

  describe("onData", function() {
    it("calls emit on the spark", function() {
      conn.spark.onCallback('data')({ args:raw });
      expect(conn.spark.emit).to.have.been.calledWith(label, arg1, arg2);
    });
  });

  describe("emit", function() {
    it("writes to the spark", function() {
      conn.emit(label, arg1, arg2);
      expect(conn.spark).to.write(label, arg1, arg2);
    });
  });
});
