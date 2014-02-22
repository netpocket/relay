require('../spec_helper.js');
var Connection = require('../../src/connection.js');
var DeviceConnection = require('../../src/device_connection.js');
var BrowserConnection = require('../../src/browser_connection.js');

describe("Device Connection", function() {
  var conn = null,
      spark = null,
      sparkA = null,
      sparkB = null,
      conns = null;
  
  beforeEach(function() {
    conns = { devices: {} };
    sparkA = {
      on: sinon.stub(),
      write: sinon.stub()
    };
    sparkB = {
      on: sinon.stub(),
      write: sinon.stub()
    };
    conns.browsers = {
      a: new BrowserConnection(new Connection(sparkA, conns)),
      b: new BrowserConnection(new Connection(sparkB, conns)),
    };
    spark = {
      on: sinon.stub(),
      write: sinon.stub()
    };
    var _conn = new Connection(spark, conns);
    spark.write.reset();
    sparkA.write.reset();
    sparkB.write.reset();
    conn = new DeviceConnection(_conn, 'device token');
  });

  describe("connection event", function() {
    it("notifies browsers", function() {
      expect(sparkA).to.write('a wild device appears', {id: 'device token'});
      expect(sparkB).to.write('a wild device appears', {id: 'device token'});
    });
  });

  describe("disconnection event", function() {
    it("listens for the 'end' event", function() {
      expect(spark.on.getCall(2).args[0]).to.eq('end');
    });

    it("notifies browsers", function() {
      spark.on.getCall(2).args[1]();
      expect(sparkA).to.write('a wild device disconnected', {id: 'device token'});
      expect(sparkB).to.write('a wild device disconnected', {id: 'device token'});
    });

    it("removes the connection from memory", function() {
      conns.devices['device token'] = "the device";
      spark.on.getCall(2).args[1]();
      expect(conns.devices['device token']).not.to.be.ok;
    });
  });
});
