import $ from '../../core/renderer';
import mappedAddNamespace from './add_namespace';
import eventsEngine from '../core/events_engine';
import { each } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import { focused } from '../../ui/widget/selectors';
var KEY_MAP = {
  'backspace': 'backspace',
  'tab': 'tab',
  'enter': 'enter',
  'escape': 'escape',
  'pageup': 'pageUp',
  'pagedown': 'pageDown',
  'end': 'end',
  'home': 'home',
  'arrowleft': 'leftArrow',
  'arrowup': 'upArrow',
  'arrowright': 'rightArrow',
  'arrowdown': 'downArrow',
  'delete': 'del',
  ' ': 'space',
  'f': 'F',
  'a': 'A',
  '*': 'asterisk',
  '-': 'minus',
  'alt': 'alt',
  'control': 'control',
  'shift': 'shift'
};
var LEGACY_KEY_CODES = {
  // iOS 10.2 and lower didn't supports KeyboardEvent.key
  '8': 'backspace',
  '9': 'tab',
  '13': 'enter',
  '27': 'escape',
  '33': 'pageUp',
  '34': 'pageDown',
  '35': 'end',
  '36': 'home',
  '37': 'leftArrow',
  '38': 'upArrow',
  '39': 'rightArrow',
  '40': 'downArrow',
  '46': 'del',
  '32': 'space',
  '70': 'F',
  '65': 'A',
  '106': 'asterisk',
  '109': 'minus',
  '189': 'minus',
  '173': 'minus',
  '16': 'shift',
  '17': 'control',
  '18': 'alt'
};
var EVENT_SOURCES_REGEX = {
  dx: /^dx/i,
  mouse: /(mouse|wheel)/i,
  touch: /^touch/i,
  keyboard: /^key/i,
  pointer: /^(ms)?pointer/i
};

var fixMethod = e => e;

var copyEvent = originalEvent => fixMethod(eventsEngine.Event(originalEvent, originalEvent), originalEvent);

var isDxEvent = e => eventSource(e) === 'dx';

var isNativeMouseEvent = e => eventSource(e) === 'mouse';

var isNativeTouchEvent = e => eventSource(e) === 'touch';

export var eventSource = _ref => {
  var {
    type
  } = _ref;
  var result = 'other';
  each(EVENT_SOURCES_REGEX, function (key) {
    if (this.test(type)) {
      result = key;
      return false;
    }
  });
  return result;
};
export var isPointerEvent = e => eventSource(e) === 'pointer';
export var isMouseEvent = e => isNativeMouseEvent(e) || (isPointerEvent(e) || isDxEvent(e)) && e.pointerType === 'mouse';
export var isDxMouseWheelEvent = e => e && e.type === 'dxmousewheel';
export var isTouchEvent = e => isNativeTouchEvent(e) || (isPointerEvent(e) || isDxEvent(e)) && e.pointerType === 'touch';
export var isKeyboardEvent = e => eventSource(e) === 'keyboard';
export var isFakeClickEvent = _ref2 => {
  var {
    screenX,
    offsetX,
    pageX
  } = _ref2;
  return screenX === 0 && !offsetX && pageX === 0;
};
export var eventData = _ref3 => {
  var {
    pageX,
    pageY,
    timeStamp
  } = _ref3;
  return {
    x: pageX,
    y: pageY,
    time: timeStamp
  };
};
export var eventDelta = (from, to) => ({
  x: to.x - from.x,
  y: to.y - from.y,
  time: to.time - from.time || 1
});
export var hasTouches = e => {
  var {
    originalEvent,
    pointers
  } = e;

  if (isNativeTouchEvent(e)) {
    return (originalEvent.touches || []).length;
  }

  if (isDxEvent(e)) {
    return (pointers || []).length;
  }

  return 0;
}; // TODO: for tests

var skipEvents = false;
export var forceSkipEvents = () => skipEvents = true;
export var stopEventsSkipping = () => skipEvents = false;
export var needSkipEvent = e => {
  // TODO: for tests
  if (skipEvents) {
    return true;
  } // TODO: this checking used in swipeable first move handler. is it correct?


  var {
    target
  } = e;
  var $target = $(target);
  var isDropDown = $target.is('.dx-dropdownlist-popup-wrapper *, .dx-dropdownlist-popup-wrapper');
  var isContentEditable = (target === null || target === void 0 ? void 0 : target.isContentEditable) || (target === null || target === void 0 ? void 0 : target.hasAttribute('contenteditable'));
  var touchInEditable = $target.is('input, textarea, select') || isContentEditable;

  if ($target.is('.dx-skip-gesture-event *, .dx-skip-gesture-event') && !isDropDown) {
    return true;
  }

  if (isDxMouseWheelEvent(e)) {
    var isTextArea = $target.is('textarea') && $target.hasClass('dx-texteditor-input');

    if (isTextArea || isContentEditable) {
      return false;
    }

    var isInputFocused = $target.is('input[type=\'number\'], textarea, select') && $target.is(':focus');
    return isInputFocused;
  }

  if (isMouseEvent(e)) {
    return touchInEditable || e.which > 1; // only left mouse button
  }

  if (isTouchEvent(e)) {
    return touchInEditable && focused($target);
  }
};
export var setEventFixMethod = func => fixMethod = func;
export var createEvent = (originalEvent, args) => {
  var event = copyEvent(originalEvent);
  args && extend(event, args);
  return event;
};
export var fireEvent = props => {
  var {
    originalEvent,
    delegateTarget
  } = props;
  var event = createEvent(originalEvent, props);
  eventsEngine.trigger(delegateTarget || event.target, event);
  return event;
};
export var normalizeKeyName = _ref4 => {
  var {
    key,
    which
  } = _ref4;
  var originalKey = key;
  var isKeySupported = !!key;

  if (key || which) {
    if (isKeySupported) {
      key = KEY_MAP[key.toLowerCase()];
    }

    if (!isKeySupported || !key && which) {
      key = LEGACY_KEY_CODES[which] || String.fromCharCode(which);
    }

    return key || originalKey;
  }
};
export var getChar = _ref5 => {
  var {
    key,
    which
  } = _ref5;
  return key || String.fromCharCode(which);
};
export var addNamespace = mappedAddNamespace;
export var isCommandKeyPressed = _ref6 => {
  var {
    ctrlKey,
    metaKey
  } = _ref6;
  return ctrlKey || metaKey;
};