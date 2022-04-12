import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import registerEvent from './event_registrator';
import { addNamespace, fireEvent } from '../utils/index';
var EVENT_NAME = 'dxmousewheel';
var EVENT_NAMESPACE = 'dxWheel';
var NATIVE_EVENT_NAME = 'wheel';
var PIXEL_MODE = 0;
var DELTA_MUTLIPLIER = 30;
var wheel = {
  setup: function setup(element) {
    var $element = $(element);
    eventsEngine.on($element, addNamespace(NATIVE_EVENT_NAME, EVENT_NAMESPACE), wheel._wheelHandler.bind(wheel));
  },
  teardown: function teardown(element) {
    eventsEngine.off(element, ".".concat(EVENT_NAMESPACE));
  },
  _wheelHandler: function _wheelHandler(e) {
    var {
      deltaMode,
      deltaY,
      deltaX,
      deltaZ
    } = e.originalEvent;
    fireEvent({
      type: EVENT_NAME,
      originalEvent: e,
      delta: this._normalizeDelta(deltaY, deltaMode),
      deltaX,
      deltaY,
      deltaZ,
      deltaMode,
      pointerType: 'mouse'
    });
    e.stopPropagation();
  },

  _normalizeDelta(delta) {
    var deltaMode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : PIXEL_MODE;

    if (deltaMode === PIXEL_MODE) {
      return -delta;
    } else {
      // Use multiplier to get rough delta value in px for the LINE or PAGE mode
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1392460
      return -DELTA_MUTLIPLIER * delta;
    }
  }

};
registerEvent(EVENT_NAME, wheel);
export { EVENT_NAME as name };