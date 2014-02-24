require('../../spec_helper.js');
var Browser = require('../../../src/models/browser.js');
var Device = require('../../../src/models/device.js');

var Connection = require('../../../src/models/connection.js');
var Connections = require('../../../src/collections/connections.js');

describe("Browser Model", function() {
  var dConnA = null, 
      dConnB = null, 
      bConnA = null, 
      bConnB = null, 
      conns = null;

  beforeEach(function() {
    // Create the browser connection
    bConnA = new Connection(sparkSpy());
    bConnA.isBrowser('1', {});

    bConnB = new Connection(sparkSpy());
    bConnB.isBrowser('2', {});

    dConnA = new Connection(sparkSpy());
    dConnA.isDevice('1', {});

    dConnB = new Connection(sparkSpy());
    dConnB.isDevice('2', {});

    // Setup connections
    conns = new Connections([ bConnA , bConnB, dConnA, dConnB ]);

    bConnA.continue(conns);
  });

  describe("communicate bridge", function() {
    it("listens to all connected devices", function() {
      expect(bConnA.spark).to.listenOn('device:1');
      expect(bConnA.spark).to.listenOn('device:2');
    });

    it("does not listen to itself", function() {
      expect(bConnA.spark).not.to.listenOn('browser:1');
    });

    it("does not listen to other browsers", function() {
      expect(bConnA.spark).not.to.listenOn('browser:2');
    });

    it("works", function() {
      sinon.stub(bConnA, 'emit');
      sinon.stub(dConnA, 'emit');

      bConnA.spark.onCallback('device:1')({
        listen: "once"
      });

      expect(dConnA.emit).to.have.been.calledWith(
        'relay',
        'browser:1',
        { listen: 'once' }
      );

      dConnA.spark.onceCallback('browser:1')({
        the: 'response'
      });

      expect(bConnA.emit).to.have.been.calledWith(
        'device:1', 
        { the: 'response'}
      );

      dConnA.emit.restore();
      bConnA.emit.restore();
    });
  });
});

