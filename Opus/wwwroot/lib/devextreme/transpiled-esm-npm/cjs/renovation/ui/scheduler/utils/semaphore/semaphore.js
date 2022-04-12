"use strict";

exports.Semaphore = void 0;

var Semaphore = /*#__PURE__*/function () {
  function Semaphore() {
    this.counter = 0;
  }

  var _proto = Semaphore.prototype;

  _proto.isFree = function isFree() {
    return this.counter === 0;
  };

  _proto.take = function take() {
    this.counter += 1;
  };

  _proto.release = function release() {
    this.counter -= 1;

    if (this.counter < 0) {
      this.counter = 0;
    }
  };

  return Semaphore;
}();

exports.Semaphore = Semaphore;