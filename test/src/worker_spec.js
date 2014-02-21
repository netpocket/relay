require('../spec_helper.js');
Worker = require('../../src/worker.js');

describe("Worker", function() {
  worker = null;
  
  beforeEach(function() {
    worker = new Worker();
  });

  it("should be ok", function() {
    expect(worker).to.be.ok;
  });
});
