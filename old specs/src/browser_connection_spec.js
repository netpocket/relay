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
      once: sinon.stub(),
      write: sinon.stub()
    };
    sparkB = {
      on: sinon.stub(),
      once: sinon.stub(),
      write: sinon.stub()
    };
    conns.devices = {
      tokA: new DeviceConnection(new Connection(sparkA, conns), 'tokA', {foo:'bar'}),
      tokB: new DeviceConnection(new Connection(sparkB, conns), 'tokB', {baz:'lak'}),
    };
    spark = {
      on: sinon.stub(),
      once: sinon.stub(),
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

  describe("device-intended messages", function() {
    it("listens for messages intended for a specific device", function() {
      expect(spark.on.getCall(3).args[0]).to.eq('device:tokA');
      expect(spark.on.getCall(4).args[0]).to.eq('device:tokB');
    });

    var payload = null;

    describe("browser requests uptime", function() {
      beforeEach(function() {
        payload = {
          listen: "once",
          cmd: "feature request",
          args: [ "os", "get uptime" ]
        };
        spark.on.getCall(3).args[1](payload);
      });

      it("creates a one-time listener on the device connection", function() {
        expect(sparkA.once.getCall(0).args[0]).to.eq('browser:token');
      });

      it("forwards the payload to the device", function() {
        expect(sparkA).to.write('relay', 'browser:token', payload);
      });

      it("funnels the response back to the browser connection as though from the device", function() {
        var resPayload = {
          cmd: "feature response",
          args: [ "os", "get uptime" ],
          err: null,
          res: '12345'
        };
        sparkA.once.getCall(0).args[1](resPayload);
        expect(spark).to.write('device:tokA', resPayload);
      });
    });
  });
});
