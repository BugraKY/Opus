"use strict";

exports.visibility = exports.resize = exports.keyboard = exports.hover = exports.focus = exports.dxClick = exports.click = exports.active = void 0;

var _events_engine = _interopRequireDefault(require("./core/events_engine"));

var _keyboard_processor = _interopRequireDefault(require("./core/keyboard_processor"));

var _index = require("./utils/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addNamespace(event, namespace) {
  return namespace ? (0, _index.addNamespace)(event, namespace) : event;
}

function executeAction(action, args) {
  return typeof action === 'function' ? action(args) : action.execute(args);
}

var active = {
  on: function on($el, active, inactive, opts) {
    var selector = opts.selector,
        showTimeout = opts.showTimeout,
        hideTimeout = opts.hideTimeout,
        namespace = opts.namespace;

    _events_engine.default.on($el, addNamespace('dxactive', namespace), selector, {
      timeout: showTimeout
    }, function (event) {
      return executeAction(active, {
        event: event,
        element: event.currentTarget
      });
    });

    _events_engine.default.on($el, addNamespace('dxinactive', namespace), selector, {
      timeout: hideTimeout
    }, function (event) {
      return executeAction(inactive, {
        event: event,
        element: event.currentTarget
      });
    });
  },
  off: function off($el, _ref) {
    var namespace = _ref.namespace,
        selector = _ref.selector;

    _events_engine.default.off($el, addNamespace('dxactive', namespace), selector);

    _events_engine.default.off($el, addNamespace('dxinactive', namespace), selector);
  }
};
exports.active = active;
var resize = {
  on: function on($el, resize) {
    var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        namespace = _ref2.namespace;

    _events_engine.default.on($el, addNamespace('dxresize', namespace), resize);
  },
  off: function off($el) {
    var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        namespace = _ref3.namespace;

    _events_engine.default.off($el, addNamespace('dxresize', namespace));
  }
};
exports.resize = resize;
var hover = {
  on: function on($el, start, end, _ref4) {
    var selector = _ref4.selector,
        namespace = _ref4.namespace;

    _events_engine.default.on($el, addNamespace('dxhoverend', namespace), selector, function (event) {
      return end(event);
    });

    _events_engine.default.on($el, addNamespace('dxhoverstart', namespace), selector, function (event) {
      return executeAction(start, {
        element: event.target,
        event: event
      });
    });
  },
  off: function off($el, _ref5) {
    var selector = _ref5.selector,
        namespace = _ref5.namespace;

    _events_engine.default.off($el, addNamespace('dxhoverstart', namespace), selector);

    _events_engine.default.off($el, addNamespace('dxhoverend', namespace), selector);
  }
};
exports.hover = hover;
var visibility = {
  on: function on($el, shown, hiding, _ref6) {
    var namespace = _ref6.namespace;

    _events_engine.default.on($el, addNamespace('dxhiding', namespace), hiding);

    _events_engine.default.on($el, addNamespace('dxshown', namespace), shown);
  },
  off: function off($el, _ref7) {
    var namespace = _ref7.namespace;

    _events_engine.default.off($el, addNamespace('dxhiding', namespace));

    _events_engine.default.off($el, addNamespace('dxshown', namespace));
  }
};
exports.visibility = visibility;
var focus = {
  on: function on($el, focusIn, focusOut, _ref8) {
    var namespace = _ref8.namespace;

    _events_engine.default.on($el, addNamespace('focusin', namespace), focusIn);

    _events_engine.default.on($el, addNamespace('focusout', namespace), focusOut);
  },
  off: function off($el, _ref9) {
    var namespace = _ref9.namespace;

    _events_engine.default.off($el, addNamespace('focusin', namespace));

    _events_engine.default.off($el, addNamespace('focusout', namespace));
  },
  trigger: function trigger($el) {
    return _events_engine.default.trigger($el, 'focus');
  }
};
exports.focus = focus;
var dxClick = {
  on: function on($el, click) {
    var _ref10 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        namespace = _ref10.namespace;

    _events_engine.default.on($el, addNamespace('dxclick', namespace), click);
  },
  off: function off($el) {
    var _ref11 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        namespace = _ref11.namespace;

    _events_engine.default.off($el, addNamespace('dxclick', namespace));
  }
};
exports.dxClick = dxClick;
var click = {
  on: function on($el, click) {
    var _ref12 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        namespace = _ref12.namespace;

    _events_engine.default.on($el, addNamespace('click', namespace), click);
  },
  off: function off($el) {
    var _ref13 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        namespace = _ref13.namespace;

    _events_engine.default.off($el, addNamespace('click', namespace));
  }
};
exports.click = click;
var index = 0;
var keyboardProcessors = {};

var generateListenerId = function generateListenerId() {
  return "keyboardProcessorId".concat(index++);
};

var keyboard = {
  on: function on(element, focusTarget, handler) {
    var listenerId = generateListenerId();
    keyboardProcessors[listenerId] = new _keyboard_processor.default({
      element: element,
      focusTarget: focusTarget,
      handler: handler
    });
    return listenerId;
  },
  off: function off(listenerId) {
    if (listenerId && keyboardProcessors[listenerId]) {
      keyboardProcessors[listenerId].dispose();
      delete keyboardProcessors[listenerId];
    }
  },
  // NOTE: For tests
  _getProcessor: function _getProcessor(listenerId) {
    return keyboardProcessors[listenerId];
  }
};
exports.keyboard = keyboard;