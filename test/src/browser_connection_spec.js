require('../spec_helper.js');
var Connection = require('../../src/connection.js');
var BrowserConnection = require('../../src/browser_connection.js');

describe("Connection", function() {
  var conn = null,
      spark = null,
      conns = null;
  
  beforeEach(function() {
    conns = { devices: {
      a: {},
      b: {}
    }, browsers: {} };
    spark = {
      on: sinon.stub(),
      write: sinon.stub()
    };
    var _conn = new Connection(spark, conns);
    spark.write.reset();
    conn = new BrowserConnection(_conn);
  });

  it("sends the currently connected devices", function() {
    expect(spark).to.write('here take these devices', [
      {id: 'a'},
      {id: 'b'}
    ]);
  });
});
