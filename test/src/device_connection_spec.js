require('../spec_helper.js');
var Connection = require('../../src/connection.js');
var DeviceConnection = require('../../src/device_connection.js');
var BrowserConnection = require('../../src/browser_connection.js');

describe("Device Connection", function() {
  var conn = null,
      spark = null,
      sparkA = null,
      sparkB = null,
      d = {attr:1, foo:'bar'},
      conns = null;
  
  beforeEach(function() {
    conns = { devices: {} };
    sparkA = {
      on: sinon.stub(),
      write: sinon.stub()
    };
    sparkB = {
      on: sinon.stub(),
      once: sinon.stub(),
      write: sinon.stub()
    };
    conns.browsers = {
      a: new BrowserConnection(new Connection(sparkA, conns), 'Ba'),
      b: new BrowserConnection(new Connection(sparkB, conns), 'Bb'),
    };
    spark = {
      on: sinon.stub(),
      once: sinon.stub(),
      write: sinon.stub()
    };
    var _conn = new Connection(spark, conns);
    spark.write.reset();
    sparkA.write.reset();
    sparkB.write.reset();
    conn = new DeviceConnection(_conn, 'device token', d);
  });

  describe("connection event", function() {
    it("notifies browsers", function() {
      expect(sparkA).to.write('a wild device appears', {id: 'device token'}, d);
      expect(sparkB).to.write('a wild device appears', {id: 'device token'}, d);
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

  describe("gotMessage", function() {
    var payload = null;

    describe("browser requests uptime", function() {
      beforeEach(function() {
        payload = {
          listen: "once",
          cmd: "feature request",
          args: [ "os", "get uptime" ]
        };
        conn.gotMessage.bind(conns.browsers.a)(payload);
      });
      it("creates a one-time listener on the device connection to capture the response", function() {
        expect(spark.once.getCall(0).args[0]).to.eq('browser:Ba');
      });

      it("forwards the payload to the device itself", function() {
        expect(spark).to.write('relay', 'browser:Ba', payload);
      });

      it("funnels the response back up to the browser connection", function() {
        var resPayload = {
          cmd: "feature response",
          args: [ null, '12345' ]
        };
        spark.once.getCall(0).args[1](resPayload);
        expect(sparkA).to.write(resPayload);
      });
    });
  });
});
