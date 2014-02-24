require('../spec_helper.js');
var Worker = require('../../src/worker.js'),
    Primus = require('primus'),
    Connections = require('../../src/collections/connections.js'),
    domain = require('domain');

describe("Worker", function() {
  var config = null,
      spark = null,
      conns = null,
      d = null,
      worker = null;

  beforeEach(function() {
    config = { port: 1337 };
  });

  describe("connection", function() {
    beforeEach(function() {
      d = {
        add: sinon.stub(),
        on: sinon.stub(),
        run: sinon.stub()
      };
      sinon.stub(domain, 'create').returns(d);
      worker = new Worker(config);
      spark = sparkSpy();
      worker.connection(spark);
      conns = d.add.getCall(0).args[0];
    });

    it("adds the connections collection to the domain", function() {
      expect(conns).to.be.an.instanceof(Connections);
    });

    it("adds spark to the domain", function() {
      expect(d.add).to.have.been.calledWith(spark);
    });

    it("runs inside a domain", function() {
      expect(d.run).to.have.been.calledOnce;
    });

    describe("domain context", function() {
      beforeEach(function() {
        d.run.getCall(0).args[0]();
      });

      it("is asked to identify", function() {
        expect(spark).to.write('please identify');
      });

      describe("identified", function() {
        beforeEach(function() {
          spark.onCallback('i am a web browser')('a', {});
        });

        it("is tracked", function() {
          expect(conns).to.have.length(1);
          expect(conns.at(0).get('token')).to.eq("a");
          expect(conns.at(0).get('model')).to.eq("browser");
        });

        it("replaces existing", function() {
          spark.onCallback('i am a web browser')('a', {});
          expect(conns).to.have.length(1);
          expect(conns.at(0).get('token')).to.eq("a");
          expect(conns.at(0).get('model')).to.eq("browser");
        });

        describe("finished", function() {
          it("is removed", function() {
            spark.onCallback('end')();
            expect(conns).to.have.length(0);
          });
        });
      });
    });

    afterEach(function() {
      domain.create.restore();
    });
  });

});
