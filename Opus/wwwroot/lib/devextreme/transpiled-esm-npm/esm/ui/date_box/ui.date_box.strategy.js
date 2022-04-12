import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import { noop } from '../../core/utils/common';
import Class from '../../core/class';
import dateLocalization from '../../localization/date';
var abstract = Class.abstract;
var DateBoxStrategy = Class.inherit({
  ctor: function ctor(dateBox) {
    this.dateBox = dateBox;
  },
  widgetOption: function widgetOption() {
    return this._widget && this._widget.option.apply(this._widget, arguments);
  },
  _renderWidget: function _renderWidget(element) {
    element = element || $('<div>');
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
  supportedKeys: noop,
  getKeyboardListener: noop,
  customizeButtons: noop,
  getParsedText: function getParsedText(text, format) {
    var value = dateLocalization.parse(text, format);
    return value ? value : dateLocalization.parse(text);
  },
  renderInputMinMax: noop,
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
    eventsEngine.off($popupContent, 'mousedown');
    eventsEngine.on($popupContent, 'mousedown', this._preventFocusOnPopup.bind(this));
  },
  getFirstPopupElement: noop,
  getLastPopupElement: noop,
  _preventFocusOnPopup: function _preventFocusOnPopup(e) {
    e.preventDefault();
  },
  _getWidgetContainer: function _getWidgetContainer() {
    return this._getPopup().$content();
  },
  _getPopup: function _getPopup() {
    return this.dateBox._popup;
  },
  popupShowingHandler: noop,
  popupHiddenHandler: noop,
  _updateValue: function _updateValue() {
    this._widget && this._widget.option('value', this.dateBoxValue());
  },
  useCurrentDateByDefault: noop,
  getDefaultDate: function getDefaultDate() {
    return new Date();
  },
  textChangedHandler: noop,
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
export default DateBoxStrategy;