import $ from '../core/renderer';
import eventsEngine from '../events/core/events_engine';
import { noop, ensureDefined } from '../core/utils/common';
import { getWindow, hasWindow } from '../core/utils/window';
import registerComponent from '../core/component_registrator';
import { extend } from '../core/utils/extend';
import { isDefined } from '../core/utils/type';
import { addNamespace, eventData } from '../events/utils/index';
import pointerEvents from '../events/pointer';
import scrollEvents from '../events/gesture/emitter.gesture.scroll';
import { getVerticalOffsets, getElementBoxParams, parseHeight, getOuterHeight } from '../core/utils/size';
import { allowScroll, prepareScrollData } from './text_box/utils.scroll';
import TextBox from './text_box'; // STYLE textArea

var TEXTAREA_CLASS = 'dx-textarea';
var TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
var TEXTEDITOR_INPUT_CLASS_AUTO_RESIZE = 'dx-texteditor-input-auto-resize';
var TextArea = TextBox.inherit({
  _getDefaultOptions: function _getDefaultOptions() {
    return extend(this.callBase(), {
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
    var $input = $('<textarea>');

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

    var initScrollData = prepareScrollData($input, true);
    eventsEngine.on($input, addNamespace(scrollEvents.init, this.NAME), initScrollData, noop);
    eventsEngine.on($input, addNamespace(pointerEvents.down, this.NAME), this._pointerDownHandler.bind(this));
    eventsEngine.on($input, addNamespace(pointerEvents.move, this.NAME), this._pointerMoveHandler.bind(this));
  },
  _pointerDownHandler: function _pointerDownHandler(e) {
    this._eventY = eventData(e).y;
  },
  _pointerMoveHandler: function _pointerMoveHandler(e) {
    var currentEventY = eventData(e).y;
    var delta = this._eventY - currentEventY;

    if (allowScroll(this._input(), delta)) {
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
      eventsEngine.on(this._input(), addNamespace('input paste', this.NAME), this._updateInputHeight.bind(this));
    }

    this.callBase();
  },
  _refreshEvents: function _refreshEvents() {
    eventsEngine.off(this._input(), addNamespace('input paste', this.NAME));
    this.callBase();
  },

  _getHeightDifference($input) {
    return getVerticalOffsets(this._$element.get(0), false) + getVerticalOffsets(this._$textEditorContainer.get(0), false) + getVerticalOffsets(this._$textEditorInputContainer.get(0), false) + getElementBoxParams('height', getWindow().getComputedStyle($input.get(0))).margin;
  },

  _updateInputHeight: function _updateInputHeight() {
    if (!hasWindow()) {
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

    this._$element.css('height', getOuterHeight(this._$element));

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

    if (isDefined(boundaryValue)) {
      return typeof boundaryValue === 'number' ? boundaryValue : parseHeight(boundaryValue, this.$element().get(0).parentElement);
    }
  },
  _renderInputType: noop,
  _visibilityChanged: function _visibilityChanged(visible) {
    if (visible) {
      this._updateInputHeight();
    }
  },
  _updateInputAutoResizeAppearance: function _updateInputAutoResizeAppearance($input, isAutoResizeEnabled) {
    if ($input) {
      var autoResizeEnabled = ensureDefined(isAutoResizeEnabled, this.option('autoResizeEnabled'));
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
registerComponent('dxTextArea', TextArea);
export default TextArea;