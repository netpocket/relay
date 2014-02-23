var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

_ = require('underscore');

/* Assert that it just wrote */
chai.Assertion.addMethod('write', function(){
  var obj = this._obj;
  var args = Array.prototype.slice.call(arguments, 0);
  this.assert(
    _.isEqual(obj.write.getCall(obj.write.callCount-1).args[0].args, args),
    "expected to write #{exp}, but wrote #{act}",
    "expected not to write #{act}",
    args,
    obj.write.getCall(0).args[0].args,
    true
  );
});

chai.Assertion.addProperty('writeOnce', function(){
  var act = this._obj.write.callCount;
  var exp = 1;
  this.assert(
    act === exp,
    "expected to write #{exp} times but wrote #{act} times",
    "expected not to write #{exp} time",
    exp,
    act
  );
});

/* Assert that it was written at some point in the spy's lifetime */
chai.Assertion.addMethod('written', function(){
  var obj = this._obj;
  var args = Array.prototype.slice.call(arguments, 0);
  var everWrote = function() {
    for (var i = 0, l = obj.write.callCount; i < l; i ++) {
      var test = obj.write.getCall(i).args[0].args;
      if (_.isEqual(test, args)) {
        return true;
      } 
    }
    return false;
    //_.isEqual(obj.write.getCall(obj.write.callCount-1).args[0].args, args)
  };
  this.assert(
    everWrote(),
    "expected to have written #{exp} but it never did",
    "expected not to have ever written #{act}, but it did",
    args[0],
    obj.write.getCall(0).args[0].args,
    true
  );
});

/* Assert that an event emitter was told to listen with 'on' */
chai.Assertion.addMethod('listenOn', function(){
  var obj = this._obj;
  var args = Array.prototype.slice.call(arguments, 0);
  var test = null;
  var wasToldToListenOn = function() {
    for (var i = 0, l = obj.on.callCount; i < l; i ++) {
      var test = obj.on.getCall(i).args[0];
      if (_.isEqual(test, args[0])) {
        return true;
      } 
    }
    return false;
  };
  this.assert(
    wasToldToListenOn(args[0]),
    "expected to be told to listen for #{exp} but wasn't",
    "expected not to be told to listen for #{exp}, it was",
    args[0],
    test,
    true
  );
});

global.expect = chai.expect;
global.sinon = require('sinon');


global.sparkSpy = function() {
  return {
    on: sinon.stub(),
    once: sinon.stub(),
    write: sinon.stub()
  };
};
