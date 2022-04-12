import { noop } from '../core/utils/common';
import registerComponent from '../core/component_registrator';
import { extend } from '../core/utils/extend';
import { normalizeAngle, convertPolarToXY } from './core/utils';
import { AdvancedChart } from './chart_components/advanced_chart';
import { isDefined } from '../core/utils/type';
var DEFAULT_PANE_NAME = 'default';
var DOUBLE_PI_ANGLE = 360;
var dxPolarChart = AdvancedChart.inherit({
  _themeSection: 'polar',
  _createPanes: function _createPanes() {
    this.callBase();
    return [{
      name: DEFAULT_PANE_NAME
    }];
  },
  _checkPaneName: function _checkPaneName() {
    return true;
  },
  _getAxisRenderingOptions: function _getAxisRenderingOptions(typeSelector) {
    var isArgumentAxis = typeSelector === 'argumentAxis';
    var type = isArgumentAxis ? 'circular' : 'linear';
    var useSpiderWeb = this.option('useSpiderWeb');

    if (useSpiderWeb) {
      type += 'Spider';
    }

    return {
      axisType: 'polarAxes',
      drawingType: type
    };
  },

  _executeAppendBeforeSeries(append) {
    append();
  },

  _prepareAxisOptions: function _prepareAxisOptions(typeSelector, axisOptions) {
    var isArgumentAxis = typeSelector === 'argumentAxis';
    var themeManager = this._themeManager;
    var axisUserOptions = this.option('argumentAxis');
    var argumentAxisOptions = themeManager.getOptions('argumentAxis', axisUserOptions) || {};
    var startAngle = isFinite(argumentAxisOptions.startAngle) ? normalizeAngle(argumentAxisOptions.startAngle) : 0;
    return {
      type: this.option('useSpiderWeb') && isArgumentAxis ? 'discrete' : axisOptions.type,
      isHorizontal: true,
      showCustomBoundaryTicks: isArgumentAxis,
      startAngle: startAngle,
      endAngle: startAngle + 360
    };
  },
  _optionChangesMap: {
    useSpiderWeb: 'AXES_AND_PANES'
  },
  _getExtraOptions: function _getExtraOptions() {
    return {
      spiderWidget: this.option('useSpiderWeb')
    };
  },
  _prepareToRender: function _prepareToRender() {
    this._appendAxesGroups();

    return {};
  },
  _calcCanvas: function _calcCanvas() {
    var canvas = extend({}, this._canvas);
    var argumentAxis = this.getArgumentAxis();
    var margins = argumentAxis.getMargins();
    Object.keys(margins).forEach(margin => canvas[margin] = canvas["original".concat(margin[0].toUpperCase()).concat(margin.slice(1))] + margins[margin]);
    return canvas;
  },
  _renderAxes: function _renderAxes(drawOptions) {
    var that = this;

    var valueAxis = that._getValueAxis();

    var argumentAxis = that.getArgumentAxis();
    argumentAxis.draw(that._canvas);
    valueAxis.setSpiderTicks(argumentAxis.getSpiderTicks());

    var canvas = that._calcCanvas();

    argumentAxis.updateSize(canvas);
    valueAxis.draw(canvas);
    return canvas;
  },
  _getValueAxis: function _getValueAxis() {
    return this._valueAxes[0];
  },
  _shrinkAxes: function _shrinkAxes(sizeStorage) {
    var valueAxis = this._getValueAxis();

    var argumentAxis = this.getArgumentAxis();

    if (sizeStorage && (sizeStorage.width || sizeStorage.height)) {
      argumentAxis.hideOuterElements();

      var canvas = this._calcCanvas();

      argumentAxis.updateSize(canvas);
      valueAxis.updateSize(canvas);
    }
  },

  checkForMoreSpaceForPanesCanvas() {
    return this.layoutManager.needMoreSpaceForPanesCanvas([{
      canvas: this.getArgumentAxis().getCanvas()
    }], this._isRotated());
  },

  _getLayoutTargets: function _getLayoutTargets() {
    return [{
      canvas: this._canvas
    }];
  },
  _getSeriesForPane: function _getSeriesForPane() {
    return this.series;
  },

  _applyClipRects() {
    var canvasClipRectID = this._getCanvasClipRectID();

    this._createClipPathForPane();

    this.getArgumentAxis().applyClipRects(this._getElementsClipRectID(), canvasClipRectID);

    this._getValueAxis().applyClipRects(this._getElementsClipRectID(), canvasClipRectID);
  },

  _createClipPathForPane() {
    var that = this;

    var valueAxis = that._getValueAxis();

    var center = valueAxis.getCenter();
    var radius = valueAxis.getRadius();
    var panesClipRects = that._panesClipRects;
    center = {
      x: Math.round(center.x),
      y: Math.round(center.y)
    };

    that._createClipCircle(panesClipRects.fixed, center.x, center.y, radius);

    that._createClipCircle(panesClipRects.base, center.x, center.y, radius);

    if (that.series.some(s => s.areErrorBarsVisible())) {
      that._createClipCircle(panesClipRects.wide, center.x, center.y, radius);
    } else {
      panesClipRects.wide[0] = null;
    }
  },

  _createClipCircle(clipArray, left, top, radius) {
    var that = this;
    var clipCircle = clipArray[0];

    if (!clipCircle) {
      clipCircle = that._renderer.clipCircle(left, top, radius);
      clipArray[0] = clipCircle;
    } else {
      clipCircle.attr({
        cx: left,
        cy: top,
        r: radius
      });
    }
  },

  _applyExtraSettings(series) {
    var wideClipRect = this._panesClipRects.wide[0];
    series.setClippingParams(this._panesClipRects.base[0].id, wideClipRect && wideClipRect.id, false, false);
  },

  getActualAngle(angle) {
    return this.getArgumentAxis().getOptions().inverted ? DOUBLE_PI_ANGLE - angle : angle;
  },

  getXYFromPolar(angle, radius, argument, value) {
    var layoutInfo = {
      angle: undefined,
      radius: undefined,
      x: undefined,
      y: undefined
    };

    if (!isDefined(angle) && !isDefined(radius) && !isDefined(argument) && !isDefined(value)) {
      return layoutInfo;
    }

    var argAxis = this.getArgumentAxis();
    var startAngle = argAxis.getAngles()[0];
    var argAngle;
    var translatedRadius;

    if (isDefined(argument)) {
      argAngle = argAxis.getTranslator().translate(argument);
    } else if (isFinite(angle)) {
      argAngle = this.getActualAngle(angle);
    } else if (!isDefined(angle)) {
      argAngle = 0;
    }

    if (isDefined(value)) {
      translatedRadius = this.getValueAxis().getTranslator().translate(value);
    } else if (isFinite(radius)) {
      translatedRadius = radius;
    } else if (!isDefined(radius)) {
      translatedRadius = argAxis.getRadius();
    }

    if (isDefined(argAngle) && isDefined(translatedRadius)) {
      var coords = convertPolarToXY(argAxis.getCenter(), startAngle, argAngle, translatedRadius);
      extend(layoutInfo, coords, {
        angle: argAxis.getTranslatedAngle(argAngle),
        radius: translatedRadius
      });
    }

    return layoutInfo;
  },

  _applyPointMarkersAutoHiding: noop,
  _createScrollBar: noop,
  _isRotated: noop,
  _getCrosshairOptions: noop,
  _isLegendInside: noop
});
import { plugins } from './core/annotations';
dxPolarChart.addPlugin(plugins.core);
dxPolarChart.addPlugin(plugins.polarChart);
registerComponent('dxPolarChart', dxPolarChart);
export default dxPolarChart;