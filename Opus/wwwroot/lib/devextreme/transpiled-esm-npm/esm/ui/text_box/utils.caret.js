import $ from '../../core/renderer';
import { isDefined } from '../../core/utils/type';
import devices from '../../core/devices';
import domAdapter from '../../core/dom_adapter';
var {
  ios,
  mac
} = devices.real();
var isFocusingOnCaretChange = ios || mac;

var getCaret = function getCaret(input) {
  var range;

  try {
    range = {
      start: input.selectionStart,
      end: input.selectionEnd
    };
  } catch (e) {
    range = {
      start: 0,
      end: 0
    };
  }

  return range;
};

var setCaret = function setCaret(input, position) {
  if (!domAdapter.getBody().contains(input)) {
    return;
  }

  try {
    input.selectionStart = position.start;
    input.selectionEnd = position.end;
  } catch (e) {}
};

var caret = function caret(input, position) {
  var force = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  input = $(input).get(0);

  if (!isDefined(position)) {
    return getCaret(input);
  } // NOTE: AppleWebKit-based browsers focuses element input after caret position has changed


  if (!force && isFocusingOnCaretChange && domAdapter.getActiveElement() !== input) {
    return;
  }

  setCaret(input, position);
};

export default caret;