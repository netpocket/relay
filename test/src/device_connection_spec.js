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

  it("tells connected browsers that this device connected", function() {
    expect(sparkA).to.write('a wild device appears', {id: 'device token'});
    expect(sparkB).to.write('a wild device appears', {id: 'device token'});
  });
});
