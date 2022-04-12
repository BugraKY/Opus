"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _ready_callbacks = _interopRequireDefault(require("../../core/utils/ready_callbacks"));

var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));

var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));

var _element_data = require("../../core/element_data");

var _class = _interopRequireDefault(require("../../core/class"));

var _extend = require("../../core/utils/extend");

var _array = require("../../core/utils/array");

var _iterator = require("../../core/utils/iterator");

var _event_registrator = _interopRequireDefault(require("./event_registrator"));

var _index = require("../utils/index");

var _pointer = _interopRequireDefault(require("../pointer"));

var _wheel = require("./wheel");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MANAGER_EVENT = 'dxEventManager';
var EMITTER_DATA = 'dxEmitter';

var EventManager = _class.default.inherit({
  ctor: function ctor() {
    this._attachHandlers();

    this.reset();
    this._proxiedCancelHandler = this._cancelHandler.bind(this);
    this._proxiedAcceptHandler = this._acceptHandler.bind(this);
  },
  _attachHandlers: function _attachHandlers() {
    _ready_callbacks.default.add(function () {
      var document = _dom_adapter.default.getDocument();

      _events_engine.default.subscribeGlobal(document, (0, _index.addNamespace)(_pointer.default.down, MANAGER_EVENT), this._pointerDownHandler.bind(this));

      _events_engine.default.subscribeGlobal(document, (0, _index.addNamespace)(_pointer.default.move, MANAGER_EVENT), this._pointerMoveHandler.bind(this));

      _events_engine.default.subscribeGlobal(document, (0, _index.addNamespace)([_pointer.default.up, _pointer.default.cancel].join(' '), MANAGER_EVENT), this._pointerUpHandler.bind(this));

      _events_engine.default.subscribeGlobal(document, (0, _index.addNamespace)(_wheel.name, MANAGER_EVENT), this._mouseWheelHandler.bind(this));
    }.bind(this));
  },
  _eachEmitter: function _eachEmitter(callback) {
    var activeEmitters = this._activeEmitters || [];
    var i = 0;

    while (activeEmitters.length > i) {
      var emitter = activeEmitters[i];

      if (callback(emitter) === false) {
        break;
      }

      if (activeEmitters[i] === emitter) {
        i++;
      }
    }
  },
  _applyToEmitters: function _applyToEmitters(method, arg) {
    this._eachEmitter(function (emitter) {
      emitter[method].call(emitter, arg);
    });
  },
  reset: function reset() {
    this._eachEmitter(this._proxiedCancelHandler);

    this._activeEmitters = [];
  },
  resetEmitter: function resetEmitter(emitter) {
    this._proxiedCancelHandler(emitter);
  },
  _pointerDownHandler: function _pointerDownHandler(e) {
    if ((0, _index.isMouseEvent)(e) && e.which > 1) {
      return;
    }

    this._updateEmitters(e);
  },
  _updateEmitters: function _updateEmitters(e) {
    if (!this._isSetChanged(e)) {
      return;
    }

    this._cleanEmitters(e);

    this._fetchEmitters(e);
  },
  _isSetChanged: function _isSetChanged(e) {
    var currentSet = this._closestEmitter(e);

    var previousSet = this._emittersSet || [];
    var setChanged = currentSet.length !== previousSet.length;
    (0, _iterator.each)(currentSet, function (index, emitter) {
      setChanged = setChanged || previousSet[index] !== emitter;
      return !setChanged;
    });
    this._emittersSet = currentSet;
    return setChanged;
  },
  _closestEmitter: function _closestEmitter(e) {
    var that = this;
    var result = [];
    var $element = (0, _renderer.default)(e.target);

    function handleEmitter(_, emitter) {
      if (!!emitter && emitter.validatePointers(e) && emitter.validate(e)) {
        emitter.addCancelCallback(that._proxiedCancelHandler);
        emitter.addAcceptCallback(that._proxiedAcceptHandler);
        result.push(emitter);
      }
    }

    while ($element.length) {
      var emitters = (0, _element_data.data)($element.get(0), EMITTER_DATA) || [];
      (0, _iterator.each)(emitters, handleEmitter);
      $element = $element.parent();
    }

    return result;
  },
  _acceptHandler: function _acceptHandler(acceptedEmitter, e) {
    var that = this;

    this._eachEmitter(function (emitter) {
      if (emitter !== acceptedEmitter) {
        that._cancelEmitter(emitter, e);
      }
    });
  },
  _cancelHandler: function _cancelHandler(canceledEmitter, e) {
    this._cancelEmitter(canceledEmitter, e);
  },
  _cancelEmitter: function _cancelEmitter(emitter, e) {
    var activeEmitters = this._activeEmitters;

    if (e) {
      emitter.cancel(e);
    } else {
      emitter.reset();
    }

    emitter.removeCancelCallback();
    emitter.removeAcceptCallback();
    var emitterIndex = (0, _array.inArray)(emitter, activeEmitters);

    if (emitterIndex > -1) {
      activeEmitters.splice(emitterIndex, 1);
    }
  },
  _cleanEmitters: function _cleanEmitters(e) {
    this._applyToEmitters('end', e);

    this.reset(e);
  },
  _fetchEmitters: function _fetchEmitters(e) {
    this._activeEmitters = this._emittersSet.slice();

    this._applyToEmitters('start', e);
  },
  _pointerMoveHandler: function _pointerMoveHandler(e) {
    this._applyToEmitters('move', e);
  },
  _pointerUpHandler: function _pointerUpHandler(e) {
    this._updateEmitters(e);
  },
  _mouseWheelHandler: function _mouseWheelHandler(e) {
    if (!this._allowInterruptionByMouseWheel()) {
      return;
    }

    e.pointers = [null];

    this._pointerDownHandler(e);

    this._adjustWheelEvent(e);

    this._pointerMoveHandler(e);

    e.pointers = [];

    this._pointerUpHandler(e);
  },
  _allowInterruptionByMouseWheel: function _allowInterruptionByMouseWheel() {
    var allowInterruption = true;

    this._eachEmitter(function (emitter) {
      allowInterruption = emitter.allowInterruptionByMouseWheel() && allowInterruption;
      return allowInterruption;
    });

    return allowInterruption;
  },
  _adjustWheelEvent: function _adjustWheelEvent(e) {
    var closestGestureEmitter = null;

    this._eachEmitter(function (emitter) {
      if (!emitter.gesture) {
        return;
      }

      var direction = emitter.getDirection(e);

      if (direction !== 'horizontal' && !e.shiftKey || direction !== 'vertical' && e.shiftKey) {
        closestGestureEmitter = emitter;
        return false;
      }
    });

    if (!closestGestureEmitter) {
      return;
    }

    var direction = closestGestureEmitter.getDirection(e);
    var verticalGestureDirection = direction === 'both' && !e.shiftKey || direction === 'vertical';
    var prop = verticalGestureDirection ? 'pageY' : 'pageX';
    e[prop] += e.delta;
  },
  isActive: function isActive(element) {
    var result = false;

    this._eachEmitter(function (emitter) {
      result = result || emitter.getElement().is(element);
    });

    return result;
  }
});

