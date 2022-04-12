import { getHeight } from '../core/utils/size';
import { noop } from '../core/utils/common';
import { extend as _extend } from '../core/utils/extend';
import { inArray } from '../core/utils/array';
import { hasWindow } from '../core/utils/window';
import { each as _each } from '../core/utils/iterator';
import registerComponent from '../core/component_registrator';
import { prepareSegmentRectPoints } from './utils';
import { map as _map, getLog, getCategoriesInfo, updatePanesCanvases, convertVisualRangeObject, PANE_PADDING, normalizePanesHeight, rangesAreEqual, isRelativeHeightPane } from './core/utils';
import { type, isDefined as _isDefined } from '../core/utils/type';
import { getPrecision } from '../core/utils/math';
import { overlapping } from './chart_components/base_chart';
import multiAxesSynchronizer from './chart_components/multi_axes_synchronizer';
import { AdvancedChart } from './chart_components/advanced_chart';
import { ScrollBar } from './chart_components/scroll_bar';
import { Crosshair, getMargins } from './chart_components/crosshair';
import rangeDataCalculator from './series/helpers/range_data_calculator';
import { LayoutManager } from './chart_components/layout_manager';
import { Range } from './translators/range';
var DEFAULT_PANE_NAME = 'default';
var VISUAL_RANGE = 'VISUAL_RANGE';
var DEFAULT_PANES = [{
  name: DEFAULT_PANE_NAME,
  border: {}
}];
var DISCRETE = 'discrete';
var _isArray = Array.isArray;

function getFirstAxisNameForPane(axes, paneName, defaultPane) {
  var result;

  for (var i = 0; i < axes.length; i++) {
    if (axes[i].pane === paneName || axes[i].pane === undefined && paneName === defaultPane) {
      result = axes[i].name;
      break;
    }
  }

  if (!result) {
    result = axes[0].name;
  }

  return result;
}

function changeVisibilityAxisGrids(axis, gridVisibility, minorGridVisibility) {
  var gridOpt = axis.getOptions().grid;
  var minorGridOpt = axis.getOptions().minorGrid;
  gridOpt.visible = gridVisibility;
  minorGridOpt && (minorGridOpt.visible = minorGridVisibility);
}

function hideGridsOnNonFirstValueAxisForPane(axesForPane) {
  var axisShown = false;
  var hiddenStubAxis = [];
  var minorGridVisibility = axesForPane.some(function (axis) {
    var minorGridOptions = axis.getOptions().minorGrid;
    return minorGridOptions && minorGridOptions.visible;
  });
  var gridVisibility = axesForPane.some(function (axis) {
    var gridOptions = axis.getOptions().grid;
    return gridOptions && gridOptions.visible;
  });

  if (axesForPane.length > 1) {
    axesForPane.forEach(function (axis) {
      var gridOpt = axis.getOptions().grid;

      if (axisShown) {
        changeVisibilityAxisGrids(axis, false, false);
      } else if (gridOpt && gridOpt.visible) {
        if (axis.getTranslator().getBusinessRange().isEmpty()) {
          changeVisibilityAxisGrids(axis, false, false);
          hiddenStubAxis.push(axis);
        } else {
          axisShown = true;
          changeVisibilityAxisGrids(axis, gridVisibility, minorGridVisibility);
        }
      }
    });
    !axisShown && hiddenStubAxis.length && changeVisibilityAxisGrids(hiddenStubAxis[0], gridVisibility, minorGridVisibility);
  }
}

function findAxisOptions(valueAxes, valueAxesOptions, axisName) {
  var result;
  var axInd;

  for (axInd = 0; axInd < valueAxesOptions.length; axInd++) {
    if (valueAxesOptions[axInd].name === axisName) {
      result = valueAxesOptions[axInd];
      result.priority = axInd;
      break;
    }
  }

  if (!result) {
    for (axInd = 0; axInd < valueAxes.length; axInd++) {
      if (valueAxes[axInd].name === axisName) {
        result = valueAxes[axInd].getOptions();
        result.priority = valueAxes[axInd].priority;
        break;
      }
    }
  }

  return result;
}

function findAxis(paneName, axisName, axes) {
  var axis;
  var i;

  for (i = 0; i < axes.length; i++) {
    axis = axes[i];

    if (axis.name === axisName && axis.pane === paneName) {
      return axis;
    }
  }

  if (paneName) {
    return findAxis(undefined, axisName, axes);
  }
}

function compareAxes(a, b) {
  return a.priority - b.priority;
} // checks if pane with provided name exists in this panes array


function doesPaneExist(panes, paneName) {
  var found = false;

  _each(panes, function (_, pane) {
    if (pane.name === paneName) {
      found = true;
      return false;
    }
  });

  return found;
} // utilities used in axes rendering


function accumulate(field, src1, src2, auxSpacing) {
  var val1 = src1[field] || 0;
  var val2 = src2[field] || 0;
  return val1 + val2 + (val1 && val2 ? auxSpacing : 0);
}

function pickMax(field, src1, src2) {
  return pickMaxValue(src1[field], src2[field]);
}

function pickMaxValue(val1, val2) {
  return Math.max(val1 || 0, val2 || 0);
}

function getAxisMargins(axis) {
  return axis.getMargins();
}

function getHorizontalAxesMargins(axes, getMarginsFunc) {
  return axes.reduce(function (margins, axis) {
    var _axis$getOrthogonalAx;

    var axisMargins = getMarginsFunc(axis);
    var paneMargins = margins.panes[axis.pane] = margins.panes[axis.pane] || {};
    var spacing = axis.getMultipleAxesSpacing();
    paneMargins.top = accumulate('top', paneMargins, axisMargins, spacing);
    paneMargins.bottom = accumulate('bottom', paneMargins, axisMargins, spacing);
    paneMargins.left = pickMax('left', paneMargins, axisMargins);
    paneMargins.right = pickMax('right', paneMargins, axisMargins);
    margins.top = pickMax('top', paneMargins, margins);
    margins.bottom = pickMax('bottom', paneMargins, margins);
    margins.left = pickMax('left', paneMargins, margins);
    margins.right = pickMax('right', paneMargins, margins);
    var orthogonalAxis = (_axis$getOrthogonalAx = axis.getOrthogonalAxis) === null || _axis$getOrthogonalAx === void 0 ? void 0 : _axis$getOrthogonalAx.call(axis);

    if (orthogonalAxis && orthogonalAxis.customPositionIsAvailable() && (!axis.customPositionIsBoundaryOrthogonalAxis() || !orthogonalAxis.customPositionEqualsToPredefined())) {
      margins[orthogonalAxis.getResolvedBoundaryPosition()] = 0;
    }

    return margins;
  }, {
    panes: {}
  });
}

function getVerticalAxesMargins(axes) {
  return axes.reduce(function (margins, axis) {
    var axisMargins = axis.getMargins();
    var paneMargins = margins.panes[axis.pane] = margins.panes[axis.pane] || {};
    var spacing = axis.getMultipleAxesSpacing();
    paneMargins.top = pickMax('top', paneMargins, axisMargins);
    paneMargins.bottom = pickMax('bottom', paneMargins, axisMargins);
    paneMargins.left = accumulate('left', paneMargins, axisMargins, spacing);
    paneMargins.right = accumulate('right', paneMargins, axisMargins, spacing);
    margins.top = pickMax('top', paneMargins, margins);
    margins.bottom = pickMax('bottom', paneMargins, margins);
    margins.left = pickMax('left', paneMargins, margins);
    margins.right = pickMax('right', paneMargins, margins);
    return margins;
  }, {
    panes: {}
  });
}

