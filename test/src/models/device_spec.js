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
  });

  describe("continue()", function() {
    beforeEach(function() {
      dConnA.continue(conns);
    });
    it("sets up a communication bridge with all connected browsers", function() {
      expect(dConnA.spark).not.to.listenOn('device:DA');
      expect(dConnB.spark).not.to.listenOn('device:DA');
      expect(bConnA.spark).to.listenOn('device:DA');
      expect(bConnB.spark).to.listenOn('device:DA');
    });
  });
});

