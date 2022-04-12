import { chart as lineChart } from './line_series';
import { chart as scatterSeries } from './scatter_series';
import { chart as areaChart } from './area_series';
import { chart as barChart, polar as barPolar } from './bar_series';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import { noop } from '../../core/utils/common';
var lineSeries = lineChart.line;
var areaSeries = areaChart.area;
var chartBarSeries = barChart.bar;
var polarBarSeries = barPolar.bar;
var _extend = extend;
var _each = each;
var _noop = noop;
var chart = {};
chart.bubble = _extend({}, scatterSeries, {
  _calculateErrorBars: _noop,
  _getMainColor: chartBarSeries._getMainColor,
  _createPointStyles: chartBarSeries._createPointStyles,
  _updatePointsVisibility: chartBarSeries._updatePointsVisibility,
  _getOptionsForPoint: chartBarSeries._getOptionsForPoint,
  _applyMarkerClipRect: lineSeries._applyElementsClipRect,
  _parsePointStyle: polarBarSeries._parsePointStyle,
  _createLegendState: areaSeries._createLegendState,
  _setMarkerGroupSettings: polarBarSeries._setMarkerGroupSettings,
  areErrorBarsVisible: _noop,
  _createErrorBarGroup: _noop,
  _checkData: function _checkData(data, skippedFields) {
    return scatterSeries._checkData.call(this, data, skippedFields, {
      value: this.getValueFields()[0],
      size: this.getSizeField()
    });
  },
  _getPointDataSelector: function _getPointDataSelector(data, options) {
    var sizeField = this.getSizeField();

    var baseGetter = scatterSeries._getPointDataSelector.call(this);

    return data => {
      var pointData = baseGetter(data);
      pointData.size = data[sizeField];
      return pointData;
    };
  },
  _aggregators: {
    avg(_ref, series) {
      var {
        data,
        intervalStart,
        intervalEnd
      } = _ref;

      if (!data.length) {
        return;
      }

      var valueField = series.getValueFields()[0];
      var sizeField = series.getSizeField();
      var aggregate = data.reduce((result, item) => {
        result[0] += item[valueField];
        result[1] += item[sizeField];
        result[2]++;
        return result;
      }, [0, 0, 0]);
      return {
        [valueField]: aggregate[0] / aggregate[2],
        [sizeField]: aggregate[1] / aggregate[2],
        [series.getArgumentField()]: series._getIntervalCenter(intervalStart, intervalEnd)
      };
    }

  },
  getValueFields: function getValueFields() {
    return [this._options.valueField || 'val'];
  },
  getSizeField: function getSizeField() {
    return this._options.sizeField || 'size';
  },
  _animate: function _animate() {
    var that = this;
    var lastPointIndex = that._drawnPoints.length - 1;
    var labelsGroup = that._labelsGroup;

    var labelAnimFunc = function labelAnimFunc() {
      labelsGroup && labelsGroup.animate({
        opacity: 1
      }, {
        duration: that._defaultDuration
      });
    };

    _each(that._drawnPoints || [], function (i, p) {
      p.animate(i === lastPointIndex ? labelAnimFunc : undefined, {
        r: p.bubbleSize,
        translateX: p.x,
        translateY: p.y
      });
    });
  },
  _patchMarginOptions: function _patchMarginOptions(options) {
    options.processBubbleSize = true;
    return options;
  }
});
export { chart };