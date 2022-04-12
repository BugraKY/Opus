import { extend } from '../../../core/utils/extend';
import symbolPoint from './symbol_point';
var _extend = extend;
var _round = Math.round;
var _sqrt = Math.sqrt;
var _acos = Math.acos;
var DEG = 180 / Math.PI;
var _abs = Math.abs;
import { getVerticallyShiftedAngularCoords, normalizeAngle as _normalizeAngle, getCosAndSin as _getCosAndSin } from '../../core/utils';
import { isDefined as _isDefined } from '../../../core/utils/type';
import consts from '../../components/consts';
var RADIAL_LABEL_INDENT = consts.radialLabelIndent;
export default _extend({}, symbolPoint, {
  _updateData: function _updateData(data, argumentChanged) {
    var that = this;

    symbolPoint._updateData.call(this, data);

    if (argumentChanged || !_isDefined(that._visible)) {
      that._visible = true;
    }

    that.minValue = that.initialMinValue = that.originalMinValue = _isDefined(data.minValue) ? data.minValue : 0;
  },
  animate: function animate(complete, duration, delay) {
    var that = this;
    that.graphic.animate({
      x: that.centerX,
      y: that.centerY,
      outerRadius: that.radiusOuter,
      innerRadius: that.radiusInner,
      startAngle: that.toAngle,
      endAngle: that.fromAngle
    }, {
      delay: delay,
      partitionDuration: duration
    }, complete);
  },
  correctPosition: function correctPosition(correction) {
    var that = this;
    that.correctRadius(correction);
    that.correctLabelRadius(correction.radiusOuter + RADIAL_LABEL_INDENT);
    that.centerX = correction.centerX;
    that.centerY = correction.centerY;
  },
  correctRadius: function correctRadius(correction) {
    this.radiusInner = correction.radiusInner;
    this.radiusOuter = correction.radiusOuter;
  },
  correctLabelRadius: function correctLabelRadius(radiusLabels) {
    this.radiusLabels = radiusLabels;
  },
  correctValue: function correctValue(correction, percent, base) {
    var that = this;
    that.value = (base || that.normalInitialValue) + correction;
    that.minValue = correction;
    that.percent = percent;

    that._label.setDataField('percent', percent);
  },
  _updateLabelData: function _updateLabelData() {
    this._label.setData(this._getLabelFormatObject());
  },
  _getShiftLabelCoords: function _getShiftLabelCoords() {
    var that = this;

    var bBox = that._label.getBoundingRect();

    var coord = that._getLabelCoords(that._label);

    var visibleArea = that._getVisibleArea();

    if (that._isLabelDrawingWithoutPoints) {
      return that._checkLabelPosition(coord, bBox, visibleArea);
    } else {
      return that._getLabelExtraCoord(coord, that._checkVerticalLabelPosition(coord, bBox, visibleArea), bBox);
    }
  },
  _getLabelPosition: function _getLabelPosition(options) {
    return options.position;
  },
  getAnnotationCoords: function getAnnotationCoords(location) {
    return this._getElementCoords(location !== 'edge' ? 'inside' : 'outside', this.radiusOuter, 0);
  },
  _getElementCoords: function _getElementCoords(position, elementRadius, radialOffset) {
    var bBox = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
    var that = this;

    var angleFunctions = _getCosAndSin(that.middleAngle);

    var radiusInner = that.radiusInner;
    var radiusOuter = that.radiusOuter;
    var columnsPosition = position === 'columns';
    var rad;
    var x;

    if (position === 'inside') {
      rad = radiusInner + (radiusOuter - radiusInner) / 2 + radialOffset;
      x = that.centerX + rad * angleFunctions.cos - bBox.width / 2;
    } else {
      rad = elementRadius + radialOffset;

      if (angleFunctions.cos > 0.1 || columnsPosition && angleFunctions.cos >= 0) {
        x = that.centerX + rad * angleFunctions.cos;
      } else if (angleFunctions.cos < -0.1 || columnsPosition && angleFunctions.cos < 0) {
        x = that.centerX + rad * angleFunctions.cos - bBox.width;
      } else {
        x = that.centerX + rad * angleFunctions.cos - bBox.width / 2;
      }
    }

    return {
      x: x,
      y: _round(that.centerY - rad * angleFunctions.sin - bBox.height / 2)
    };
  },
  _getLabelCoords: function _getLabelCoords(label) {
    var that = this;
    var bBox = label.getBoundingRect();
    var options = label.getLayoutOptions();

    var position = that._getLabelPosition(options);

    return that._getElementCoords(position, that.radiusLabels, options.radialOffset, bBox);
  },
  _correctLabelCoord: function _correctLabelCoord(coord, moveLabelsFromCenter) {
    var that = this;
    var label = that._label;
    var bBox = label.getBoundingRect();
    var labelWidth = bBox.width;
    var options = label.getLayoutOptions();

    var visibleArea = that._getVisibleArea();

    var rightBorderX = visibleArea.maxX - labelWidth;
    var leftBorderX = visibleArea.minX;

    var angleOfPoint = _normalizeAngle(that.middleAngle);

    var centerX = that.centerX;
    var connectorOffset = options.connectorOffset;
    var x = coord.x;

    if (options.position === 'columns') {
      if (angleOfPoint <= 90 || angleOfPoint >= 270) {
        x = rightBorderX;
      } else {
        x = leftBorderX;
      }

      coord.x = x;
    } else if (options.position !== 'inside' && moveLabelsFromCenter) {
      if (angleOfPoint <= 90 || angleOfPoint >= 270) {
        if (x - connectorOffset < centerX) {
          x = centerX + connectorOffset;
        }
      } else {
        if (x + labelWidth + connectorOffset > centerX) {
          x = centerX - labelWidth - connectorOffset;
        }
      }

      coord.x = x;
    }

    return coord;
  },
  drawLabel: function drawLabel() {
    this.translate(); // this function is called for drawing labels without points for checking size of labels

    this._isLabelDrawingWithoutPoints = true;

    this._drawLabel();

    this._isLabelDrawingWithoutPoints = false;
  },
  updateLabelCoord: function updateLabelCoord(moveLabelsFromCenter) {
    var that = this;

    var bBox = that._label.getBoundingRect();

    var coord = that._correctLabelCoord(bBox, moveLabelsFromCenter);

    coord = that._checkHorizontalLabelPosition(coord, bBox, that._getVisibleArea());

    that._label.shift(_round(coord.x), _round(bBox.y));
  },
  _checkVerticalLabelPosition: function _checkVerticalLabelPosition(coord, box, visibleArea) {
    var x = coord.x;
    var y = coord.y;

    if (coord.y + box.height > visibleArea.maxY) {
      y = visibleArea.maxY - box.height;
    } else if (coord.y < visibleArea.minY) {
      y = visibleArea.minY;
    }

    return {
      x: x,
      y: y
    };
  },
  _getLabelExtraCoord: function _getLabelExtraCoord(coord, shiftCoord, box) {
    return coord.y !== shiftCoord.y ? getVerticallyShiftedAngularCoords({
      x: coord.x,
      y: coord.y,
      width: box.width,
      height: box.height
    }, shiftCoord.y - coord.y, {
      x: this.centerX,
      y: this.centerY
    }) : coord;
  },
  _checkHorizontalLabelPosition: function _checkHorizontalLabelPosition(coord, box, visibleArea) {
    var x = coord.x;
    var y = coord.y;

    if (coord.x + box.width > visibleArea.maxX) {
      x = visibleArea.maxX - box.width;
    } else if (coord.x < visibleArea.minX) {
      x = visibleArea.minX;
    }

    return {
      x: x,
      y: y
    };
  },
  applyWordWrap: function applyWordWrap(moveLabelsFromCenter) {
    var that = this;
    var label = that._label;
    var box = label.getBoundingRect();

    var visibleArea = that._getVisibleArea();

    var position = label.getLayoutOptions().position;
    var width = box.width;
    var rowCountChanged = false;

    if (position === 'columns' && that.series.index > 0) {
      width = visibleArea.maxX - that.centerX - that.radiusLabels;
    } else if (position === 'inside') {
      if (width > visibleArea.maxX - visibleArea.minX) {
        width = visibleArea.maxX - visibleArea.minX;
      }
    } else {
      if (moveLabelsFromCenter && box.x < that.centerX && box.width + box.x > that.centerX) {
        width = Math.floor((visibleArea.maxX - visibleArea.minX) / 2);
      } else if (box.x + width > visibleArea.maxX) {
        width = visibleArea.maxX - box.x;
      } else if (box.x < visibleArea.minX) {
        width = box.x + width - visibleArea.minX;
      }
    }

    if (width < box.width) {
      rowCountChanged = label.fit(width);
    }

    return rowCountChanged;
  },
  setLabelTrackerData: function setLabelTrackerData() {
    this._label.setTrackerData(this);
  },
  _checkLabelPosition: function _checkLabelPosition(coord, bBox, visibleArea) {
    coord = this._checkHorizontalLabelPosition(coord, bBox, visibleArea);
    return this._checkVerticalLabelPosition(coord, bBox, visibleArea);
  },
  _getLabelConnector: function _getLabelConnector() {
    var that = this;
    var rad = that.radiusOuter;
    var seriesStyle = that._options.styles.normal;
    var strokeWidthBy2 = seriesStyle['stroke-width'] / 2;
    var borderWidth = that.series.getOptions().containerBackgroundColor === seriesStyle.stroke ? _round(strokeWidthBy2) : _round(-strokeWidthBy2);

    var angleFunctions = _getCosAndSin(_round(that.middleAngle));

    return {
      x: _round(that.centerX + (rad - borderWidth) * angleFunctions.cos),
      y: _round(that.centerY - (rad - borderWidth) * angleFunctions.sin),
      angle: that.middleAngle
    };
  },
  _drawMarker: function _drawMarker(renderer, group, animationEnabled, firstDrawing) {
    var that = this;
    var radiusOuter = that.radiusOuter;
    var radiusInner = that.radiusInner;
    var fromAngle = that.fromAngle;
    var toAngle = that.toAngle;

    if (animationEnabled) {
      radiusInner = radiusOuter = 0;

      if (!firstDrawing) {
        fromAngle = toAngle = that.shiftedAngle;
      }
    }

    that.graphic = renderer.arc(that.centerX, that.centerY, radiusInner, radiusOuter, toAngle, fromAngle).attr({
      'stroke-linejoin': 'round'
    }).smartAttr(that._getStyle()).data({
      'chart-data-point': that
    }).sharp().append(group);
  },
  getTooltipParams: function getTooltipParams() {
    var that = this;

    var angleFunctions = _getCosAndSin(that.middleAngle);

    var radiusInner = that.radiusInner;
    var radiusOuter = that.radiusOuter;
    return {
      x: that.centerX + (radiusInner + (radiusOuter - radiusInner) / 2) * angleFunctions.cos,
      y: that.centerY - (radiusInner + (radiusOuter - radiusInner) / 2) * angleFunctions.sin,
      offset: 0
    };
  },
  _translate: function _translate() {
    var that = this;
    var angle = that.shiftedAngle || 0;
    var value = that.value;
    var minValue = that.minValue;

    var translator = that._getValTranslator();

    that.fromAngle = translator.translate(minValue) + angle;
    that.toAngle = translator.translate(value) + angle;
    that.middleAngle = translator.translate((value - minValue) / 2 + minValue) + angle;

    if (!that.isVisible()) {
      that.middleAngle = that.toAngle = that.fromAngle = that.fromAngle || angle;
    }
  },
  getMarkerVisibility: function getMarkerVisibility() {
    return true;
  },
  _updateMarker: function _updateMarker(animationEnabled, style, _, callback) {
    var that = this;

    if (!animationEnabled) {
      style = _extend({
        x: that.centerX,
        y: that.centerY,
        outerRadius: that.radiusOuter,
        innerRadius: that.radiusInner,
        startAngle: that.toAngle,
        endAngle: that.fromAngle
      }, style);
    }

    that.graphic.smartAttr(style).sharp();
    callback && callback();
  },
  getLegendStyles: function getLegendStyles() {
    return this._styles.legendStyles;
  },
  isInVisibleArea: function isInVisibleArea() {
    return true;
  },
  hide: function hide() {
    var that = this;

    if (that._visible) {
      that._visible = false;
      that.hideTooltip();

      that._options.visibilityChanged();
    }
  },
  show: function show() {
    var that = this;

    if (!that._visible) {
      that._visible = true;

      that._options.visibilityChanged();
    }
  },
  setInvisibility: function setInvisibility() {
    this._label.draw(false);
  },
  isVisible: function isVisible() {
    return this._visible;
  },
  _getFormatObject: function _getFormatObject(tooltip) {
    var formatObject = symbolPoint._getFormatObject.call(this, tooltip);

    var percent = this.percent;
    formatObject.percent = percent;
    formatObject.percentText = tooltip.formatValue(percent, 'percent');
    return formatObject;
  },
  getColor: function getColor() {
    return this._styles.normal.fill;
  },
  coordsIn: function coordsIn(x, y) {
    var that = this;
    var lx = x - that.centerX;
    var ly = y - that.centerY;

    var r = _sqrt(lx * lx + ly * ly);

    var fromAngle = that.fromAngle % 360;
    var toAngle = that.toAngle % 360;
    var angle;

    if (r < that.radiusInner || r > that.radiusOuter || r === 0) {
      return false;
    }

    angle = _acos(lx / r) * DEG * (ly > 0 ? -1 : 1);

    if (angle < 0) {
      angle += 360;
    }

    if (fromAngle === toAngle && _abs(that.toAngle - that.fromAngle) > 1E-4) {
      return true;
    } else {
      return fromAngle >= toAngle ? angle <= fromAngle && angle >= toAngle : !(angle >= fromAngle && angle <= toAngle);
    }
  }
});