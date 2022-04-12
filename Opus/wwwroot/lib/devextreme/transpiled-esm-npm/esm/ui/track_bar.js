import $ from '../core/renderer';
import Editor from './editor/editor';
import registerComponent from '../core/component_registrator';
import { extend } from '../core/utils/extend';
import { hasWindow } from '../core/utils/window';
import fx from '../animation/fx';
var TRACKBAR_CLASS = 'dx-trackbar';
var TRACKBAR_CONTAINER_CLASS = 'dx-trackbar-container';
var TRACKBAR_RANGE_CLASS = 'dx-trackbar-range';
var TRACKBAR_WRAPPER_CLASS = 'dx-trackbar-wrapper';
var TrackBar = Editor.inherit({
  _getDefaultOptions: function _getDefaultOptions() {
    return extend(this.callBase(), {
      min: 0,
      max: 100,
      value: 0
    });
  },
  _initMarkup: function _initMarkup() {
    this.$element().addClass(TRACKBAR_CLASS);

    this._renderWrapper();

    this._renderContainer();

    this._renderRange();

    this._renderValue();

    this._setRangeStyles();

    this.callBase();
  },
  _render: function _render() {
    this.callBase();

    this._setRangeStyles(this._rangeStylesConfig());
  },
  _renderWrapper: function _renderWrapper() {
    this._$wrapper = $('<div>').addClass(TRACKBAR_WRAPPER_CLASS).appendTo(this.$element());
  },
  _renderContainer: function _renderContainer() {
    this._$bar = $('<div>').addClass(TRACKBAR_CONTAINER_CLASS).appendTo(this._$wrapper);
  },
  _renderRange: function _renderRange() {
    this._$range = $('<div>').addClass(TRACKBAR_RANGE_CLASS).appendTo(this._$bar);
  },
  _renderValue: function _renderValue() {
    var val = this.option('value');
    var min = this.option('min');
    var max = this.option('max');

    if (min > max) {
      return;
    }

    if (val < min) {
      this.option('value', min);
      this._currentRatio = 0;
      return;
    }

    if (val > max) {
      this.option('value', max);
      this._currentRatio = 1;
      return;
    }

    var ratio = min === max ? 0 : (val - min) / (max - min);
    !this._needPreventAnimation && this._setRangeStyles({
      width: ratio * 100 + '%'
    });
    this.setAria({
      'valuemin': this.option('min'),
      'valuemax': max,
      'valuenow': val
    });
    this._currentRatio = ratio;
  },
  _rangeStylesConfig: function _rangeStylesConfig() {
    return {
      width: this._currentRatio * 100 + '%'
    };
  },
  _setRangeStyles: function _setRangeStyles(options) {
    fx.stop(this._$range);

    if (!options) {
      this._$range.css({
        width: 0
      });

      return;
    }

    if (this._needPreventAnimation || !hasWindow()) {
      return;
    }

    fx.animate(this._$range, {
      type: 'custom',
      duration: 100,
      to: options
    });
  },
  _optionChanged: function _optionChanged(args) {
    switch (args.name) {
      case 'value':
        this._renderValue();

        this.callBase(args);
        break;

      case 'max':
      case 'min':
        this._renderValue();

        break;

      default:
        this.callBase(args);
    }
  },
  _dispose: function _dispose() {
    fx.stop(this._$range);
    this.callBase();
  }
});
registerComponent('dxTrackBar', TrackBar);
export default TrackBar;