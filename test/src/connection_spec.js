require('../spec_helper.js');
var Connection = require('../../src/connection.js');
var BrowserConnection = require('../../src/browser_connection.js');

describe("Connection", function() {
  var conn = null,
      spark = null,
      conns = null,
      entry = null;
  
  beforeEach(function() {
    conns = { devices: {}, browsers: {} };
    spark = {
      on: sinon.stub(),
      write: sinon.stub()
    };
    conn = new Connection(spark, conns);
  });

  afterEach(function() {
    conns = { devices: {}, browsers: {} };
  });

  it("saves the spark", function() {
    expect(conn.spark).to.eq(spark);
  });

  it("saves the connections", function() {
    expect(conn.conns).to.eq(conns);
  });

  it("listens for a identification as a web browser", function() {
    expect(spark.on.getCall(1).args[0]).to.eq('i am a web browser');
  });

  it("listens for a identification as a device", function() {
    expect(spark.on.getCall(0).args[0]).to.eq('i am a netpocketos device');
  });

  it("solicits identification", function() {
    expect(spark.write).to.have.been.calledWith({args:['please identify']});
    expect(spark.write).to.have.been.calledOnce;
  });

  describe("a web browser identifies itself", function() {
    beforeEach(function() {
      sinon.stub(conn, 'emit');
      spark.on.getCall(1).args[1]('user token', 'user data');
      entry = conns.browsers['user token'];
    });

    afterEach(function() {
      conn.emit.reset();
    });

    it("adds a new browser connection", function() {
      expect(entry).to.be.an.instanceof(BrowserConnection);
    });

    it("sends the currently connected devices", function() {
      expect(conn.emit).to.have.been.calledWith(conns.devices);
      expect(conn.emit).to.have.been.calledOnce;
    });
  });

  describe("a device identifies itself", function() {
    beforeEach(function() {
      spark.on.getCall(0).args[1]('device token', 'device data');
      entry = conns.devices['device token'];
    });

    it("adds it to the list of device connections", function() {
      expect(entry).to.eq(conn);
    });
  });
});
