require('../spec_helper.js');
var Connection = require('../../src/connection.js');
var DeviceConnection = require('../../src/device_connection.js');
var BrowserConnection = require('../../src/browser_connection.js');

describe("Browser Connection", function() {
  var conn = null,
      d = {attr:1, foo:'bar'},
      spark = null,
      sparkA = null,
      sparkB = null,
      conns = null;
  
  beforeEach(function() {
    conns = { browsers: {} };
    sparkA = {
      on: sinon.stub(),
      write: sinon.stub()
    };
    sparkB = {
      on: sinon.stub(),
      write: sinon.stub()
    };
    conns.devices = {
      tokA: new DeviceConnection(new Connection(sparkA, conns), 'tokA', {foo:'bar'}),
      tokB: new DeviceConnection(new Connection(sparkB, conns), 'tokB', {baz:'lak'}),
    };
    spark = {
      on: sinon.stub(),
      write: sinon.stub()
    };
    var _conn = new Connection(spark, conns);
    spark.write.reset();
    conn = new BrowserConnection(_conn, 'token');
  });

  it("sends the currently connected devices", function() {
    expect(spark).to.have.written('a wild device appears', {id: 'tokA'}, {foo:'bar'});
    expect(spark).to.have.written('a wild device appears', {id: 'tokB'}, {baz:'lak'});
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
