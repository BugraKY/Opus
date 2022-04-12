import devices from '../../core/devices';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import BaseStrategy from './base';
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
  each(e.touches, function (_, touch) {
    pointers.push(extend({
      pointerId: touch.identifier
    }, touch));
  });
  return {
    pointers: pointers,
    pointerId: e.changedTouches[0].identifier
  };
};

var skipTouchWithSameIdentifier = function skipTouchWithSameIdentifier(pointerEvent) {
  return devices.real().platform === 'ios' && (pointerEvent === 'dxpointerdown' || pointerEvent === 'dxpointerup');
};

var TouchStrategy = BaseStrategy.inherit({
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
    return this.callBase(extend(normalizeTouchEvent(args.originalEvent), args));
  }
});
TouchStrategy.map = eventMap;
TouchStrategy.normalize = normalizeTouchEvent;
export default TouchStrategy;