function performActionOnAxes(axes, action, actionArgument1, actionArgument2, actionArgument3) {
  axes.forEach(function (axis) {
    axis[action](actionArgument1 && actionArgument1[axis.pane], actionArgument2 && actionArgument2[axis.pane] || actionArgument2, actionArgument3);
  });
}

function shrinkCanvases(isRotated, canvases, sizes, verticalMargins, horizontalMargins) {
  function getMargin(side, margins, pane) {
    var m = (isRotated ? ['left', 'right'] : ['top', 'bottom']).indexOf(side) === -1 ? margins : margins.panes[pane] || {};
    return m[side];
  }

  function getMaxMargin(side, margins1, margins2, pane) {
    return pickMaxValue(getMargin(side, margins1, pane), getMargin(side, margins2, pane));
  }

  var getOriginalField = field => "original".concat(field[0].toUpperCase()).concat(field.slice(1));

  function shrink(canvases, paneNames, sizeField, startMargin, endMargin, oppositeMargins) {
    paneNames = paneNames.sort((p1, p2) => canvases[p2][startMargin] - canvases[p1][startMargin]);
    paneNames.forEach(pane => {
      var canvas = canvases[pane];
      oppositeMargins.forEach(margin => {
        canvas[margin] = canvas[getOriginalField(margin)] + getMaxMargin(margin, verticalMargins, horizontalMargins, pane);
      });
    });
    var firstPane = canvases[paneNames[0]];
    var emptySpace = paneNames.reduce((space, paneName) => {
      space -= getMaxMargin(startMargin, verticalMargins, horizontalMargins, paneName) + getMaxMargin(endMargin, verticalMargins, horizontalMargins, paneName);
      return space;
    }, firstPane[sizeField] - firstPane[getOriginalField(endMargin)] - canvases[paneNames[paneNames.length - 1]][getOriginalField(startMargin)]) - PANE_PADDING * (paneNames.length - 1);
    emptySpace -= Object.keys(sizes).reduce((prev, key) => prev + (!isRelativeHeightPane(sizes[key]) ? sizes[key].height : 0), 0);
    paneNames.reduce((offset, pane) => {
      var canvas = canvases[pane];
      var paneSize = sizes[pane];
      offset -= getMaxMargin(endMargin, verticalMargins, horizontalMargins, pane);
      canvas[endMargin] = firstPane[sizeField] - offset;
      offset -= !isRelativeHeightPane(paneSize) ? paneSize.height : Math.floor(emptySpace * paneSize.height);
      canvas[startMargin] = offset;
      offset -= getMaxMargin(startMargin, verticalMargins, horizontalMargins, pane) + PANE_PADDING;
      return offset;
    }, firstPane[sizeField] - firstPane[getOriginalField(endMargin)] - (emptySpace < 0 ? emptySpace : 0));
  }

  var paneNames = Object.keys(canvases);

  if (!isRotated) {
    shrink(canvases, paneNames, 'height', 'top', 'bottom', ['left', 'right']);
  } else {
    shrink(canvases, paneNames, 'width', 'left', 'right', ['top', 'bottom']);
  }

  return canvases;
}

function drawAxesWithTicks(axes, condition, canvases, panesBorderOptions) {
  if (condition) {
    performActionOnAxes(axes, 'createTicks', canvases);
    multiAxesSynchronizer.synchronize(axes);
  }

  performActionOnAxes(axes, 'draw', !condition && canvases, panesBorderOptions);
}

function shiftAxis(side1, side2) {
  var shifts = {};
  return function (axis) {
    if (!axis.customPositionIsAvailable() || axis.customPositionEqualsToPredefined()) {
      var shift = shifts[axis.pane] = shifts[axis.pane] || {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      };
      var spacing = axis.getMultipleAxesSpacing();
      var margins = axis.getMargins();
      axis.shift(shift);
      shift[side1] = accumulate(side1, shift, margins, spacing);
      shift[side2] = accumulate(side2, shift, margins, spacing);
    } else {
      axis.shift({
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      });
    }
  };
}

function getCommonSize(side, margins) {
  var size = 0;
  var pane;
  var paneMargins;

  for (pane in margins.panes) {
    paneMargins = margins.panes[pane];
    size = size + (side === 'height' ? paneMargins.top + paneMargins.bottom : paneMargins.left + paneMargins.right);
  }

  return size;
}

function checkUsedSpace(sizeShortage, side, axes, getMarginFunc) {
  var size = 0;

  if (sizeShortage[side] > 0) {
    size = getCommonSize(side, getMarginFunc(axes, getAxisMargins));
    performActionOnAxes(axes, 'hideTitle');
    sizeShortage[side] -= size - getCommonSize(side, getMarginFunc(axes, getAxisMargins));
  }

  if (sizeShortage[side] > 0) {
    performActionOnAxes(axes, 'hideOuterElements');
  }
}

function axisAnimationEnabled(drawOptions, pointsToAnimation) {
  var pointsCount = pointsToAnimation.reduce((sum, count) => sum + count, 0) / pointsToAnimation.length;
  return drawOptions.animate && pointsCount <= drawOptions.animationPointsLimit;
}

function collectMarkersInfoBySeries(allSeries, filteredSeries, argAxis) {
  var series = [];
  var overloadedSeries = {};
  var argVisualRange = argAxis.visualRange();
  var argTranslator = argAxis.getTranslator();
  var argViewPortFilter = rangeDataCalculator.getViewPortFilter(argVisualRange || {});
  filteredSeries.forEach(s => {
    var valAxis = s.getValueAxis();
    var valVisualRange = valAxis.getCanvasRange();
    var valTranslator = valAxis.getTranslator();
    var seriesIndex = allSeries.indexOf(s);
    var valViewPortFilter = rangeDataCalculator.getViewPortFilter(valVisualRange || {});
    overloadedSeries[seriesIndex] = {};
    filteredSeries.forEach(sr => overloadedSeries[seriesIndex][allSeries.indexOf(sr)] = 0);
    var seriesPoints = [];
    s.getPoints().filter(p => {
      return p.getOptions().visible && argViewPortFilter(p.argument) && (valViewPortFilter(p.getMinValue(true)) || valViewPortFilter(p.getMaxValue(true)));
    }).forEach(p => {
      var tp = {
        seriesIndex,
        argument: p.argument,
        value: p.getMaxValue(true),
        size: p.bubbleSize || p.getOptions().size
      };

      if (p.getMinValue(true) !== p.getMaxValue(true)) {
        var mp = _extend({}, tp);

        mp.value = p.getMinValue(true);
        mp.x = argTranslator.to(mp.argument, 1);
        mp.y = valTranslator.to(mp.value, 1);
        seriesPoints.push(mp);
      }

      tp.x = argTranslator.to(tp.argument, 1);
      tp.y = valTranslator.to(tp.value, 1);
      seriesPoints.push(tp);
    });
    overloadedSeries[seriesIndex].pointsCount = seriesPoints.length;
    overloadedSeries[seriesIndex].total = 0;
    overloadedSeries[seriesIndex].continuousSeries = 0;
    series.push({
      name: s.name,
      index: seriesIndex,
      points: seriesPoints
    });
  });
  return {
    series,
    overloadedSeries
  };
}

