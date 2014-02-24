require('../../spec_helper.js');
var Browser = require('../../../src/models/browser.js');
var Device = require('../../../src/models/device.js');

var Connection = require('../../../src/models/connection.js');
var Connections = require('../../../src/collections/connections.js');

describe("Device Model", function() {
  var dConnA = null, 
      dConnB = null, 
      bConnA = null, 
      bConnB = null, 
      conns = null;

  beforeEach(function() {
    bConnA = new Connection(sparkSpy());
    bConnA.isBrowser('BA', {});

    bConnB = new Connection(sparkSpy());
    bConnB.isBrowser('BB', {});

    dConnA = new Connection(sparkSpy());
    dConnA.isDevice('DA', {});

    dConnB = new Connection(sparkSpy());
    dConnB.isDevice('DB', {});

    // Setup connections
    conns = new Connections([ dConnA , dConnB, bConnA, bConnB ]);

    dConnA.continue(conns);
  });

  describe("communication bridge", function() {
    it("makes browsers listen to this device", function() {
      expect(bConnA.spark).to.listenOn('device:DA');
      expect(bConnB.spark).to.listenOn('device:DA');
    });

    it("does not make other devices listen to this device", function() {
      expect(dConnA.spark).not.to.listenOn('device:DA');
      expect(dConnB.spark).not.to.listenOn('device:DA');
    });

    it("does not listen to itself", function() {
      expect(dConnA.spark).not.to.listenOn('device:DA');
    });

    it("works", function() {
      sinon.stub(dConnA, 'emit');
      sinon.stub(bConnA, 'emit');

      bConnA.spark.onCallback('device:DA')({
        listen: "once"
      });

      expect(dConnA.emit).to.have.been.calledWith(
        'relay',
        'browser:BA', 
        { listen: 'once' }
      );

      dConnA.spark.onceCallback('browser:BA')({
        the: 'response'
      });

      expect(bConnA.emit).to.have.been.calledWith(
        'device:DA', 
        { the: 'response'}
      );

      bConnA.emit.restore();
      dConnA.emit.restore();
    });
  });
});

