import $ from '../../core/renderer';
import Widget from '../widget/ui.widget';
import SliderTooltip from './ui.slider_tooltip';
import { extend } from '../../core/utils/extend';
var SLIDER_HANDLE_CLASS = 'dx-slider-handle';
var SliderHandle = Widget.inherit({
  _getDefaultOptions: function _getDefaultOptions() {
    return extend(this.callBase(), {
      hoverStateEnabled: false,
      value: 0,
      tooltip: {
        enabled: false,
        format: value => value,
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
    var {
      tooltip,
      value
    } = this.option();
    var {
      position,
      format,
      enabled,
      showMode
    } = tooltip;
    this._sliderTooltip = this._createComponent($('<div>'), SliderTooltip, {
      target: this.$element(),
      container: this.$element(),
      position,
      visible: enabled,
      showMode,
      format,
      value
    });
  },
  _clean: function _clean() {
    this.callBase();
    this._sliderTooltip = null;
  },

  _updateTooltipOptions(args) {
    var _this$_sliderTooltip;

    var tooltipOptions = Widget.getOptionsFromContainer(args);

    this._setWidgetOption('_sliderTooltip', [tooltipOptions]);

    (_this$_sliderTooltip = this._sliderTooltip) === null || _this$_sliderTooltip === void 0 ? void 0 : _this$_sliderTooltip.option('visible', tooltipOptions.enabled);
  },

  _optionChanged: function _optionChanged(args) {
    var {
      name,
      value
    } = args;

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
export default SliderHandle;