function applyAutoHidePointMarkers(allSeries, filteredSeries, overloadedSeries, argAxis) {
  var argAxisType = argAxis.getOptions().type;
  filteredSeries.forEach(s => {
    var seriesIndex = allSeries.indexOf(s);
    s.autoHidePointMarkers = false;
    var tickCount = argAxis.getTicksValues().majorTicksValues.length;

    if (s.autoHidePointMarkersEnabled() && (argAxisType === DISCRETE || overloadedSeries[seriesIndex].pointsCount > tickCount)) {
      for (var index in overloadedSeries[seriesIndex]) {
        var i = parseInt(index);

        if (isNaN(i) || overloadedSeries[seriesIndex].total / overloadedSeries[seriesIndex].continuousSeries < 3) {
          continue;
        }

        if (i === seriesIndex) {
          if (overloadedSeries[i][i] * 2 >= overloadedSeries[i].pointsCount) {
            s.autoHidePointMarkers = true;
            break;
          }
        } else if (overloadedSeries[seriesIndex].total >= overloadedSeries[seriesIndex].pointsCount) {
          s.autoHidePointMarkers = true;
          break;
        }
      }
    }
  });
}

function fastHidingPointMarkersByArea(canvas, markersInfo, series) {
  var area = canvas.width * canvas.height;
  var seriesPoints = markersInfo.series;

  var _loop = function _loop(i) {
    var currentSeries = series.filter(s => s.name === seriesPoints[i].name)[0];
    var points = seriesPoints[i].points;
    var pointSize = points.length ? points[0].size : 0;
    var pointsArea = pointSize * pointSize * points.length;

    if (currentSeries.autoHidePointMarkersEnabled() && pointsArea >= area / seriesPoints.length) {
      var index = seriesPoints[i].index;
      currentSeries.autoHidePointMarkers = true;
      seriesPoints.splice(i, 1);
      series.splice(series.indexOf(currentSeries), 1);
      delete markersInfo.overloadedSeries[index];
    }
  };

  for (var i = seriesPoints.length - 1; i >= 0; i--) {
    _loop(i);
  }
}

function updateMarkersInfo(points, overloadedSeries) {
  var isContinuousSeries = false;

  for (var i = 0; i < points.length - 1; i++) {
    var curPoint = points[i];
    var size = curPoint.size;

    if (_isDefined(curPoint.x) && _isDefined(curPoint.y)) {
      for (var j = i + 1; j < points.length; j++) {
        var nextPoint = points[j];
        var next_x = nextPoint === null || nextPoint === void 0 ? void 0 : nextPoint.x;
        var next_y = nextPoint === null || nextPoint === void 0 ? void 0 : nextPoint.y;

        if (!_isDefined(next_x) || Math.abs(curPoint.x - next_x) >= size) {
          isContinuousSeries &= j !== i + 1;
          break;
        } else {
          var distance = _isDefined(next_x) && _isDefined(next_y) && Math.sqrt(Math.pow(curPoint.x - next_x, 2) + Math.pow(curPoint.y - next_y, 2));

          if (distance && distance < size) {
            overloadedSeries[curPoint.seriesIndex][nextPoint.seriesIndex]++;
            overloadedSeries[curPoint.seriesIndex].total++;

            if (!isContinuousSeries) {
              overloadedSeries[curPoint.seriesIndex].continuousSeries++;
              isContinuousSeries = true;
            }
          }
        }
      }
    }
  }
} // utilities used in axes rendering


