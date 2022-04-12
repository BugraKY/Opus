import $ from '../core/renderer';
import eventsEngine from '../events/core/events_engine';
import devices from '../core/devices';
import domAdapter from '../core/dom_adapter';
import { resetActiveElement, contains, closestCommonParent } from '../core/utils/dom';
import { requestAnimationFrame, cancelAnimationFrame } from '../animation/frame';
import { addNamespace, fireEvent, eventDelta, eventData } from './utils/index';
import { subscribeNodesDisposing, unsubscribeNodesDisposing } from './utils/event_nodes_disposing';
import pointerEvents from './pointer';
import Emitter from './core/emitter';
import registerEmitter from './core/emitter_registrator';
import { compare as compareVersions } from '../core/utils/version';
var CLICK_EVENT_NAME = 'dxclick';
var TOUCH_BOUNDARY = 10;
var abs = Math.abs;

var isInput = function isInput(element) {
  return $(element).is('input, textarea, select, button ,:focus, :focus *');
};

var misc = {
  requestAnimationFrame: requestAnimationFrame,
  cancelAnimationFrame: cancelAnimationFrame
};
var ClickEmitter = Emitter.inherit({
  ctor: function ctor(element) {
    this.callBase(element);

    this._makeElementClickable($(element));
  },
  _makeElementClickable: function _makeElementClickable($element) {
    if (!$element.attr('onclick')) {
      $element.attr('onclick', 'void(0)');
    }
  },
  start: function start(e) {
    this._blurPrevented = e.isDefaultPrevented();
    this._startTarget = e.target;
    this._startEventData = eventData(e);
  },
  end: function end(e) {
    if (this._eventOutOfElement(e, this.getElement().get(0)) || e.type === pointerEvents.cancel) {
      this._cancel(e);

      return;
    }

    if (!isInput(e.target) && !this._blurPrevented) {
      resetActiveElement();
    }

    this._accept(e);

    this._clickAnimationFrame = misc.requestAnimationFrame(function () {
      this._fireClickEvent(e);
    }.bind(this));
  },
  _eventOutOfElement: function _eventOutOfElement(e, element) {
    var target = e.target;
    var targetChanged = !contains(element, target) && element !== target;
    var gestureDelta = eventDelta(eventData(e), this._startEventData);
    var boundsExceeded = abs(gestureDelta.x) > TOUCH_BOUNDARY || abs(gestureDelta.y) > TOUCH_BOUNDARY;
    return targetChanged || boundsExceeded;
  },
  _fireClickEvent: function _fireClickEvent(e) {
    this._fireEvent(CLICK_EVENT_NAME, e, {
      target: closestCommonParent(this._startTarget, e.target)
    });
  },
  dispose: function dispose() {
    misc.cancelAnimationFrame(this._clickAnimationFrame);
  }
}); // NOTE: native strategy for desktop, iOS 9.3+, Android 5+

var realDevice = devices.real();
var useNativeClick = realDevice.generic || realDevice.ios && compareVersions(realDevice.version, [9, 3]) >= 0 || realDevice.android && compareVersions(realDevice.version, [5]) >= 0;

(function () {
  var NATIVE_CLICK_CLASS = 'dx-native-click';

  var isNativeClickEvent = function isNativeClickEvent(target) {
    return useNativeClick || $(target).closest('.' + NATIVE_CLICK_CLASS).length;
  };

  var prevented = null;
  var lastFiredEvent = null;

  function onNodeRemove() {
    lastFiredEvent = null;
  }

  var clickHandler = function clickHandler(e) {
    var originalEvent = e.originalEvent;
    var eventAlreadyFired = lastFiredEvent === originalEvent || originalEvent && originalEvent.DXCLICK_FIRED;
    var leftButton = !e.which || e.which === 1;

    if (leftButton && !prevented && isNativeClickEvent(e.target) && !eventAlreadyFired) {
      if (originalEvent) {
        originalEvent.DXCLICK_FIRED = true;
      }

      unsubscribeNodesDisposing(lastFiredEvent, onNodeRemove);
      lastFiredEvent = originalEvent;
      subscribeNodesDisposing(lastFiredEvent, onNodeRemove);
      fireEvent({
        type: CLICK_EVENT_NAME,
        originalEvent: e
      });
    }
  };

  ClickEmitter = ClickEmitter.inherit({
    _makeElementClickable: function _makeElementClickable($element) {
      if (!isNativeClickEvent($element)) {
        this.callBase($element);
      }

      eventsEngine.on($element, 'click', clickHandler);
    },
    configure: function configure(data) {
      this.callBase(data);

      if (data.useNative) {
        this.getElement().addClass(NATIVE_CLICK_CLASS);
      }
    },
    start: function start(e) {
      prevented = null;

      if (!isNativeClickEvent(e.target)) {
        this.callBase(e);
      }
    },
    end: function end(e) {
      if (!isNativeClickEvent(e.target)) {
        this.callBase(e);
      }
    },
    cancel: function cancel() {
      prevented = true;
    },
    dispose: function dispose() {
      this.callBase();
      eventsEngine.off(this.getElement(), 'click', clickHandler);
    }
  });
})(); // NOTE: fixes native click blur on slow devices


(function () {
  var desktopDevice = devices.real().generic;

  if (!desktopDevice) {
    var startTarget = null;
    var blurPrevented = false;

    var pointerDownHandler = function pointerDownHandler(e) {
      startTarget = e.target;
      blurPrevented = e.isDefaultPrevented();
    };

    var clickHandler = function clickHandler(e) {
      var $target = $(e.target);

      if (!blurPrevented && startTarget && !$target.is(startTarget) && !$(startTarget).is('label') && isInput($target)) {
        resetActiveElement();
      }

      startTarget = null;
      blurPrevented = false;
    };

    var NATIVE_CLICK_FIXER_NAMESPACE = 'NATIVE_CLICK_FIXER';
    var document = domAdapter.getDocument();
    eventsEngine.subscribeGlobal(document, addNamespace(pointerEvents.down, NATIVE_CLICK_FIXER_NAMESPACE), pointerDownHandler);
    eventsEngine.subscribeGlobal(document, addNamespace('click', NATIVE_CLICK_FIXER_NAMESPACE), clickHandler);
  }
})();
/**
  * @name UI Events.dxclick
  * @type eventType
  * @type_function_param1 event:event
  * @module events/click
*/


registerEmitter({
  emitter: ClickEmitter,
  bubble: true,
  events: [CLICK_EVENT_NAME]
});
export { CLICK_EVENT_NAME as name };