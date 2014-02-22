require('../spec_helper.js');
var Connection = require('../../src/connection.js');
var BrowserConnection = require('../../src/browser_connection.js');

describe("Browser Connection", function() {
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
    conn = new BrowserConnection(_conn, 'token');
  });

  it("sends the currently connected devices", function() {
    expect(spark).to.write('here take these devices', [
      {id: 'a'},
      {id: 'b'}
    ]);
  });

  describe("disconnection event", function() {
    it("listens for the 'end' event", function() {
      expect(spark.on.getCall(2).args[0]).to.eq('end');
    });

    it("removes the connection from memory", function() {
      conns.browsers['token'] = "blah";
      spark.on.getCall(2).args[1]();
      expect(conns.browsers['token']).not.to.be.ok;
    });
  });
});