var dxChart = AdvancedChart.inherit({
  _themeSection: 'chart',
  _fontFields: ['crosshair.label.font'],
  _initCore: function _initCore() {
    this.paneAxis = {};
    this.callBase();
  },

  _init() {
    this._containerInitialHeight = hasWindow() ? getHeight(this._$element) : 0;
    this.callBase();
  },

  _correctAxes: function _correctAxes() {
    this._correctValueAxes(true);
  },
  _getExtraOptions: noop,
  _createPanes: function _createPanes() {
    var that = this;
    var panes = that.option('panes');
    var panesNameCounter = 0;
    var defaultPane;

    if (!panes || _isArray(panes) && !panes.length) {
      panes = DEFAULT_PANES;
    }

    that.callBase();
    defaultPane = that.option('defaultPane');
    panes = _extend(true, [], _isArray(panes) ? panes : [panes]);

    _each(panes, function (_, pane) {
      pane.name = !_isDefined(pane.name) ? DEFAULT_PANE_NAME + panesNameCounter++ : pane.name;
    });

    if (_isDefined(defaultPane)) {
      if (!doesPaneExist(panes, defaultPane)) {
        that._incidentOccurred('W2101', [defaultPane]);

        defaultPane = panes[panes.length - 1].name;
      }
    } else {
      defaultPane = panes[panes.length - 1].name;
    }

    that.defaultPane = defaultPane;
    panes = that._isRotated() ? panes.reverse() : panes;
    return panes;
  },
  _getAxisRenderingOptions: function _getAxisRenderingOptions() {
    return {
      axisType: 'xyAxes',
      drawingType: 'linear'
    };
  },
  _prepareAxisOptions: function _prepareAxisOptions(typeSelector, userOptions, rotated) {
    return {
      isHorizontal: typeSelector === 'argumentAxis' !== rotated,
      containerColor: this._themeManager.getOptions('containerBackgroundColor')
    };
  },
  _checkPaneName: function _checkPaneName(seriesTheme) {
    var paneList = _map(this.panes, function (pane) {
      return pane.name;
    });

    seriesTheme.pane = seriesTheme.pane || this.defaultPane;
    return inArray(seriesTheme.pane, paneList) !== -1;
  },

  _initCustomPositioningAxes() {
    var that = this;
    var argumentAxis = that.getArgumentAxis();
    var valueAxisName = argumentAxis.getOptions().customPositionAxis;

    var valueAxis = that._valueAxes.filter(v => v.pane === argumentAxis.pane && (!valueAxisName || valueAxisName === v.name))[0];

    that._valueAxes.forEach(v => {
      if (argumentAxis !== v.getOrthogonalAxis()) {
        v.getOrthogonalAxis = () => {
          return argumentAxis;
        };

        v.customPositionIsBoundaryOrthogonalAxis = () => {
          return argumentAxis.customPositionIsBoundary();
        };
      }
    });

    if (_isDefined(valueAxis) && valueAxis !== argumentAxis.getOrthogonalAxis()) {
      argumentAxis.getOrthogonalAxis = () => {
        return valueAxis;
      };

      argumentAxis.customPositionIsBoundaryOrthogonalAxis = () => {
        return that._valueAxes.some(v => v.customPositionIsBoundary());
      };
    } else if (_isDefined(argumentAxis.getOrthogonalAxis()) && !_isDefined(valueAxis)) {
      argumentAxis.getOrthogonalAxis = noop;
    }
  },

  _getAllAxes() {
    return this._argumentAxes.concat(this._valueAxes);
  },

  _resetAxesAnimation(isFirstDrawing, isHorizontal) {
    var axes = _isDefined(isHorizontal) ? isHorizontal ^ this._isRotated() ? this._argumentAxes : this._valueAxes : this._getAllAxes();
    axes.forEach(a => {
      a.resetApplyingAnimation(isFirstDrawing);
    });
  },

  _axesBoundaryPositioning() {
    var that = this;

    var allAxes = that._getAllAxes();

    var boundaryStateChanged = false;
    allAxes.forEach(a => {
      if (!a.customPositionIsAvailable()) {
        return false;
      }

      var prevBoundaryState = a.customPositionIsBoundary();
      a._customBoundaryPosition = a.getCustomBoundaryPosition();
      boundaryStateChanged |= prevBoundaryState !== a.customPositionIsBoundary();
    });
    return boundaryStateChanged;
  },

  _getCrosshairMargins: function _getCrosshairMargins() {
    var crosshairOptions = this._getCrosshairOptions() || {};
    var crosshairEnabled = crosshairOptions.enabled;
    var margins = getMargins();

    var horizontalLabel = _extend(true, {}, crosshairOptions.label, crosshairOptions.horizontalLine.label);

    var verticalLabel = _extend(true, {}, crosshairOptions.label, crosshairOptions.verticalLine.label);

    return {
      x: crosshairEnabled && crosshairOptions.horizontalLine.visible && horizontalLabel.visible ? margins.x : 0,
      y: crosshairEnabled && crosshairOptions.verticalLine.visible && verticalLabel.visible ? margins.y : 0
    };
  },
  _getValueAxis: function _getValueAxis(paneName, axisName) {
    var that = this;
    var valueAxes = that._valueAxes;
    var valueAxisOptions = that.option('valueAxis') || {};
    var valueAxesOptions = _isArray(valueAxisOptions) ? valueAxisOptions : [valueAxisOptions];

    var rotated = that._isRotated();

    var crosshairMargins = that._getCrosshairMargins();

    var axisOptions;
    var axis;
    axisName = axisName || getFirstAxisNameForPane(valueAxes, paneName, that.defaultPane);
    axis = findAxis(paneName, axisName, valueAxes);

    if (!axis) {
      axisOptions = findAxisOptions(valueAxes, valueAxesOptions, axisName);

      if (!axisOptions) {
        that._incidentOccurred('W2102', [axisName]);

        axisOptions = {
          name: axisName,
          priority: valueAxes.length
        };
      }

      axis = that._createAxis(false, that._populateAxesOptions('valueAxis', axisOptions, {
        pane: paneName,
        name: axisName,
        optionPath: _isArray(valueAxisOptions) ? "valueAxis[".concat(axisOptions.priority, "]") : 'valueAxis',
        crosshairMargin: rotated ? crosshairMargins.y : crosshairMargins.x
      }, rotated));
      axis.applyVisualRangeSetter(that._getVisualRangeSetter());
      valueAxes.push(axis);
    }

    axis.setPane(paneName);
    return axis;
  },
  _correctValueAxes: function _correctValueAxes(needHideGrids) {
    var that = this;

    var synchronizeMultiAxes = that._themeManager.getOptions('synchronizeMultiAxes');

    var valueAxes = that._valueAxes;
    var paneWithAxis = {};
    that.series.forEach(function (series) {
      var axis = series.getValueAxis();
      paneWithAxis[axis.pane] = true;
    });
    that.panes.forEach(function (pane) {
      var paneName = pane.name;

      if (!paneWithAxis[paneName]) {
        that._getValueAxis(paneName); // creates an value axis if there is no one for pane

      }

      if (needHideGrids && synchronizeMultiAxes) {
        hideGridsOnNonFirstValueAxisForPane(valueAxes.filter(function (axis) {
          return axis.pane === paneName;
        }));
      }
    });
    that._valueAxes = valueAxes.filter(function (axis) {
      if (!axis.pane) {
        axis.setPane(that.defaultPane);
      }

      var paneExists = doesPaneExist(that.panes, axis.pane);

      if (!paneExists) {
        axis.dispose();
        axis = null;
      }

      return paneExists;
    }).sort(compareAxes);
    var defaultAxis = this.getValueAxis();

    that._valueAxes.forEach(axis => {
      var optionPath = axis.getOptions().optionPath;

      if (optionPath) {
        var axesWithSamePath = that._valueAxes.filter(a => a.getOptions().optionPath === optionPath);

        if (axesWithSamePath.length > 1) {
          if (axesWithSamePath.some(a => a === defaultAxis)) {
            axesWithSamePath.forEach(a => {
              if (a !== defaultAxis) {
                a.getOptions().optionPath = null;
              }
            });
          } else {
            axesWithSamePath.forEach((a, i) => {
              if (i !== 0) {
                a.getOptions().optionPath = null;
              }
            });
          }
        }
      }
    });
  },
  _getSeriesForPane: function _getSeriesForPane(paneName) {
    var paneSeries = [];

    _each(this.series, function (_, oneSeries) {
      if (oneSeries.pane === paneName) {
        paneSeries.push(oneSeries);
      }
    });

    return paneSeries;
  },
  _createPanesBorderOptions: function _createPanesBorderOptions() {
    var commonBorderOptions = this._themeManager.getOptions('commonPaneSettings').border;

    var panesBorderOptions = {};
    this.panes.forEach(pane => panesBorderOptions[pane.name] = _extend(true, {}, commonBorderOptions, pane.border));
    return panesBorderOptions;
  },
  _createScrollBar: function _createScrollBar() {
    var that = this;
    var scrollBarOptions = that._themeManager.getOptions('scrollBar') || {};
    var scrollBarGroup = that._scrollBarGroup;

    if (scrollBarOptions.visible) {
      scrollBarOptions.rotated = that._isRotated();
      that._scrollBar = (that._scrollBar || new ScrollBar(that._renderer, scrollBarGroup)).update(scrollBarOptions);
    } else {
      scrollBarGroup.linkRemove();
      that._scrollBar && that._scrollBar.dispose();
      that._scrollBar = null;
    }
  },

  _executeAppendAfterSeries(append) {
    append();
  },

  _prepareToRender(drawOptions) {
    var panesBorderOptions = this._createPanesBorderOptions();

    this._createPanesBackground();

    this._appendAxesGroups();

    this._adjustViewport();

    return panesBorderOptions;
  },

  _adjustViewport() {
    var that = this;

    var adjustOnZoom = that._themeManager.getOptions('adjustOnZoom');

    if (!adjustOnZoom) {
      return;
    }

    that._valueAxes.forEach(axis => axis.adjust());
  },

  _recreateSizeDependentObjects(isCanvasChanged) {
    var that = this;

    var series = that._getVisibleSeries();

    var useAggregation = series.some(s => s.useAggregation());

    var zoomChanged = that._isZooming();

    if (!useAggregation) {
      return;
    }

    that._argumentAxes.forEach(function (axis) {
      axis.updateCanvas(that._canvas, true);
    });

    series.forEach(function (series) {
      if (series.useAggregation() && (isCanvasChanged || zoomChanged || !series._useAllAggregatedPoints)) {
        series.createPoints();
      }
    });

    that._processSeriesFamilies();
  },

  _isZooming() {
    var that = this;
    var argumentAxis = that.getArgumentAxis();

    if (!argumentAxis || !argumentAxis.getTranslator()) {
      return false;
    }

    var businessRange = argumentAxis.getTranslator().getBusinessRange();
    var zoomRange = argumentAxis.getViewport();
    var min = zoomRange ? zoomRange.min : 0;
    var max = zoomRange ? zoomRange.max : 0;

    if (businessRange.axisType === 'logarithmic') {
      min = getLog(min, businessRange.base);
      max = getLog(max, businessRange.base);
    }

    var viewportDistance = businessRange.axisType === DISCRETE ? getCategoriesInfo(businessRange.categories, min, max).categories.length : Math.abs(max - min);
    var precision = getPrecision(viewportDistance);
    precision = precision > 1 ? Math.pow(10, precision - 2) : 1;
    var zoomChanged = Math.round((that._zoomLength - viewportDistance) * precision) / precision !== 0;
    that._zoomLength = viewportDistance;
    return zoomChanged;
  },

  _handleSeriesDataUpdated: function _handleSeriesDataUpdated() {
    var that = this;
    var viewport = new Range();
    that.series.forEach(function (s) {
      viewport.addRange(s.getArgumentRange());
    });

    that._argumentAxes.forEach(function (axis) {
      axis.updateCanvas(that._canvas, true);
      axis.setBusinessRange(viewport, that._axesReinitialized);
    });

    that.callBase();
  },
  _isLegendInside: function _isLegendInside() {
    return this._legend && this._legend.getPosition() === 'inside';
  },
  _isRotated: function _isRotated() {
    return this._themeManager.getOptions('rotated');
  },
  _getLayoutTargets: function _getLayoutTargets() {
    return this.panes;
  },
  _applyClipRects: function _applyClipRects(panesBorderOptions) {
    var that = this;

    that._drawPanesBorders(panesBorderOptions);

    that._createClipRectsForPanes();

    that._applyClipRectsForAxes();

    that._fillPanesBackground();
  },
  _updateLegendPosition: function _updateLegendPosition(drawOptions, legendHasInsidePosition) {
    var that = this;

    if (drawOptions.drawLegend && that._legend && legendHasInsidePosition) {
      var panes = that.panes;

      var newCanvas = _extend({}, panes[0].canvas);

      var layoutManager = new LayoutManager();
      newCanvas.right = panes[panes.length - 1].canvas.right;
      newCanvas.bottom = panes[panes.length - 1].canvas.bottom;
      layoutManager.layoutInsideLegend(that._legend, newCanvas);
    }
  },

  _allowLegendInsidePosition() {
    return true;
  },

  _applyExtraSettings: function _applyExtraSettings(series) {
    var that = this;

    var paneIndex = that._getPaneIndex(series.pane);

    var panesClipRects = that._panesClipRects;
    var wideClipRect = panesClipRects.wide[paneIndex];
    series.setClippingParams(panesClipRects.base[paneIndex].id, wideClipRect && wideClipRect.id, that._getPaneBorderVisibility(paneIndex));
  },
  _updatePanesCanvases: function _updatePanesCanvases(drawOptions) {
    if (!drawOptions.recreateCanvas) {
      return;
    }

    updatePanesCanvases(this.panes, this._canvas, this._isRotated());
  },
  _normalizePanesHeight: function _normalizePanesHeight() {
    normalizePanesHeight(this.panes);
  },
  _renderScaleBreaks: function _renderScaleBreaks() {
    this._valueAxes.concat(this._argumentAxes).forEach(function (axis) {
      axis.drawScaleBreaks();
    });
  },

  _getArgFilter() {
    return rangeDataCalculator.getViewPortFilter(this.getArgumentAxis().visualRange() || {});
  },

  _applyPointMarkersAutoHiding() {
    var that = this;
    var allSeries = that.series;

    if (!that._themeManager.getOptions('autoHidePointMarkers')) {
      allSeries.forEach(s => s.autoHidePointMarkers = false);
      return;
    }

    that.panes.forEach(_ref => {
      var {
        borderCoords,
        name
      } = _ref;
      var series = allSeries.filter(s => s.pane === name && s.usePointsToDefineAutoHiding());
      var argAxis = that.getArgumentAxis();
      var markersInfo = collectMarkersInfoBySeries(allSeries, series, argAxis);
      fastHidingPointMarkersByArea(borderCoords, markersInfo, series);

      if (markersInfo.series.length) {
        var argVisualRange = argAxis.visualRange();
        var argAxisIsDiscrete = argAxis.getOptions().type === DISCRETE;
        var sortingCallback = argAxisIsDiscrete ? (p1, p2) => argVisualRange.categories.indexOf(p1.argument) - argVisualRange.categories.indexOf(p2.argument) : (p1, p2) => p1.argument - p2.argument;
        var points = [];
        markersInfo.series.forEach(s => points = points.concat(s.points));
        points.sort(sortingCallback);
        updateMarkersInfo(points, markersInfo.overloadedSeries);
        applyAutoHidePointMarkers(allSeries, series, markersInfo.overloadedSeries, argAxis);
      }
    });
  },

  _renderAxes: function _renderAxes(drawOptions, panesBorderOptions) {
    function calculateTitlesWidth(axes) {
      return axes.map(axis => {
        if (!axis.getTitle) return 0;
        var title = axis.getTitle();
        return title ? title.bBox.width : 0;
      });
    }

    var that = this;

    var rotated = that._isRotated();

    var synchronizeMultiAxes = that._themeManager.getOptions('synchronizeMultiAxes');

    var scrollBar = that._scrollBar ? [that._scrollBar] : [];
    var extendedArgAxes = that._isArgumentAxisBeforeScrollBar() ? that._argumentAxes.concat(scrollBar) : scrollBar.concat(that._argumentAxes);
    var verticalAxes = rotated ? that._argumentAxes : that._valueAxes;
    var verticalElements = rotated ? extendedArgAxes : that._valueAxes;
    var horizontalAxes = rotated ? that._valueAxes : that._argumentAxes;
    var horizontalElements = rotated ? that._valueAxes : extendedArgAxes;
    var allAxes = verticalAxes.concat(horizontalAxes);
    var allElements = allAxes.concat(scrollBar);
    var verticalAxesFirstDrawing = verticalAxes.some(v => v.isFirstDrawing());

    that._normalizePanesHeight();

    that._updatePanesCanvases(drawOptions);

    var panesCanvases = that.panes.reduce(function (canvases, pane) {
      canvases[pane.name] = _extend({}, pane.canvas);
      return canvases;
    }, {});
    var paneSizes = that.panes.reduce((sizes, pane) => {
      sizes[pane.name] = {
        height: pane.height,
        unit: pane.unit
      };
      return sizes;
    }, {});

    var cleanPanesCanvases = _extend(true, {}, panesCanvases);

    that._initCustomPositioningAxes();

    var needCustomAdjustAxes = that._axesBoundaryPositioning();

    if (!drawOptions.adjustAxes && !needCustomAdjustAxes) {
      drawAxesWithTicks(verticalAxes, !rotated && synchronizeMultiAxes, panesCanvases, panesBorderOptions);
      drawAxesWithTicks(horizontalAxes, rotated && synchronizeMultiAxes, panesCanvases, panesBorderOptions);
      performActionOnAxes(allAxes, 'prepareAnimation');

      that._renderScaleBreaks();

      horizontalAxes.forEach(a => a.resolveOverlappingForCustomPositioning(verticalAxes));
      verticalAxes.forEach(a => a.resolveOverlappingForCustomPositioning(horizontalAxes));
      return false;
    }

    if (needCustomAdjustAxes) {
      allAxes.forEach(a => a.customPositionIsAvailable() && a.shift({
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      }));
    }

    if (that._scrollBar) {
      that._scrollBar.setPane(that.panes);
    }

    var vAxesMargins = {
      panes: {}
    };
    var hAxesMargins = getHorizontalAxesMargins(horizontalElements, axis => axis.estimateMargins(panesCanvases[axis.pane]));
    panesCanvases = shrinkCanvases(rotated, panesCanvases, paneSizes, vAxesMargins, hAxesMargins);

    var drawAxesAndSetCanvases = isHorizontal => {
      var axes = isHorizontal ? horizontalAxes : verticalAxes;
      var condition = (isHorizontal ? rotated : !rotated) && synchronizeMultiAxes;
      drawAxesWithTicks(axes, condition, panesCanvases, panesBorderOptions);

      if (isHorizontal) {
        hAxesMargins = getHorizontalAxesMargins(horizontalElements, getAxisMargins);
      } else {
        vAxesMargins = getVerticalAxesMargins(verticalElements);
      }

      panesCanvases = shrinkCanvases(rotated, panesCanvases, paneSizes, vAxesMargins, hAxesMargins);
    };

    drawAxesAndSetCanvases(false);
    drawAxesAndSetCanvases(true);

    if (!that._changesApplying && that._estimateTickIntervals(verticalAxes, panesCanvases)) {
      drawAxesAndSetCanvases(false);
    }

    var oldTitlesWidth = calculateTitlesWidth(verticalAxes);

    var visibleSeries = that._getVisibleSeries();

    var pointsToAnimation = that._getPointsToAnimation(visibleSeries);

    var axesIsAnimated = axisAnimationEnabled(drawOptions, pointsToAnimation);
    performActionOnAxes(allElements, 'updateSize', panesCanvases, axesIsAnimated);
    horizontalElements.forEach(shiftAxis('top', 'bottom'));
    verticalElements.forEach(shiftAxis('left', 'right'));

    that._renderScaleBreaks();

    that.panes.forEach(function (pane) {
      _extend(pane.canvas, panesCanvases[pane.name]);
    });

    that._valueAxes.forEach(axis => {
      axis.setInitRange();
    });

    verticalAxes.forEach((axis, i) => {
      var _axis$hasWrap;

      if ((_axis$hasWrap = axis.hasWrap) !== null && _axis$hasWrap !== void 0 && _axis$hasWrap.call(axis)) {
        var title = axis.getTitle();
        var newTitleWidth = title ? title.bBox.width : 0;
        var offset = newTitleWidth - oldTitlesWidth[i];

        if (axis.getOptions().position === 'right') {
          vAxesMargins.right += offset;
        } else {
          vAxesMargins.left += offset;
          that.panes.forEach(_ref2 => {
            var {
              name
            } = _ref2;
            return vAxesMargins.panes[name].left += offset;
          });
        }

        panesCanvases = shrinkCanvases(rotated, panesCanvases, paneSizes, vAxesMargins, hAxesMargins);
        performActionOnAxes(allElements, 'updateSize', panesCanvases, false, false);
        oldTitlesWidth = calculateTitlesWidth(verticalAxes);
      }
    });

    if (verticalAxes.some(v => v.customPositionIsAvailable() && v.getCustomPosition() !== v._axisPosition)) {
      axesIsAnimated && that._resetAxesAnimation(verticalAxesFirstDrawing, false);
      performActionOnAxes(verticalAxes, 'updateSize', panesCanvases, axesIsAnimated);
    }

    horizontalAxes.forEach(a => a.resolveOverlappingForCustomPositioning(verticalAxes));
    verticalAxes.forEach(a => a.resolveOverlappingForCustomPositioning(horizontalAxes));
    return cleanPanesCanvases;
  },

  _getExtraTemplatesItems() {
    var that = this;
    var allAxes = (that._argumentAxes || []).concat(that._valueAxes || []);

    var elements = that._collectTemplatesFromItems(allAxes);

    return {
      items: elements.items,
      groups: elements.groups,

      launchRequest() {
        allAxes.forEach(function (a) {
          a.setRenderedState(true);
        });
      },

      doneRequest() {
        allAxes.forEach(function (a) {
          a.setRenderedState(false);
        });
      }

    };
  },

  _estimateTickIntervals(axes, canvases) {
    return axes.some(axis => axis.estimateTickInterval(canvases[axis.pane]));
  },

  checkForMoreSpaceForPanesCanvas() {
    var that = this;

    var rotated = that._isRotated();

    var panesAreCustomSized = that.panes.filter(p => p.unit).length === that.panes.length;
    var needSpace = false;

    if (panesAreCustomSized) {
      var needHorizontalSpace = 0;
      var needVerticalSpace = 0;

      if (rotated) {
        var argAxisRightMargin = that.getArgumentAxis().getMargins().right;
        var rightPanesIndent = Math.min.apply(Math, that.panes.map(p => p.canvas.right));
        needHorizontalSpace = that._canvas.right + argAxisRightMargin - rightPanesIndent;
      } else {
        var argAxisBottomMargin = that.getArgumentAxis().getMargins().bottom;
        var bottomPanesIndent = Math.min.apply(Math, that.panes.map(p => p.canvas.bottom));
        needVerticalSpace = that._canvas.bottom + argAxisBottomMargin - bottomPanesIndent;
      }

      needSpace = needHorizontalSpace > 0 || needVerticalSpace > 0 ? {
        width: needHorizontalSpace,
        height: needVerticalSpace
      } : false;

      if (needVerticalSpace !== 0) {
        var realSize = that.getSize();
        var customSize = that.option('size');
        var container = that._$element[0];
        var containerHasStyledHeight = !!parseInt(container.style.height) || that._containerInitialHeight !== 0;

        if (!rotated && !(customSize && customSize.height) && !containerHasStyledHeight) {
          that._forceResize(realSize.width, realSize.height + needVerticalSpace);

          needSpace = false;
        }
      }
    } else {
      needSpace = that.layoutManager.needMoreSpaceForPanesCanvas(that._getLayoutTargets(), rotated, pane => {
        return {
          width: rotated && !!pane.unit,
          height: !rotated && !!pane.unit
        };
      });
    }

    return needSpace;
  },

  _forceResize(width, height) {
    this._renderer.resize(width, height);

    this._updateSize();

    this._setContentSize();

    this._preserveOriginalCanvas();

    this._updateCanvasClipRect(this._canvas);
  },

  _shrinkAxes(sizeShortage, panesCanvases) {
    if (!sizeShortage || !panesCanvases) {
      return;
    }

    this._renderer.stopAllAnimations(true);

    var that = this;

    var rotated = that._isRotated();

    var scrollBar = that._scrollBar ? [that._scrollBar] : [];
    var extendedArgAxes = that._isArgumentAxisBeforeScrollBar() ? that._argumentAxes.concat(scrollBar) : scrollBar.concat(that._argumentAxes);
    var verticalAxes = rotated ? extendedArgAxes : that._valueAxes;
    var horizontalAxes = rotated ? that._valueAxes : extendedArgAxes;
    var allAxes = verticalAxes.concat(horizontalAxes);

    if (sizeShortage.width || sizeShortage.height) {
      checkUsedSpace(sizeShortage, 'height', horizontalAxes, getHorizontalAxesMargins);
      checkUsedSpace(sizeShortage, 'width', verticalAxes, getVerticalAxesMargins);
      performActionOnAxes(allAxes, 'updateSize', panesCanvases);
      var paneSizes = that.panes.reduce((sizes, pane) => {
        sizes[pane.name] = {
          height: pane.height,
          unit: pane.unit
        };
        return sizes;
      }, {});
      panesCanvases = shrinkCanvases(rotated, panesCanvases, paneSizes, getVerticalAxesMargins(verticalAxes), getHorizontalAxesMargins(horizontalAxes, getAxisMargins));
      performActionOnAxes(allAxes, 'updateSize', panesCanvases);
      horizontalAxes.forEach(shiftAxis('top', 'bottom'));
      verticalAxes.forEach(shiftAxis('left', 'right'));
      that.panes.forEach(pane => _extend(pane.canvas, panesCanvases[pane.name]));
    }
  },

  _isArgumentAxisBeforeScrollBar() {
    var that = this;
    var argumentAxis = that.getArgumentAxis();

    if (that._scrollBar) {
      var _argumentAxis$getOpti;

      var argAxisPosition = argumentAxis.getResolvedBoundaryPosition();
      var argAxisLabelPosition = (_argumentAxis$getOpti = argumentAxis.getOptions().label) === null || _argumentAxis$getOpti === void 0 ? void 0 : _argumentAxis$getOpti.position;

      var scrollBarPosition = that._scrollBar.getOptions().position;

      return argumentAxis.hasNonBoundaryPosition() || scrollBarPosition === argAxisPosition && argAxisLabelPosition !== scrollBarPosition;
    }

    return false;
  },

  _getPanesParameters: function _getPanesParameters() {
    var that = this;
    var panes = that.panes;
    var i;
    var params = [];

    for (i = 0; i < panes.length; i++) {
      if (that._getPaneBorderVisibility(i)) {
        params.push({
          coords: panes[i].borderCoords,
          clipRect: that._panesClipRects.fixed[i]
        });
      }
    }

    return params;
  },
  _createCrosshairCursor: function _createCrosshairCursor() {
    var that = this;
    var options = that._themeManager.getOptions('crosshair') || {};
    var argumentAxis = that.getArgumentAxis();
    var axes = !that._isRotated() ? [[argumentAxis], that._valueAxes] : [that._valueAxes, [argumentAxis]];
    var parameters = {
      canvas: that._getCommonCanvas(),
      panes: that._getPanesParameters(),
      axes: axes
    };

    if (!options || !options.enabled) {
      return;
    }

    if (!that._crosshair) {
      that._crosshair = new Crosshair(that._renderer, options, parameters, that._crosshairCursorGroup);
    } else {
      that._crosshair.update(options, parameters);
    }

    that._crosshair.render();
  },
  _getCommonCanvas: function _getCommonCanvas() {
    var i;
    var canvas;
    var commonCanvas;
    var panes = this.panes;

    for (i = 0; i < panes.length; i++) {
      canvas = panes[i].canvas;

      if (!commonCanvas) {
        // TODO
        commonCanvas = _extend({}, canvas);
      } else {
        commonCanvas.right = canvas.right;
        commonCanvas.bottom = canvas.bottom;
      }
    }

    return commonCanvas;
  },
  _createPanesBackground: function _createPanesBackground() {
    var that = this;

    var defaultBackgroundColor = that._themeManager.getOptions('commonPaneSettings').backgroundColor;

    var backgroundColor;
    var renderer = that._renderer;
    var rect;
    var i;
    var rects = [];

    that._panesBackgroundGroup.clear();

    for (i = 0; i < that.panes.length; i++) {
      backgroundColor = that.panes[i].backgroundColor || defaultBackgroundColor;

      if (!backgroundColor || backgroundColor === 'none') {
        rects.push(null);
        continue;
      }

      rect = renderer.rect(0, 0, 0, 0).attr({
        fill: backgroundColor,
        'stroke-width': 0
      }).append(that._panesBackgroundGroup);
      rects.push(rect);
    }

    that.panesBackground = rects;
  },
  _fillPanesBackground: function _fillPanesBackground() {
    var that = this;
    var bc;

    _each(that.panes, function (i, pane) {
      bc = pane.borderCoords;

      if (that.panesBackground[i] !== null) {
        that.panesBackground[i].attr({
          x: bc.left,
          y: bc.top,
          width: bc.width,
          height: bc.height
        });
      }
    });
  },
  _calcPaneBorderCoords: function _calcPaneBorderCoords(pane) {
    var canvas = pane.canvas;
    var bc = pane.borderCoords = pane.borderCoords || {};
    bc.left = canvas.left;
    bc.top = canvas.top;
    bc.right = canvas.width - canvas.right;
    bc.bottom = canvas.height - canvas.bottom;
    bc.width = Math.max(bc.right - bc.left, 0);
    bc.height = Math.max(bc.bottom - bc.top, 0);
  },
  _drawPanesBorders: function _drawPanesBorders(panesBorderOptions) {
    var that = this;

    var rotated = that._isRotated();

    that._panesBorderGroup.linkRemove().clear();

    _each(that.panes, function (i, pane) {
      var borderOptions = panesBorderOptions[pane.name];
      var attr = {
        fill: 'none',
        stroke: borderOptions.color,
        'stroke-opacity': borderOptions.opacity,
        'stroke-width': borderOptions.width,
        dashStyle: borderOptions.dashStyle,
        'stroke-linecap': 'square'
      };

      that._calcPaneBorderCoords(pane, rotated);

      if (!borderOptions.visible) {
        return;
      }

      var bc = pane.borderCoords;
      var segmentRectParams = prepareSegmentRectPoints(bc.left, bc.top, bc.width, bc.height, borderOptions);

      that._renderer.path(segmentRectParams.points, segmentRectParams.pathType).attr(attr).append(that._panesBorderGroup);
    });

    that._panesBorderGroup.linkAppend();
  },
  _createClipRect: function _createClipRect(clipArray, index, left, top, width, height) {
    var that = this;
    var clipRect = clipArray[index];

    if (!clipRect) {
      clipRect = that._renderer.clipRect(left, top, width, height);
      clipArray[index] = clipRect;
    } else {
      clipRect.attr({
        x: left,
        y: top,
        width: width,
        height: height
      });
    }
  },
  _createClipRectsForPanes: function _createClipRectsForPanes() {
    var that = this;
    var canvas = that._canvas;

    _each(that.panes, function (i, pane) {
      var needWideClipRect = false;
      var bc = pane.borderCoords;
      var left = bc.left;
      var top = bc.top;
      var width = bc.width;
      var height = bc.height;
      var panesClipRects = that._panesClipRects;

      that._createClipRect(panesClipRects.fixed, i, left, top, width, height);

      that._createClipRect(panesClipRects.base, i, left, top, width, height);

      _each(that.series, function (_, series) {
        if (series.pane === pane.name && (series.isFinancialSeries() || series.areErrorBarsVisible())) {
          needWideClipRect = true;
        }
      });

      if (needWideClipRect) {
        if (that._isRotated()) {
          top = 0;
          height = canvas.height;
        } else {
          left = 0;
          width = canvas.width;
        }

        that._createClipRect(panesClipRects.wide, i, left, top, width, height);
      } else {
        panesClipRects.wide[i] = null;
      }
    });
  },

  _applyClipRectsForAxes() {
    var that = this;

    var axes = that._getAllAxes();

    var chartCanvasClipRectID = that._getCanvasClipRectID();

    for (var i = 0; i < axes.length; i++) {
      var elementsClipRectID = that._getElementsClipRectID(axes[i].pane);

      axes[i].applyClipRects(elementsClipRectID, chartCanvasClipRectID);
    }
  },

  _getPaneBorderVisibility: function _getPaneBorderVisibility(paneIndex) {
    var commonPaneBorderVisible = this._themeManager.getOptions('commonPaneSettings').border.visible;

    var pane = this.panes[paneIndex] || {};
    var paneBorder = pane.border || {};
    return 'visible' in paneBorder ? paneBorder.visible : commonPaneBorderVisible;
  },
  _getCanvasForPane: function _getCanvasForPane(paneName) {
    var panes = this.panes;
    var panesNumber = panes.length;
    var i;

    for (i = 0; i < panesNumber; i++) {
      if (panes[i].name === paneName) {
        return panes[i].canvas;
      }
    }
  },
  _getTrackerSettings: function _getTrackerSettings() {
    var that = this;
    var themeManager = that._themeManager;
    return _extend(this.callBase(), {
      chart: that,
      rotated: that._isRotated(),
      crosshair: that._getCrosshairOptions().enabled ? that._crosshair : null,
      stickyHovering: themeManager.getOptions('stickyHovering')
    });
  },
  _resolveLabelOverlappingStack: function _resolveLabelOverlappingStack() {
    var that = this;

    var isRotated = that._isRotated();

    var shiftDirection = isRotated ? function (box, length) {
      return {
        x: box.x - length,
        y: box.y
      };
    } : function (box, length) {
      return {
        x: box.x,
        y: box.y - length
      };
    };

    _each(that._getStackPoints(), function (_, stacks) {
      _each(stacks, function (_, points) {
        var isInverted = points[0].series.getValueAxis().getOptions().inverted;
        overlapping.resolveLabelOverlappingInOneDirection(points, that._getCommonCanvas(), isRotated, isInverted, shiftDirection, (a, b) => {
          var coordPosition = isRotated ? 1 : 0;
          var figureCenter1 = a.labels[0].getFigureCenter()[coordPosition];
          var figureCenter12 = b.labels[0].getFigureCenter()[coordPosition];

          if (figureCenter1 - figureCenter12 === 0) {
            return (a.value() - b.value()) * (a.labels[0].getPoint().series.getValueAxis().getTranslator().isInverted() ? -1 : 1);
          }

          return 0;
        });
      });
    });
  },
  _getStackPoints: function _getStackPoints() {
    var stackPoints = {};

    var visibleSeries = this._getVisibleSeries();

    _each(visibleSeries, function (_, singleSeries) {
      var points = singleSeries.getPoints();
      var stackName = singleSeries.getStackName() || null;

      _each(points, function (_, point) {
        var argument = point.argument;

        if (!stackPoints[argument]) {
          stackPoints[argument] = {};
        }

        if (!stackPoints[argument][stackName]) {
          stackPoints[argument][stackName] = [];
        }

        stackPoints[argument][stackName].push(point);
      });
    });

    return stackPoints;
  },
  _getCrosshairOptions: function _getCrosshairOptions() {
    return this._getOption('crosshair');
  },

  // API
  zoomArgument(min, max) {
    var that = this;

    if (!that._initialized || !_isDefined(min) && !_isDefined(max)) {
      return;
    }

    that.getArgumentAxis().visualRange([min, max]);
  },

  resetVisualRange() {
    var that = this;
    var axes = that._argumentAxes;
    var nonVirtualArgumentAxis = that.getArgumentAxis();
    axes.forEach(axis => {
      axis.resetVisualRange(nonVirtualArgumentAxis !== axis);

      that._applyCustomVisualRangeOption(axis);
    });
    that.callBase();
  },

  // T218011 for dashboards
  getVisibleArgumentBounds: function getVisibleArgumentBounds() {
    var translator = this._argumentAxes[0].getTranslator();

    var range = translator.getBusinessRange();
    var isDiscrete = range.axisType === DISCRETE;
    var categories = range.categories;
    return {
      minVisible: isDiscrete ? range.minVisible || categories[0] : range.minVisible,
      maxVisible: isDiscrete ? range.maxVisible || categories[categories.length - 1] : range.maxVisible
    };
  },

  _change_FULL_RENDER() {
    this.callBase();

    if (this._changes.has(VISUAL_RANGE)) {
      this._raiseZoomEndHandlers();
    }
  },

  _getAxesForScaling() {
    return [this.getArgumentAxis()].concat(this._valueAxes);
  },

  _applyVisualRangeByVirtualAxes(axis, range) {
    var that = this;

    if (axis.isArgumentAxis) {
      if (axis !== that.getArgumentAxis()) {
        return true;
      }

      that._argumentAxes.filter(a => a !== axis).forEach(a => a.visualRange(range, {
        start: true,
        end: true
      }));
    }

    return false;
  },

  _raiseZoomEndHandlers() {
    this._argumentAxes.forEach(axis => axis.handleZoomEnd());

    this.callBase();
  },

  _setOptionsByReference() {
    this.callBase();

    _extend(this._optionsByReference, {
      'argumentAxis.visualRange': true
    });
  },

  option() {
    var option = this.callBase.apply(this, arguments);

    var valueAxis = this._options.silent('valueAxis');

    if (type(valueAxis) === 'array') {
      for (var i = 0; i < valueAxis.length; i++) {
        var optionPath = "valueAxis[".concat(i, "].visualRange");
        this._optionsByReference[optionPath] = true;
      }
    }

    return option;
  },

  _notifyVisualRange() {
    var that = this;
    var argAxis = that._argumentAxes[0];
    var argumentVisualRange = convertVisualRangeObject(argAxis.visualRange(), !_isArray(that.option('argumentAxis.visualRange')));

    if (!argAxis.skipEventRising || !rangesAreEqual(argumentVisualRange, that.option('argumentAxis.visualRange'))) {
      that.option('argumentAxis.visualRange', argumentVisualRange);
    } else {
      argAxis.skipEventRising = null;
    }

    that.callBase();
  }

});
import shutterZoom from './chart_components/shutter_zoom';
import zoomAndPan from './chart_components/zoom_and_pan';
import { plugins } from './core/annotations';
dxChart.addPlugin(shutterZoom);
dxChart.addPlugin(zoomAndPan);
dxChart.addPlugin(plugins.core);
dxChart.addPlugin(plugins.chart);
registerComponent('dxChart', dxChart);
export default dxChart;