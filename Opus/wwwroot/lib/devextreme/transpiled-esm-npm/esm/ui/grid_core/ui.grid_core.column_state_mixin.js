import $ from '../../core/renderer';
import { noop } from '../../core/utils/common';
import { extend } from '../../core/utils/extend';
import { getDefaultAlignment } from '../../core/utils/position';
var COLUMN_INDICATORS_CLASS = 'dx-column-indicators';
var GROUP_PANEL_ITEM_CLASS = 'dx-group-panel-item';
export default {
  _applyColumnState: function _applyColumnState(options) {
    var _that$component;

    var that = this;
    var rtlEnabled = this.option('rtlEnabled');

    var columnAlignment = that._getColumnAlignment(options.column.alignment, rtlEnabled);

    var parameters = extend(true, {
      columnAlignment: columnAlignment
    }, options);
    var isGroupPanelItem = parameters.rootElement.hasClass(GROUP_PANEL_ITEM_CLASS);

    var $indicatorsContainer = that._createIndicatorContainer(parameters, isGroupPanelItem);

    var $span = $('<span>').addClass(that._getIndicatorClassName(options.name));
    var columnsController = (_that$component = that.component) === null || _that$component === void 0 ? void 0 : _that$component.getController('columns');
    var indicatorAlignment = (columnsController === null || columnsController === void 0 ? void 0 : columnsController.getHeaderContentAlignment(columnAlignment)) || columnAlignment;
    parameters.container = $indicatorsContainer;
    parameters.indicator = $span;

    that._renderIndicator(parameters);

    $indicatorsContainer[(isGroupPanelItem || !options.showColumnLines) && indicatorAlignment === 'left' ? 'appendTo' : 'prependTo'](options.rootElement);
    return $span;
  },
  _getIndicatorClassName: noop,
  _getColumnAlignment: function _getColumnAlignment(alignment, rtlEnabled) {
    rtlEnabled = rtlEnabled || this.option('rtlEnabled');
    return alignment && alignment !== 'center' ? alignment : getDefaultAlignment(rtlEnabled);
  },
  _createIndicatorContainer: function _createIndicatorContainer(options, ignoreIndicatorAlignment) {
    var $indicatorsContainer = this._getIndicatorContainer(options.rootElement);

    var indicatorAlignment = options.columnAlignment === 'left' ? 'right' : 'left';

    if (!$indicatorsContainer.length) {
      $indicatorsContainer = $('<div>').addClass(COLUMN_INDICATORS_CLASS);
    }

    this.setAria('role', 'presentation', $indicatorsContainer);
    return $indicatorsContainer.css('float', options.showColumnLines && !ignoreIndicatorAlignment ? indicatorAlignment : null);
  },
  _getIndicatorContainer: function _getIndicatorContainer($cell) {
    return $cell && $cell.find('.' + COLUMN_INDICATORS_CLASS);
  },
  _getIndicatorElements: function _getIndicatorElements($cell) {
    var $indicatorContainer = this._getIndicatorContainer($cell);

    return $indicatorContainer && $indicatorContainer.children();
  },
  _renderIndicator: function _renderIndicator(options) {
    var $container = options.container;
    var $indicator = options.indicator;
    $container && $indicator && $container.append($indicator);
  },
  _updateIndicators: function _updateIndicators(indicatorName) {
    var that = this;
    var columns = that.getColumns();
    var $cells = that.getColumnElements();
    var $cell;
    if (!$cells || columns.length !== $cells.length) return;

    for (var i = 0; i < columns.length; i++) {
      $cell = $cells.eq(i);

      that._updateIndicator($cell, columns[i], indicatorName);

      var rowOptions = $cell.parent().data('options');

      if (rowOptions && rowOptions.cells) {
        rowOptions.cells[$cell.index()].column = columns[i];
      }
    }
  },
  _updateIndicator: function _updateIndicator($cell, column, indicatorName) {
    if (!column.command) {
      return this._applyColumnState({
        name: indicatorName,
        rootElement: $cell,
        column: column,
        showColumnLines: this.option('showColumnLines')
      });
    }
  }
};