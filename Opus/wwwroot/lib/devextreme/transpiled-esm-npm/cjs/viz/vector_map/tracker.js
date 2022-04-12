"use strict";

exports.Tracker = Tracker;

var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));

var _window = require("../../core/utils/window");

var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));

var _event_emitter = require("./event_emitter");

var _index = require("../../events/utils/index");

var _wheel = require("../../events/core/wheel");

var _utils = require("../core/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var navigator = (0, _window.getNavigator)();
var _math = Math;
var _abs = _math.abs;
var _sqrt = _math.sqrt;
var _round = _math.round;
var _addNamespace = _index.addNamespace;
var _NAME = 'dxVectorMap';
var EVENT_START = 'start';
var EVENT_MOVE = 'move';
var EVENT_END = 'end';
var EVENT_ZOOM = 'zoom';
var EVENT_HOVER_ON = 'hover-on';
var EVENT_HOVER_OFF = 'hover-off';
var EVENT_CLICK = 'click';
var EVENT_FOCUS_ON = 'focus-on';
var EVENT_FOCUS_MOVE = 'focus-move';
var EVENT_FOCUS_OFF = 'focus-off';
var CLICK_TIME_THRESHOLD = 500;
var CLICK_COORD_THRESHOLD_MOUSE = 5;
var CLICK_COORD_THRESHOLD_TOUCH = 20;
var DRAG_COORD_THRESHOLD_MOUSE = 5;
var DRAG_COORD_THRESHOLD_TOUCH = 10;
var FOCUS_OFF_DELAY = 100;
var WHEEL_COOLDOWN = 50;
var WHEEL_DIRECTION_COOLDOWN = 300;
var EVENTS;
var Focus;
setupEvents();

function Tracker(parameters) {
  var that = this;
  that._root = parameters.root;

  that._createEventHandlers(parameters.dataKey);

  that._createProjectionHandlers(parameters.projection);

  that._initEvents();

  that._focus = new Focus(function (name, arg) {
    that._fire(name, arg);
  });

  that._attachHandlers();
}

Tracker.prototype = {
  constructor: Tracker,
  dispose: function dispose() {
    var that = this;

    that._detachHandlers();

    that._disposeEvents();

    that._focus.dispose();

    that._root = that._focus = that._docHandlers = that._rootHandlers = null;
  },
  _eventNames: [EVENT_START, EVENT_MOVE, EVENT_END, EVENT_ZOOM, EVENT_CLICK, EVENT_HOVER_ON, EVENT_HOVER_OFF, EVENT_FOCUS_ON, EVENT_FOCUS_OFF, EVENT_FOCUS_MOVE],
  _startClick: function _startClick(event, data) {
    if (!data) {
      return;
    }

    var coords = getEventCoords(event);
    this._clickState = {
      x: coords.x,
      y: coords.y,
      threshold: isTouchEvent(event) ? CLICK_COORD_THRESHOLD_TOUCH : CLICK_COORD_THRESHOLD_MOUSE,
      time: Date.now()
    };
  },
  _endClick: function _endClick(event, data) {
    var state = this._clickState;
    var threshold;
    var coords;

    if (!state) {
      return;
    }

    if (data && Date.now() - state.time <= CLICK_TIME_THRESHOLD) {
      threshold = state.threshold;
      coords = getEventCoords(event);

      if (_abs(coords.x - state.x) <= threshold && _abs(coords.y - state.y) <= threshold) {
        this._fire(EVENT_CLICK, {
          data: data,
          x: coords.x,
          y: coords.y,
          $event: event
        });
      }
    }

    this._clickState = null;
  },
  _startDrag: function _startDrag(event, data) {
    if (!data) {
      return;
    }

    var coords = getEventCoords(event);
    var state = this._dragState = {
      x: coords.x,
      y: coords.y,
      data: data
    };

    this._fire(EVENT_START, {
      x: state.x,
      y: state.y,
      data: state.data
    });
  },
  _moveDrag: function _moveDrag(event, data) {
    var state = this._dragState;

    if (!state) {
      return;
    }

    var coords = getEventCoords(event);
    var threshold = isTouchEvent(event) ? DRAG_COORD_THRESHOLD_TOUCH : DRAG_COORD_THRESHOLD_MOUSE;

    if (state.active || _abs(coords.x - state.x) > threshold || _abs(coords.y - state.y) > threshold) {
      state.x = coords.x;
      state.y = coords.y;
      state.active = true;
      state.data = data || {};

      this._fire(EVENT_MOVE, {
        x: state.x,
        y: state.y,
        data: state.data
      });
    }
  },
  _endDrag: function _endDrag() {
    var state = this._dragState;

    if (!state) {
      return;
    }

    this._dragState = null;

    this._fire(EVENT_END, {
      x: state.x,
      y: state.y,
      data: state.data
    });
  },
  _wheelZoom: function _wheelZoom(event, data) {
    if (!data) {
      return;
    }

    var that = this;
    var lock = that._wheelLock;
    var time = Date.now();

    if (time - lock.time <= WHEEL_COOLDOWN) {
      return;
    } // T136650


    if (time - lock.dirTime > WHEEL_DIRECTION_COOLDOWN) {
      lock.dir = 0;
    } // T107589, T136650


    var delta = adjustWheelDelta(event.delta / 120 || 0, lock);

    if (delta === 0) {
      return;
    }

    var coords = getEventCoords(event);

    that._fire(EVENT_ZOOM, {
      delta: delta,
      x: coords.x,
      y: coords.y
    });

    lock.time = lock.dirTime = time;
  },
  _startZoom: function _startZoom(event, data) {
    if (!isTouchEvent(event) || !data) {
      return;
    }

    var state = this._zoomState = this._zoomState || {};
    var coords;
    var pointer2;

    if (state.pointer1 && state.pointer2) {
      return;
    }

    if (state.pointer1 === undefined) {
      state.pointer1 = getPointerId(event) || 0;
      coords = getMultitouchEventCoords(event, state.pointer1);
      state.x1 = state.x1_0 = coords.x;
      state.y1 = state.y1_0 = coords.y;
    }

    if (state.pointer2 === undefined) {
      pointer2 = getPointerId(event) || 1;

      if (pointer2 !== state.pointer1) {
        coords = getMultitouchEventCoords(event, pointer2);

        if (coords) {
          state.x2 = state.x2_0 = coords.x;
          state.y2 = state.y2_0 = coords.y;
          state.pointer2 = pointer2;
          state.ready = true;

          this._endDrag();
        }
      }
    }
  },
  _moveZoom: function _moveZoom(event) {
    var state = this._zoomState;
    var coords;

    if (!state || !isTouchEvent(event)) {
      return;
    }

    if (state.pointer1 !== undefined) {
      coords = getMultitouchEventCoords(event, state.pointer1);

      if (coords) {
        state.x1 = coords.x;
        state.y1 = coords.y;
      }
    }

    if (state.pointer2 !== undefined) {
      coords = getMultitouchEventCoords(event, state.pointer2);

      if (coords) {
        state.x2 = coords.x;
        state.y2 = coords.y;
      }
    }
  },
  _endZoom: function _endZoom(event) {
    var state = this._zoomState;
    var startDistance;
    var currentDistance;

    if (!state || !isTouchEvent(event)) {
      return;
    }

    if (state.ready) {
      startDistance = getDistance(state.x1_0, state.y1_0, state.x2_0, state.y2_0);
      currentDistance = getDistance(state.x1, state.y1, state.x2, state.y2);

      this._fire(EVENT_ZOOM, {
        ratio: currentDistance / startDistance,
        x: (state.x1_0 + state.x2_0) / 2,
        y: (state.y1_0 + state.y2_0) / 2
      });
    }

    this._zoomState = null;
  },
  _startHover: function _startHover(event, data) {
    this._doHover(event, data, true);
  },
  _moveHover: function _moveHover(event, data) {
    this._doHover(event, data, false);
  },
  _doHover: function _doHover(event, data, isTouch) {
    var that = this;

    if (that._dragState && that._dragState.active || that._zoomState && that._zoomState.ready) {
      that._cancelHover();

      return;
    }

    if (isTouchEvent(event) !== isTouch || that._hoverTarget === event.target || that._hoverState && that._hoverState.data === data) {
      return;
    }

    that._cancelHover();

    if (data) {
      that._hoverState = {
        data: data
      };

      that._fire(EVENT_HOVER_ON, {
        data: data
      });
    }

    that._hoverTarget = event.target;
  },
  _cancelHover: function _cancelHover() {
    var state = this._hoverState;
    this._hoverState = this._hoverTarget = null;

    if (state) {
      this._fire(EVENT_HOVER_OFF, {
        data: state.data
      });
    }
  },
  _startFocus: function _startFocus(event, data) {
    this._doFocus(event, data, true);
  },
  _moveFocus: function _moveFocus(event, data) {
    this._doFocus(event, data, false);
  },
  _doFocus: function _doFocus(event, data, isTouch) {
    var that = this;

    if (that._dragState && that._dragState.active || that._zoomState && that._zoomState.ready) {
      that._cancelFocus();

      return;
    }

    if (isTouchEvent(event) !== isTouch) {
      return;
    }

    that._focus.turnOff();

    data && that._focus.turnOn(data, getEventCoords(event));
  },
  _cancelFocus: function _cancelFocus() {
    this._focus.cancel();
  },
  _createEventHandlers: function _createEventHandlers(DATA_KEY) {
    var that = this;
    that._docHandlers = {};
    that._rootHandlers = {}; // Because of "stopPropagation" at any time only one of two handlers will be fully executed

    that._rootHandlers[EVENTS.start]
    /* T322560 */
    = that._docHandlers[EVENTS.start] = function (event) {
      var isTouch = isTouchEvent(event);
      var data = getData(event);

      if (isTouch && !that._isTouchEnabled) {
        return;
      }

      if (data) {
        event.preventDefault();
        event.stopPropagation(); // T322560
      }

      that._startClick(event, data);

      that._startDrag(event, data);

      that._startZoom(event, data);

      that._startHover(event, data);

      that._startFocus(event, data);
    };

    that._docHandlers[EVENTS.move] = function (event) {
      var isTouch = isTouchEvent(event);
      var data = getData(event);

      if (isTouch && !that._isTouchEnabled) {
        return;
      }

      that._moveDrag(event, data);

      that._moveZoom(event, data);

      that._moveHover(event, data);

      that._moveFocus(event, data);
    };

    that._docHandlers[EVENTS.end] = function (event) {
      var isTouch = isTouchEvent(event);
      var data = getData(event);

      if (isTouch && !that._isTouchEnabled) {
        return;
      }

      that._endClick(event, data);

      that._endDrag(event, data);

      that._endZoom(event, data);
    };

    that._rootHandlers[EVENTS.wheel] = function (event) {
      that._cancelFocus();

      if (!that._isWheelEnabled) {
        return;
      }

      var data = getData(event);

      if (data) {
        event.preventDefault();
        event.stopPropagation(); // T249548

        that._wheelZoom(event, data);
      }
    };

    that._wheelLock = {
      dir: 0
    }; // Actually it is responsibility of the text element wrapper to handle "data" to its span elements (if there are any).
    // Now to avoid not so necessary complication of renderer text-span issue is handled on the side of the tracker.

    function getData(event) {
      var target = event.target;
      return (target.tagName === 'tspan' ? target.parentNode : target)[DATA_KEY];
    }
  },
  _createProjectionHandlers: function _createProjectionHandlers(projection) {
    var that = this;
    projection.on({
      'center': handler,
      'zoom': handler
    }); // T247841

    function handler() {
      // `_cancelHover` probably should also be called here but for now let it not be so
      that._cancelFocus();
    }
  },
  reset: function reset() {
    var that = this;
    that._clickState = null;

    that._endDrag();

    that._cancelHover();

    that._cancelFocus();
  },
  setOptions: function setOptions(options) {
    var that = this;
    that.reset();

    that._detachHandlers();

    that._isTouchEnabled = !!(0, _utils.parseScalar)(options.touchEnabled, true);
    that._isWheelEnabled = !!(0, _utils.parseScalar)(options.wheelEnabled, true);

    that._attachHandlers();
  },
  _detachHandlers: function _detachHandlers() {
    var that = this;

    if (that._isTouchEnabled) {
      that._root.css({
        'touch-action': '',
        '-webkit-user-select': ''
      }).off(_addNamespace('MSHoldVisual', _NAME)).off(_addNamespace('contextmenu', _NAME));
    }

    _events_engine.default.off(_dom_adapter.default.getDocument(), that._docHandlers);

    that._root.off(that._rootHandlers);
  },
  _attachHandlers: function _attachHandlers() {
    var that = this;

    if (that._isTouchEnabled) {
      that._root.css({
        'touch-action': 'none',
        '-webkit-user-select': 'none'
      }).on(_addNamespace('MSHoldVisual', _NAME), function (event) {
        event.preventDefault();
      }).on(_addNamespace('contextmenu', _NAME), function (event) {
        isTouchEvent(event) && event.preventDefault();
      });
    }

    _events_engine.default.on(_dom_adapter.default.getDocument(), that._docHandlers);

    that._root.on(that._rootHandlers);
  }
};

Focus = function Focus(fire) {
  var that = this;
  var _activeData = null;
  var _data = null;
  var _disabled = false;
  var _offTimer = null;

  var _x;

  var _y;

  that.dispose = function () {
    clearTimeout(_offTimer);
    that.turnOn = that.turnOff = that.cancel = that.dispose = that = fire = _activeData = _data = _offTimer = null;
  };

  that.turnOn = function (data, coords) {
    if (data === _data && _disabled) {
      return;
    }

    _disabled = false;
    _data = data;

    if (_activeData) {
      _x = coords.x;
      _y = coords.y;

      if (_data === _activeData) {
        fire(EVENT_FOCUS_MOVE, {
          data: _data,
          x: _x,
          y: _y
        });
        onCheck(true);
      } else {
        fire(EVENT_FOCUS_ON, {
          data: _data,
          x: _x,
          y: _y,
          done: onCheck
        });
      }
    } else {
      _x = coords.x;
      _y = coords.y;
      fire(EVENT_FOCUS_ON, {
        data: _data,
        x: _x,
        y: _y,
        done: onCheck
      });
    }

    function onCheck(result) {
      _disabled = !result;

      if (result) {
        _activeData = _data;
        clearTimeout(_offTimer);
        _offTimer = null;
      }
    }
  };

  that.turnOff = function () {
    _data = null;

    if (_activeData && !_disabled) {
      _offTimer = _offTimer || setTimeout(function () {
        _offTimer = null;
        fire(EVENT_FOCUS_OFF, {
          data: _activeData
        });
        _activeData = null;
      }, FOCUS_OFF_DELAY);
    }
  };

  that.cancel = function () {
    clearTimeout(_offTimer);

    if (_activeData) {
      fire(EVENT_FOCUS_OFF, {
        data: _activeData
      });
    }

    _activeData = _data = _offTimer = null;
  };
};

(0, _event_emitter.makeEventEmitter)(Tracker);

function getDistance(x1, y1, x2, y2) {
  return _sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function isTouchEvent(event) {
  var type = event.originalEvent.type;
  var pointerType = event.originalEvent.pointerType;
  return /^touch/.test(type) || /^MSPointer/.test(type) && pointerType !== 4 || /^pointer/.test(type) && pointerType !== 'mouse';
}

function selectItem(flags, items) {
  var i = 0;
  var ii = flags.length;
  var item;

  for (; i < ii; ++i) {
    if (flags[i]) {
      item = items[i];
      break;
    }
  }

  return _addNamespace(item || items[i], _NAME);
}

function setupEvents() {
  var flags = [navigator.pointerEnabled, navigator.msPointerEnabled, (0, _window.hasProperty)('ontouchstart')];
  EVENTS = {
    start: selectItem(flags, ['pointerdown', 'MSPointerDown', 'touchstart mousedown', 'mousedown']),
    move: selectItem(flags, ['pointermove', 'MSPointerMove', 'touchmove mousemove', 'mousemove']),
    end: selectItem(flags, ['pointerup', 'MSPointerUp', 'touchend mouseup', 'mouseup']),
    wheel: _addNamespace(_wheel.name, _NAME)
  };
}

function getEventCoords(event) {
  var originalEvent = event.originalEvent;
  var touch = originalEvent.touches && originalEvent.touches[0] || {};
  return {
    x: touch.pageX || originalEvent.pageX || event.pageX,
    y: touch.pageY || originalEvent.pageY || event.pageY
  };
}

function getPointerId(event) {
  return event.originalEvent.pointerId;
}

function getMultitouchEventCoords(event, pointerId) {
  var originalEvent = event.originalEvent;

  if (originalEvent.pointerId !== undefined) {
    originalEvent = originalEvent.pointerId === pointerId ? originalEvent : null;
  } else {
    originalEvent = originalEvent.touches[pointerId];
  }

  return originalEvent ? {
    x: originalEvent.pageX || event.pageX,
    y: originalEvent.pageY || event.pageY
  } : null;
}

function adjustWheelDelta(delta, lock) {
  if (delta === 0) {
    return 0;
  }

  var _delta = _abs(delta);

  var sign = _round(delta / _delta);

  if (lock.dir && sign !== lock.dir) {
    return 0;
  }

  lock.dir = sign;

  if (_delta < 0.1) {
    _delta = 0;
  } else if (_delta < 1) {
    _delta = 1;
  } else if (_delta > 4) {
    _delta = 4;
  } else {
    _delta = _round(_delta);
  }

  return sign * _delta;
}