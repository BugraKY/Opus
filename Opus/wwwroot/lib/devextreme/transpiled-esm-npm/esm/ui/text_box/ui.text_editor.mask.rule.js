import Class from '../../core/class';
import { extend } from '../../core/utils/extend';
import { inArray } from '../../core/utils/array';
import { isFunction } from '../../core/utils/type';
import { noop } from '../../core/utils/common';
var EMPTY_CHAR = ' ';
var BaseMaskRule = Class.inherit({
  ctor: function ctor(config) {
    this._value = EMPTY_CHAR;
    extend(this, config);
  },
  next: function next(rule) {
    if (!arguments.length) {
      return this._next;
    }

    this._next = rule;
  },
  text: noop,
  value: noop,
  rawValue: noop,
  handle: noop,
  _prepareHandlingArgs: function _prepareHandlingArgs(args, config) {
    var _config$str, _config$start, _config$length;

    config = config || {};
    var handlingProperty = Object.prototype.hasOwnProperty.call(args, 'value') ? 'value' : 'text';
    args[handlingProperty] = (_config$str = config.str) !== null && _config$str !== void 0 ? _config$str : args[handlingProperty];
    args.start = (_config$start = config.start) !== null && _config$start !== void 0 ? _config$start : args.start;
    args.length = (_config$length = config.length) !== null && _config$length !== void 0 ? _config$length : args.length;
    args.index = args.index + 1;
    return args;
  },
  reset: noop,
  clear: noop,
  first: function first(index) {
    index = index || 0;
    return this.next().first(index + 1);
  },
  isAccepted: function isAccepted() {
    return false;
  },
  adjustedCaret: function adjustedCaret(caret, isForwardDirection, char) {
    return isForwardDirection ? this._adjustedForward(caret, 0, char) : this._adjustedBackward(caret, 0, char);
  },
  _adjustedForward: noop,
  _adjustedBackward: noop,
  isValid: noop
});
export var EmptyMaskRule = BaseMaskRule.inherit({
  next: noop,
  handle: function handle() {
    return 0;
  },
  text: function text() {
    return '';
  },
  value: function value() {
    return '';
  },
  first: function first() {
    return 0;
  },
  rawValue: function rawValue() {
    return '';
  },
  adjustedCaret: function adjustedCaret() {
    return 0;
  },
  isValid: function isValid() {
    return true;
  }
});
export var MaskRule = BaseMaskRule.inherit({
  text: function text() {
    return (this._value !== EMPTY_CHAR ? this._value : this.maskChar) + this.next().text();
  },
  value: function value() {
    return this._value + this.next().value();
  },
  rawValue: function rawValue() {
    return this._value + this.next().rawValue();
  },
  handle: function handle(args) {
    var str = Object.prototype.hasOwnProperty.call(args, 'value') ? args.value : args.text;

    if (!str || !str.length || !args.length) {
      return 0;
    }

    if (args.start) {
      return this.next().handle(this._prepareHandlingArgs(args, {
        start: args.start - 1
      }));
    }

    var char = str[0];
    var rest = str.substring(1);

    this._tryAcceptChar(char, args);

    return this._accepted() ? this.next().handle(this._prepareHandlingArgs(args, {
      str: rest,
      length: args.length - 1
    })) + 1 : this.handle(this._prepareHandlingArgs(args, {
      str: rest,
      length: args.length - 1
    }));
  },
  clear: function clear(args) {
    this._tryAcceptChar(EMPTY_CHAR, args);

    this.next().clear(this._prepareHandlingArgs(args));
  },
  reset: function reset() {
    this._accepted(false);

    this.next().reset();
  },
  _tryAcceptChar: function _tryAcceptChar(char, args) {
    this._accepted(false);

    if (!this._isAllowed(char, args)) {
      return;
    }

    var acceptedChar = char === EMPTY_CHAR ? this.maskChar : char;
    args.fullText = args.fullText.substring(0, args.index) + acceptedChar + args.fullText.substring(args.index + 1);

    this._accepted(true);

    this._value = char;
  },
  _accepted: function _accepted(value) {
    if (!arguments.length) {
      return !!this._isAccepted;
    }

    this._isAccepted = !!value;
  },
  first: function first(index) {
    return this._value === EMPTY_CHAR ? index || 0 : this.callBase(index);
  },
  _isAllowed: function _isAllowed(char, args) {
    if (char === EMPTY_CHAR) {
      return true;
    }

    return this._isValid(char, args);
  },
  _isValid: function _isValid(char, args) {
    var allowedChars = this.allowedChars;

    if (allowedChars instanceof RegExp) {
      return allowedChars.test(char);
    }

    if (isFunction(allowedChars)) {
      return allowedChars(char, args.index, args.fullText);
    }

    if (Array.isArray(allowedChars)) {
      return inArray(char, allowedChars) > -1;
    }

    return allowedChars === char;
  },
  isAccepted: function isAccepted(caret) {
    return caret === 0 ? this._accepted() : this.next().isAccepted(caret - 1);
  },
  _adjustedForward: function _adjustedForward(caret, index, char) {
    if (index >= caret) {
      return index;
    }

    return this.next()._adjustedForward(caret, index + 1, char) || index + 1;
  },
  _adjustedBackward: function _adjustedBackward(caret, index) {
    if (index >= caret - 1) {
      return caret;
    }

    return this.next()._adjustedBackward(caret, index + 1) || index + 1;
  },
  isValid: function isValid(args) {
    return this._isValid(this._value, args) && this.next().isValid(this._prepareHandlingArgs(args));
  }
});
export var StubMaskRule = MaskRule.inherit({
  value: function value() {
    return this.next().value();
  },
  handle: function handle(args) {
    var hasValueProperty = Object.prototype.hasOwnProperty.call(args, 'value');
    var str = hasValueProperty ? args.value : args.text;

    if (!str.length || !args.length) {
      return 0;
    }

    if (args.start || hasValueProperty) {
      return this.next().handle(this._prepareHandlingArgs(args, {
        start: args.start && args.start - 1
      }));
    }

    var char = str[0];
    var rest = str.substring(1);

    this._tryAcceptChar(char);

    var nextArgs = this._isAllowed(char) ? this._prepareHandlingArgs(args, {
      str: rest,
      length: args.length - 1
    }) : args;
    return this.next().handle(nextArgs) + 1;
  },
  clear: function clear(args) {
    this._accepted(false);

    this.next().clear(this._prepareHandlingArgs(args));
  },
  _tryAcceptChar: function _tryAcceptChar(char) {
    this._accepted(this._isValid(char));
  },
  _isValid: function _isValid(char) {
    return char === this.maskChar;
  },
  first: function first(index) {
    index = index || 0;
    return this.next().first(index + 1);
  },
  _adjustedForward: function _adjustedForward(caret, index, char) {
    if (index >= caret && char === this.maskChar) {
      return index;
    }

    if (caret === index + 1 && this._accepted()) {
      return caret;
    }

    return this.next()._adjustedForward(caret, index + 1, char);
  },
  _adjustedBackward: function _adjustedBackward(caret, index) {
    if (index >= caret - 1) {
      return 0;
    }

    return this.next()._adjustedBackward(caret, index + 1);
  },
  isValid: function isValid(args) {
    return this.next().isValid(this._prepareHandlingArgs(args));
  }
});