require('../spec_helper.js');
App = require('../../src/app.js');

describe("App", function() {
  app = null;
  
  beforeEach(function() {
    app = new App();
  });

  it("should be ok", function() {
    expect(app).to.be.ok;
  });
});
