"use strict";

exports.default = void 0;

var _devices = _interopRequireDefault(require("../../core/devices"));

var _extend = require("../../core/utils/extend");

var _iterator = require("../../core/utils/iterator");

var _base = _interopRequireDefault(require("./base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var eventMap = {
  'dxpointerdown': 'touchstart',
  'dxpointermove': 'touchmove',
  'dxpointerup': 'touchend',
  'dxpointercancel': 'touchcancel',
  'dxpointerover': '',
  'dxpointerout': '',
  'dxpointerenter': '',
  'dxpointerleave': ''
};

var normalizeTouchEvent = function normalizeTouchEvent(e) {
  var pointers = [];
  (0, _iterator.each)(e.touches, function (_, touch) {
    pointers.push((0, _extend.extend)({
      pointerId: touch.identifier
    }, touch));
  });
  return {
    pointers: pointers,
    pointerId: e.changedTouches[0].identifier
  };
};

var skipTouchWithSameIdentifier = function skipTouchWithSameIdentifier(pointerEvent) {
  return _devices.default.real().platform === 'ios' && (pointerEvent === 'dxpointerdown' || pointerEvent === 'dxpointerup');
};

var TouchStrategy = _base.default.inherit({
  ctor: function ctor() {
    this.callBase.apply(this, arguments);
    this._pointerId = 0;
  },
  _handler: function _handler(e) {
    if (skipTouchWithSameIdentifier(this._eventName)) {
      var touch = e.changedTouches[0];

      if (this._pointerId === touch.identifier && this._pointerId !== 0) {
        return;
      }

      this._pointerId = touch.identifier;
    }

    return this.callBase.apply(this, arguments);
  },
  _fireEvent: function _fireEvent(args) {
    return this.callBase((0, _extend.extend)(normalizeTouchEvent(args.originalEvent), args));
  }
});

TouchStrategy.map = eventMap;
TouchStrategy.normalize = normalizeTouchEvent;
var _default = TouchStrategy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;