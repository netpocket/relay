require('../spec_helper.js');
Worker = require('../../src/worker.js');

describe("Worker", function() {
  var config = null,
      worker = null;
  
  beforeEach(function() {
    config = {port:1337};
    worker = new Worker(config);
  });

  it("should be ok", function() {
    expect(worker).to.be.ok;
  });
});
