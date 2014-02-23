require('../../spec_helper.js');
var Browser = require('../../../src/models/browser.js');
var Device = require('../../../src/models/device.js');

var Connection = require('../../../src/models/connection.js');
var Connections = require('../../../src/collections/connections.js');

describe("Browser Model", function() {
  var conn = null,
      conns = null;

  beforeEach(function() {
    // Create the browser connection
    conn = new Connection(sparkSpy());
    conn.isBrowser('1', {});

    var dConnA = new Connection(sparkSpy());
    dConnA.isDevice('1', {});

    var dConnB = new Connection(sparkSpy());
    dConnB.isDevice('2', {});

    // Setup connections
    conns = new Connections([ conn , dConnA, dConnB ]);
  });

  describe("continue()", function() {
    beforeEach(function() {
      conn.continue(conns);
    });
    it("sets up a communication bridge with all connected devices", function() {
      expect(conn.spark).to.listenOn('device:1');
      expect(conn.spark).to.listenOn('device:2');
      expect(conn.spark).not.to.listenOn('browser:1');
    });
  });
});

