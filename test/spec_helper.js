var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

chai.Assertion.addMethod('write', function(){
  var arraysEqual = function(a, b) {
    if (a === b) return true;
    if (a === null || b === null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  var obj = this._obj;
  var args = Array.prototype.slice.call(arguments, 0);
  this.assert(
    arraysEqual(obj.write.getCall(0).args[0].args, args),
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

global.expect = chai.expect;
global.sinon = require('sinon');

