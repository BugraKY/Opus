"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));

var _common = require("../../core/utils/common");

var _class = _interopRequireDefault(require("../../core/class"));

var _date = _interopRequireDefault(require("../../localization/date"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var abstract = _class.default.abstract;

var DateBoxStrategy = _class.default.inherit({
  ctor: function ctor(dateBox) {
    this.dateBox = dateBox;
  },
  widgetOption: function widgetOption() {
    return this._widget && this._widget.option.apply(this._widget, arguments);
  },
  _renderWidget: function _renderWidget(element) {
    element = element || (0, _renderer.default)('<div>');
    this._widget = this._createWidget(element);

    this._widget.$element().appendTo(this._getWidgetContainer());
  },
  _createWidget: function _createWidget(element) {
    var widgetName = this._getWidgetName();

    var widgetOptions = this._getWidgetOptions();

    return this.dateBox._createComponent(element, widgetName, widgetOptions);
  },
  _getWidgetOptions: abstract,
  _getWidgetName: abstract,
  getDefaultOptions: function getDefaultOptions() {
    return {
      mode: 'text'
    };
  },
  getDisplayFormat: abstract,
  supportedKeys: _common.noop,
  getKeyboardListener: _common.noop,
  customizeButtons: _common.noop,
  getParsedText: function getParsedText(text, format) {
    var value = _date.default.parse(text, format);

    return value ? value : _date.default.parse(text);
  },
  renderInputMinMax: _common.noop,
  renderOpenedState: function renderOpenedState() {
    this._updateValue();
  },
  popupConfig: abstract,
  _dimensionChanged: function _dimensionChanged() {
    var _this$_getPopup;

    (_this$_getPopup = this._getPopup()) === null || _this$_getPopup === void 0 ? void 0 : _this$_getPopup.repaint();
  },
  renderPopupContent: function renderPopupContent() {
    var popup = this._getPopup();

    this._renderWidget();

    var $popupContent = popup.$content().parent();

    _events_engine.default.off($popupContent, 'mousedown');

    _events_engine.default.on($popupContent, 'mousedown', this._preventFocusOnPopup.bind(this));
  },
  getFirstPopupElement: _common.noop,
  getLastPopupElement: _common.noop,
  _preventFocusOnPopup: function _preventFocusOnPopup(e) {
    e.preventDefault();
  },
  _getWidgetContainer: function _getWidgetContainer() {
    return this._getPopup().$content();
  },
  _getPopup: function _getPopup() {
    return this.dateBox._popup;
  },
  popupShowingHandler: _common.noop,
  popupHiddenHandler: _common.noop,
  _updateValue: function _updateValue() {
    this._widget && this._widget.option('value', this.dateBoxValue());
  },
  useCurrentDateByDefault: _common.noop,
  getDefaultDate: function getDefaultDate() {
    return new Date();
  },
  textChangedHandler: _common.noop,
  renderValue: function renderValue() {
    if (this.dateBox.option('opened')) {
      this._updateValue();
    }
  },
  getValue: function getValue() {
    return this._widget.option('value');
  },
  isAdaptivityChanged: function isAdaptivityChanged() {
    return false;
  },
  dispose: function dispose() {
    var popup = this._getPopup();

    if (popup) {
      popup.$content().empty();
    }
  },
  dateBoxValue: function dateBoxValue() {
    if (arguments.length) {
      return this.dateBox.dateValue.apply(this.dateBox, arguments);
    } else {
      return this.dateBox.dateOption.apply(this.dateBox, ['value']);
    }
  }
});

var _default = DateBoxStrategy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;