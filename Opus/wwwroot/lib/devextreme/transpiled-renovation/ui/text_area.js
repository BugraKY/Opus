"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../core/renderer"));

var _events_engine = _interopRequireDefault(require("../events/core/events_engine"));

var _common = require("../core/utils/common");

var _window = require("../core/utils/window");

var _component_registrator = _interopRequireDefault(require("../core/component_registrator"));

var _extend = require("../core/utils/extend");

var _type = require("../core/utils/type");

var _index = require("../events/utils/index");

var _pointer = _interopRequireDefault(require("../events/pointer"));

var _emitterGesture = _interopRequireDefault(require("../events/gesture/emitter.gesture.scroll"));

var _size = require("../core/utils/size");

var _utils = require("./text_box/utils.scroll");

var _text_box = _interopRequireDefault(require("./text_box"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// STYLE textArea
var TEXTAREA_CLASS = 'dx-textarea';
var TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
var TEXTEDITOR_INPUT_CLASS_AUTO_RESIZE = 'dx-texteditor-input-auto-resize';

var TextArea = _text_box.default.inherit({
  _getDefaultOptions: function _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      /**
      * @name dxTextAreaOptions.mode
      * @hidden
      */

      /**
      * @name dxTextAreaOptions.showClearButton
      * @hidden
      */
      spellcheck: true,
      minHeight: undefined,
      maxHeight: undefined,
      autoResizeEnabled: false
      /**
      * @name dxTextAreaOptions.mask
      * @hidden
      */

      /**
      * @name dxTextAreaOptions.maskChar
      * @hidden
      */

      /**
      * @name dxTextAreaOptions.maskRules
      * @hidden
      */

      /**
      * @name dxTextAreaOptions.maskInvalidMessage
      * @hidden
      */

      /**
      * @name dxTextAreaOptions.useMaskedValue
      * @hidden
      */

      /**
       * @name dxTextAreaOptions.showMaskMode
       * @hidden
       */

      /**
      * @name dxTextAreaOptions.buttons
      * @hidden
      */

    });
  },
  _initMarkup: function _initMarkup() {
    this.$element().addClass(TEXTAREA_CLASS);
    this.callBase();
    this.setAria('multiline', 'true');
  },
  _renderContentImpl: function _renderContentImpl() {
    this._updateInputHeight();

    this.callBase();
  },
  _renderInput: function _renderInput() {
    this.callBase();

    this._renderScrollHandler();
  },
  _createInput: function _createInput() {
    var $input = (0, _renderer.default)('<textarea>');

    this._applyInputAttributes($input, this.option('inputAttr'));

    this._updateInputAutoResizeAppearance($input);

    return $input;
  },
  _applyInputAttributes: function _applyInputAttributes($input, customAttributes) {
    $input.attr(customAttributes).addClass(TEXTEDITOR_INPUT_CLASS);
  },
  _renderScrollHandler: function _renderScrollHandler() {
    this._eventY = 0;

    var $input = this._input();

    var initScrollData = (0, _utils.prepareScrollData)($input, true);

    _events_engine.default.on($input, (0, _index.addNamespace)(_emitterGesture.default.init, this.NAME), initScrollData, _common.noop);

    _events_engine.default.on($input, (0, _index.addNamespace)(_pointer.default.down, this.NAME), this._pointerDownHandler.bind(this));

    _events_engine.default.on($input, (0, _index.addNamespace)(_pointer.default.move, this.NAME), this._pointerMoveHandler.bind(this));
  },
  _pointerDownHandler: function _pointerDownHandler(e) {
    this._eventY = (0, _index.eventData)(e).y;
  },
  _pointerMoveHandler: function _pointerMoveHandler(e) {
    var currentEventY = (0, _index.eventData)(e).y;
    var delta = this._eventY - currentEventY;

    if ((0, _utils.allowScroll)(this._input(), delta)) {
      e.isScrollingEvent = true;
      e.stopPropagation();
    }

    this._eventY = currentEventY;
  },
  _renderDimensions: function _renderDimensions() {
    var $element = this.$element();
    var element = $element.get(0);

    var width = this._getOptionValue('width', element);

    var height = this._getOptionValue('height', element);

    var minHeight = this.option('minHeight');
    var maxHeight = this.option('maxHeight');
    $element.css({
      minHeight: minHeight !== undefined ? minHeight : '',
      maxHeight: maxHeight !== undefined ? maxHeight : '',
      width: width,
      height: height
    });
  },
  _resetDimensions: function _resetDimensions() {
    this.$element().css({
      'height': '',
      'minHeight': '',
      'maxHeight': ''
    });
  },
  _renderEvents: function _renderEvents() {
    if (this.option('autoResizeEnabled')) {
      _events_engine.default.on(this._input(), (0, _index.addNamespace)('input paste', this.NAME), this._updateInputHeight.bind(this));
    }

    this.callBase();
  },
  _refreshEvents: function _refreshEvents() {
    _events_engine.default.off(this._input(), (0, _index.addNamespace)('input paste', this.NAME));

    this.callBase();
  },
  _getHeightDifference: function _getHeightDifference($input) {
    return (0, _size.getVerticalOffsets)(this._$element.get(0), false) + (0, _size.getVerticalOffsets)(this._$textEditorContainer.get(0), false) + (0, _size.getVerticalOffsets)(this._$textEditorInputContainer.get(0), false) + (0, _size.getElementBoxParams)('height', (0, _window.getWindow)().getComputedStyle($input.get(0))).margin;
  },
  _updateInputHeight: function _updateInputHeight() {
    if (!(0, _window.hasWindow)()) {
      return;
    }

    var $input = this._input();

    var height = this.option('height');
    var autoHeightResizing = height === undefined && this.option('autoResizeEnabled');
    var shouldCalculateInputHeight = autoHeightResizing || height === undefined && this.option('minHeight');

    if (!shouldCalculateInputHeight) {
      $input.css('height', '');
      return;
    }

    this._resetDimensions();

    this._$element.css('height', (0, _size.getOuterHeight)(this._$element));

    $input.css('height', 0);

    var heightDifference = this._getHeightDifference($input);

    this._renderDimensions();

    var minHeight = this._getBoundaryHeight('minHeight');

    var maxHeight = this._getBoundaryHeight('maxHeight');

    var inputHeight = $input[0].scrollHeight;

    if (minHeight !== undefined) {
      inputHeight = Math.max(inputHeight, minHeight - heightDifference);
    }

    if (maxHeight !== undefined) {
      var adjustedMaxHeight = maxHeight - heightDifference;
      var needScroll = inputHeight > adjustedMaxHeight;
      inputHeight = Math.min(inputHeight, adjustedMaxHeight);

      this._updateInputAutoResizeAppearance($input, !needScroll);
    }

    $input.css('height', inputHeight);

    if (autoHeightResizing) {
      this._$element.css('height', 'auto');
    }
  },
  _getBoundaryHeight: function _getBoundaryHeight(optionName) {
    var boundaryValue = this.option(optionName);

    if ((0, _type.isDefined)(boundaryValue)) {
      return typeof boundaryValue === 'number' ? boundaryValue : (0, _size.parseHeight)(boundaryValue, this.$element().get(0).parentElement);
    }
  },
  _renderInputType: _common.noop,
  _visibilityChanged: function _visibilityChanged(visible) {
    if (visible) {
      this._updateInputHeight();
    }
  },
  _updateInputAutoResizeAppearance: function _updateInputAutoResizeAppearance($input, isAutoResizeEnabled) {
    if ($input) {
      var autoResizeEnabled = (0, _common.ensureDefined)(isAutoResizeEnabled, this.option('autoResizeEnabled'));
      $input.toggleClass(TEXTEDITOR_INPUT_CLASS_AUTO_RESIZE, autoResizeEnabled);
    }
  },
  _dimensionChanged: function _dimensionChanged() {
    if (this.option('visible')) {
      this._updateInputHeight();
    }
  },
  _optionChanged: function _optionChanged(args) {
    switch (args.name) {
      case 'autoResizeEnabled':
        this._updateInputAutoResizeAppearance(this._input(), args.value);

        this._refreshEvents();

        this._updateInputHeight();

        break;

      case 'value':
      case 'height':
        this.callBase(args);

        this._updateInputHeight();

        break;

      case 'minHeight':
      case 'maxHeight':
        this._renderDimensions();

        this._updateInputHeight();

        break;

      case 'visible':
        this.callBase(args);
        args.value && this._updateInputHeight();
        break;

      default:
        this.callBase(args);
    }
  }
  /**
  * @name dxTextArea.getButton
  * @publicName getButton(name)
  * @hidden
  */

});

(0, _component_registrator.default)('dxTextArea', TextArea);
var _default = TextArea;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;