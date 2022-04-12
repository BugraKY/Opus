"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _ui = _interopRequireDefault(require("../widget/ui.widget"));

var _ui2 = _interopRequireDefault(require("./ui.slider_tooltip"));

var _extend = require("../../core/utils/extend");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SLIDER_HANDLE_CLASS = 'dx-slider-handle';

var SliderHandle = _ui.default.inherit({
  _getDefaultOptions: function _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      hoverStateEnabled: false,
      value: 0,
      tooltip: {
        enabled: false,
        format: function format(value) {
          return value;
        },
        position: 'top',
        showMode: 'onHover'
      }
    });
  },
  _initMarkup: function _initMarkup() {
    this.callBase();
    this.$element().addClass(SLIDER_HANDLE_CLASS);
    this.setAria({
      'role': 'slider',
      'valuenow': this.option('value')
    });
  },
  _render: function _render() {
    this.callBase();

    this._renderTooltip();
  },
  _renderTooltip: function _renderTooltip() {
    var _this$option = this.option(),
        tooltip = _this$option.tooltip,
        value = _this$option.value;

    var position = tooltip.position,
        format = tooltip.format,
        enabled = tooltip.enabled,
        showMode = tooltip.showMode;
    this._sliderTooltip = this._createComponent((0, _renderer.default)('<div>'), _ui2.default, {
      target: this.$element(),
      container: this.$element(),
      position: position,
      visible: enabled,
      showMode: showMode,
      format: format,
      value: value
    });
  },
  _clean: function _clean() {
    this.callBase();
    this._sliderTooltip = null;
  },
  _updateTooltipOptions: function _updateTooltipOptions(args) {
    var _this$_sliderTooltip;

    var tooltipOptions = _ui.default.getOptionsFromContainer(args);

    this._setWidgetOption('_sliderTooltip', [tooltipOptions]);

    (_this$_sliderTooltip = this._sliderTooltip) === null || _this$_sliderTooltip === void 0 ? void 0 : _this$_sliderTooltip.option('visible', tooltipOptions.enabled);
  },
  _optionChanged: function _optionChanged(args) {
    var name = args.name,
        value = args.value;

    switch (name) {
      case 'value':
        {
          var _this$_sliderTooltip2;

          (_this$_sliderTooltip2 = this._sliderTooltip) === null || _this$_sliderTooltip2 === void 0 ? void 0 : _this$_sliderTooltip2.option('value', value);
          this.setAria('valuenow', value);
          break;
        }

      case 'tooltip':
        this._updateTooltipOptions(args);

        break;

      default:
        this.callBase(arguments);
    }
  },
  updateTooltipPosition: function updateTooltipPosition() {
    var _this$_sliderTooltip3;

    (_this$_sliderTooltip3 = this._sliderTooltip) === null || _this$_sliderTooltip3 === void 0 ? void 0 : _this$_sliderTooltip3.updatePosition();
  },
  repaint: function repaint() {
    var _this$_sliderTooltip4;

    (_this$_sliderTooltip4 = this._sliderTooltip) === null || _this$_sliderTooltip4 === void 0 ? void 0 : _this$_sliderTooltip4.repaint();
  }
});

var _default = SliderHandle;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;