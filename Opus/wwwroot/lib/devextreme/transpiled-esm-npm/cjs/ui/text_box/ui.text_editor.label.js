"use strict";

exports.TextEditorLabel = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _guid = _interopRequireDefault(require("../../core/guid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TEXTEDITOR_LABEL_CLASS = 'dx-texteditor-label';
var TEXTEDITOR_WITH_LABEL_CLASS = 'dx-texteditor-with-label';
var TEXTEDITOR_WITH_FLOATING_LABEL_CLASS = 'dx-texteditor-with-floating-label';
var TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS = 'dx-texteditor-with-before-buttons';
var LABEL_BEFORE_CLASS = 'dx-label-before';
var LABEL_CLASS = 'dx-label';
var LABEL_AFTER_CLASS = 'dx-label-after';

var TextEditorLabel = /*#__PURE__*/function () {
  function TextEditorLabel(_ref) {
    var $editor = _ref.$editor,
        text = _ref.text,
        mode = _ref.mode,
        mark = _ref.mark,
        containsButtonsBefore = _ref.containsButtonsBefore,
        containerWidth = _ref.containerWidth,
        beforeWidth = _ref.beforeWidth;
    this._props = {
      $editor: $editor,
      text: text,
      mode: mode,
      mark: mark,
      containsButtonsBefore: containsButtonsBefore,
      containerWidth: containerWidth,
      beforeWidth: beforeWidth
    };
    this._id = "".concat(TEXTEDITOR_LABEL_CLASS, "-").concat(new _guid.default());

    this._render();

    this._toggleMarkupVisibility();
  }

  var _proto = TextEditorLabel.prototype;

  _proto._isVisible = function _isVisible() {
    return !!this._props.text && this._props.mode !== 'hidden';
  };

  _proto._render = function _render() {
    this._$before = (0, _renderer.default)('<div>').addClass(LABEL_BEFORE_CLASS);
    this._$labelSpan = (0, _renderer.default)('<span>');
    this._$label = (0, _renderer.default)('<div>').addClass(LABEL_CLASS).append(this._$labelSpan);
    this._$after = (0, _renderer.default)('<div>').addClass(LABEL_AFTER_CLASS);
    this._$root = (0, _renderer.default)('<div>').addClass(TEXTEDITOR_LABEL_CLASS).attr('id', this._id).append(this._$before).append(this._$label).append(this._$after);

    this._updateMark();

    this._updateText();

    this._updateBeforeWidth();

    this._updateMaxWidth();
  };

  _proto._toggleMarkupVisibility = function _toggleMarkupVisibility() {
    var visible = this._isVisible();

    this._updateEditorBeforeButtonsClass(visible);

    this._updateEditorLabelClass(visible);

    visible ? this._$root.appendTo(this._props.$editor) : this._$root.detach();
  };

  _proto._updateEditorLabelClass = function _updateEditorLabelClass(visible) {
    this._props.$editor.removeClass(TEXTEDITOR_WITH_FLOATING_LABEL_CLASS).removeClass(TEXTEDITOR_WITH_LABEL_CLASS);

    if (visible) {
      var labelClass = this._props.mode === 'floating' ? TEXTEDITOR_WITH_FLOATING_LABEL_CLASS : TEXTEDITOR_WITH_LABEL_CLASS;

      this._props.$editor.addClass(labelClass);
    }
  };

  _proto._updateEditorBeforeButtonsClass = function _updateEditorBeforeButtonsClass() {
    var visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._isVisible();

    this._props.$editor.removeClass(TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS);

    if (visible) {
      var beforeButtonsClass = this._props.containsButtonsBefore ? TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS : '';

      this._props.$editor.addClass(beforeButtonsClass);
    }
  };

  _proto._updateMark = function _updateMark() {
    this._$labelSpan.attr('data-mark', this._props.mark);
  };

  _proto._updateText = function _updateText() {
    this._$labelSpan.text(this._props.text);
  };

  _proto._updateBeforeWidth = function _updateBeforeWidth() {
    this._$before.css({
      width: this._props.beforeWidth
    });
  };

  _proto._updateMaxWidth = function _updateMaxWidth() {
    this._$label.css({
      maxWidth: this._props.containerWidth
    });
  };

  _proto.$element = function $element() {
    return this._$root;
  };

  _proto.isVisible = function isVisible() {
    return this._isVisible();
  };

  _proto.getId = function getId() {
    if (this._isVisible()) return this._id;
  };

  _proto.updateMode = function updateMode(mode) {
    this._props.mode = mode;

    this._toggleMarkupVisibility();
  };

  _proto.updateText = function updateText(text) {
    this._props.text = text;

    this._updateText();

    this._toggleMarkupVisibility();
  };

  _proto.updateMark = function updateMark(mark) {
    this._props.mark = mark;

    this._updateMark();
  };

  _proto.updateContainsButtonsBefore = function updateContainsButtonsBefore(containsButtonsBefore) {
    this._props.containsButtonsBefore = containsButtonsBefore;

    this._updateEditorBeforeButtonsClass();
  };

  _proto.updateBeforeWidth = function updateBeforeWidth(beforeWidth) {
    this._props.beforeWidth = beforeWidth;

    this._updateBeforeWidth();
  };

  _proto.updateMaxWidth = function updateMaxWidth(containerWidth) {
    this._props.containerWidth = containerWidth;

    this._updateMaxWidth();
  };

  return TextEditorLabel;
}();

exports.TextEditorLabel = TextEditorLabel;