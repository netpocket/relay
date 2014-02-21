require('../spec_helper.js');
var Connection = require('../../src/connection.js');

describe("Connection", function() {
  var conn = null,
      spark = null,
      redis = null;
  
  beforeEach(function() {
    spark = {
      on: sinon.stub(),
      write: sinon.stub()
    };
    redis = sinon.stub();
    conn = new Connection(spark, redis);
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
});
