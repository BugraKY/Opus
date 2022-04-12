"use strict";

exports.makeEventEmitter = makeEventEmitter;

var _callbacks = _interopRequireDefault(require("../../core/utils/callbacks"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var eventEmitterMethods = {
  _initEvents: function _initEvents() {
    var names = this._eventNames;
    var i;
    var ii = names.length;
    var events = this._events = {};

    for (i = 0; i < ii; ++i) {
      events[names[i]] = (0, _callbacks.default)();
    }
  },
  _disposeEvents: function _disposeEvents() {
    var events = this._events;
    var name;

    for (name in events) {
      events[name].empty();
    }

    this._events = null;
  },
  on: function on(handlers) {
    var events = this._events;
    var name;

    for (name in handlers) {
      events[name].add(handlers[name]);
    }

    return dispose;

    function dispose() {
      for (name in handlers) {
        events[name].remove(handlers[name]);
      }
    }
  },
  _fire: function _fire(name, arg) {
    this._events[name].fire(arg);
  }
};

function makeEventEmitter(target) {
  var proto = target.prototype;
  var name;

  for (name in eventEmitterMethods) {
    proto[name] = eventEmitterMethods[name];
  }
}