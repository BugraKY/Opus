import Callbacks from '../../core/utils/callbacks';
var eventEmitterMethods = {
  _initEvents: function _initEvents() {
    var names = this._eventNames;
    var i;
    var ii = names.length;
    var events = this._events = {};

    for (i = 0; i < ii; ++i) {
      events[names[i]] = Callbacks();
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
export function makeEventEmitter(target) {
  var proto = target.prototype;
  var name;

  for (name in eventEmitterMethods) {
    proto[name] = eventEmitterMethods[name];
  }
}