var eventManager = new EventManager();
var EMITTER_SUBSCRIPTION_DATA = 'dxEmitterSubscription';

var registerEmitter = function registerEmitter(emitterConfig) {
  var emitterClass = emitterConfig.emitter;
  var emitterName = emitterConfig.events[0];
  var emitterEvents = emitterConfig.events;
  (0, _iterator.each)(emitterEvents, function (_, eventName) {
    (0, _event_registrator.default)(eventName, {
      noBubble: !emitterConfig.bubble,
      setup: function setup(element) {
        var subscriptions = (0, _element_data.data)(element, EMITTER_SUBSCRIPTION_DATA) || {};
        var emitters = (0, _element_data.data)(element, EMITTER_DATA) || {};
        var emitter = emitters[emitterName] || new emitterClass(element);
        subscriptions[eventName] = true;
        emitters[emitterName] = emitter;
        (0, _element_data.data)(element, EMITTER_DATA, emitters);
        (0, _element_data.data)(element, EMITTER_SUBSCRIPTION_DATA, subscriptions);
      },
      add: function add(element, handleObj) {
        var emitters = (0, _element_data.data)(element, EMITTER_DATA);
        var emitter = emitters[emitterName];
        emitter.configure((0, _extend.extend)({
          delegateSelector: handleObj.selector
        }, handleObj.data), handleObj.type);
      },
      teardown: function teardown(element) {
        var subscriptions = (0, _element_data.data)(element, EMITTER_SUBSCRIPTION_DATA);
        var emitters = (0, _element_data.data)(element, EMITTER_DATA);
        var emitter = emitters[emitterName];
        delete subscriptions[eventName];
        var disposeEmitter = true;
        (0, _iterator.each)(emitterEvents, function (_, eventName) {
          disposeEmitter = disposeEmitter && !subscriptions[eventName];
          return disposeEmitter;
        });

        if (disposeEmitter) {
          if (eventManager.isActive(element)) {
            eventManager.resetEmitter(emitter);
          }

          emitter && emitter.dispose();
          delete emitters[emitterName];
        }
      }
    });
  });
};

var _default = registerEmitter;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;