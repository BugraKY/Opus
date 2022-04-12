"use strict";

exports.default = void 0;

var _tooltip = _interopRequireDefault(require("../tooltip"));

var _extend = require("../../core/utils/extend");

var _slider_tooltip_position_controller = require("./slider_tooltip_position_controller");

var _number = _interopRequireDefault(require("../../localization/number"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// NOTE: Visibility is contolled by the 'visible' option and 'dx-slider-tooltip-visible-on-hover' class.
var SLIDER_TOOLTIP_VISIBILITY_CLASS = 'dx-slider-tooltip-visible-on-hover';

var SliderTooltip = _tooltip.default.inherit({
  _getDefaultOptions: function _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      visible: false,
      position: 'top',
      closeOnOutsideClick: false,
      hideTopOverlayHandler: null,
      hideOnParentScroll: false,
      animation: null,
      arrowPosition: null,
      templatesRenderAsynchronously: false,
      _fixWrapperPosition: false,
      useResizeObserver: false,
      showMode: 'onHover',
      format: function format(value) {
        return value;
      },
      value: 0
    });
  },
  _initMarkup: function _initMarkup() {
    this.callBase();

    this._attachToMarkup(this.option('visible'));

    this._toggleShowModeClass();
  },
  _renderContent: function _renderContent() {
    this.callBase();

    this._renderContentText();
  },
  _renderContentText: function _renderContentText() {
    var _this$option = this.option(),
        value = _this$option.value,
        format = _this$option.format;

    var formattedText = _number.default.format(value !== null && value !== void 0 ? value : 0, format);

    this.$content().text(formattedText);

    this._renderPosition();
  },
  _toggleShowModeClass: function _toggleShowModeClass() {
    var isHoverMode = this.option('showMode') === 'onHover';

    this._positionController.$container.toggleClass(SLIDER_TOOLTIP_VISIBILITY_CLASS, isHoverMode);
  },
  _initPositionController: function _initPositionController() {
    this._positionController = new _slider_tooltip_position_controller.SliderTooltipPositionController(this._getPositionControllerConfig());
  },
  _attachToMarkup: function _attachToMarkup(enabled) {
    enabled ? this.$element().appendTo(this._positionController.$container) : this.$element().detach();
  },
  _optionChanged: function _optionChanged(args) {
    var name = args.name,
        value = args.value;

    switch (name) {
      case 'visible':
        this._attachToMarkup(value);

        this.callBase(args);
        break;

      case 'showMode':
        this._toggleShowModeClass();

        break;

      case 'format':
      case 'value':
        this._renderContentText();

        break;

      default:
        this.callBase(args);
        break;
    }
  },
  updatePosition: function updatePosition() {
    this._renderPosition();
  }
});

var _default = SliderTooltip;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;