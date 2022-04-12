import { extend } from '../../../core/utils/extend';
import symbolPoint from './symbol_point';
var _extend = extend;
var MIN_BUBBLE_HEIGHT = 20;
export default _extend({}, symbolPoint, {
  correctCoordinates: function correctCoordinates(diameter) {
    this.bubbleSize = diameter / 2;
  },
  _drawMarker: function _drawMarker(renderer, group, animationEnabled) {
    var that = this;

    var attr = _extend({
      translateX: that.x,
      translateY: that.y
    }, that._getStyle());

    that.graphic = renderer.circle(0, 0, animationEnabled ? 0 : that.bubbleSize).smartAttr(attr).data({
      'chart-data-point': that
    }).append(group);
  },
  getTooltipParams: function getTooltipParams(location) {
    var that = this;
    var graphic = that.graphic;

    if (!graphic) {
      return;
    }

    var height = graphic.getBBox().height;
    return {
      x: that.x,
      y: that.y,
      offset: height < MIN_BUBBLE_HEIGHT || location === 'edge' ? height / 2 : 0
    };
  },
  _getLabelFormatObject: function _getLabelFormatObject() {
    var formatObject = symbolPoint._getLabelFormatObject.call(this);

    formatObject.size = this.initialSize;
    return formatObject;
  },
  _updateData: function _updateData(data) {
    symbolPoint._updateData.call(this, data);

    this.size = this.initialSize = data.size;
  },
  _getGraphicBBox: function _getGraphicBBox() {
    var that = this;
    return that._getSymbolBBox(that.x, that.y, that.bubbleSize);
  },
  _updateMarker: function _updateMarker(animationEnabled, style) {
    var that = this;

    if (!animationEnabled) {
      style = _extend({
        r: that.bubbleSize,
        translateX: that.x,
        translateY: that.y
      }, style);
    }

    that.graphic.smartAttr(style);
  },
  _getFormatObject: function _getFormatObject(tooltip) {
    var formatObject = symbolPoint._getFormatObject.call(this, tooltip);

    formatObject.sizeText = tooltip.formatValue(this.initialSize);
    return formatObject;
  },
  _storeTrackerR: function _storeTrackerR() {
    return this.bubbleSize;
  },
  _getLabelCoords: function _getLabelCoords(label) {
    var coords;

    if (label.getLayoutOptions().position === 'inside') {
      coords = this._getLabelCoordOfPosition(label, 'inside');
    } else {
      coords = symbolPoint._getLabelCoords.call(this, label);
    }

    return coords;
  }
});