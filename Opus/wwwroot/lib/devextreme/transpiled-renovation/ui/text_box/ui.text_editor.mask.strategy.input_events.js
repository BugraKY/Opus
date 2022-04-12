"use strict";

exports.default = void 0;

var _uiText_editorMaskStrategy = _interopRequireDefault(require("./ui.text_editor.mask.strategy.base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DELETE_INPUT_TYPE = 'deleteContentBackward';

var InputEventsMaskStrategy = /*#__PURE__*/function (_BaseMaskStrategy) {
  _inheritsLoose(InputEventsMaskStrategy, _BaseMaskStrategy);

  function InputEventsMaskStrategy() {
    return _BaseMaskStrategy.apply(this, arguments) || this;
  }

  var _proto = InputEventsMaskStrategy.prototype;

  _proto._getStrategyName = function _getStrategyName() {
    return 'inputEvents';
  };

  _proto.getHandleEventNames = function getHandleEventNames() {
    return [].concat(_toConsumableArray(_BaseMaskStrategy.prototype.getHandleEventNames.call(this)), ['beforeInput']);
  };

  _proto._beforeInputHandler = function _beforeInputHandler() {
    this._prevCaret = this.editorCaret();
  };

  _proto._inputHandler = function _inputHandler(_ref) {
    var originalEvent = _ref.originalEvent;

    if (!originalEvent) {
      return;
    }

    var inputType = originalEvent.inputType,
        data = originalEvent.data;
    var currentCaret = this.editorCaret();

    if (inputType === DELETE_INPUT_TYPE) {
      var length = this._prevCaret.end - this._prevCaret.start || 1;
      this.editor.setBackwardDirection();

      this._updateEditorMask({
        start: currentCaret.start,
        length: length,
        text: this._getEmptyString(length)
      });
    } else {
      var _this$_prevCaret, _this$_prevCaret2, _this$_prevCaret3;

      if (!currentCaret.end) {
        return;
      }

      this._autoFillHandler(originalEvent);

      this.editorCaret(currentCaret);

      var _length = ((_this$_prevCaret = this._prevCaret) === null || _this$_prevCaret === void 0 ? void 0 : _this$_prevCaret.end) - ((_this$_prevCaret2 = this._prevCaret) === null || _this$_prevCaret2 === void 0 ? void 0 : _this$_prevCaret2.start);

      var newData = data + (_length ? this._getEmptyString(_length - data.length) : '');
      this.editor.setForwardDirection();

      var hasValidChars = this._updateEditorMask({
        start: (_this$_prevCaret3 = this._prevCaret) === null || _this$_prevCaret3 === void 0 ? void 0 : _this$_prevCaret3.start,
        length: _length || newData.length,
        text: newData
      });

      if (!hasValidChars) {
        this.editorCaret(this._prevCaret);
      }
    }
  };

  _proto._getEmptyString = function _getEmptyString(length) {
    return Array(length + 1).join(' ');
  };

  _proto._updateEditorMask = function _updateEditorMask(args) {
    var textLength = args.text.length;

    var updatedCharsCount = this.editor._handleChain(args);

    if (this.editor.isForwardDirection()) {
      var _this$editorCaret = this.editorCaret(),
          start = _this$editorCaret.start,
          end = _this$editorCaret.end;

      var correction = updatedCharsCount - textLength;

      if (start <= updatedCharsCount && updatedCharsCount > 1) {
        this.editorCaret({
          start: start + correction,
          end: end + correction
        });
      }

      this.editor.isForwardDirection() && this.editor._adjustCaret();
    }

    this.editor._displayMask();

    return !!updatedCharsCount;
  };

  return InputEventsMaskStrategy;
}(_uiText_editorMaskStrategy.default);

var _default = InputEventsMaskStrategy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;