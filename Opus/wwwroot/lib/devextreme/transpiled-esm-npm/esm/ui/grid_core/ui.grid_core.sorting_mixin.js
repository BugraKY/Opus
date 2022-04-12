import { isDefined } from '../../core/utils/type';
import $ from '../../core/renderer';
var SORT_CLASS = 'dx-sort';
var SORT_NONE_CLASS = 'dx-sort-none';
var SORTUP_CLASS = 'dx-sort-up';
var SORTDOWN_CLASS = 'dx-sort-down';
var SORT_INDEX_CLASS = 'dx-sort-index';
var SORT_INDEX_ICON_CLASS = 'dx-sort-index-icon';
var HEADERS_ACTION_CLASS = 'action';
export default {
  _applyColumnState: function _applyColumnState(options) {
    var that = this;
    var ariaSortState;
    var $sortIndicator;
    var sortingMode = that.option('sorting.mode');
    var rootElement = options.rootElement;
    var column = options.column;

    var $indicatorsContainer = that._getIndicatorContainer(rootElement);

    if (options.name === 'sort') {
      rootElement.find('.' + SORT_CLASS).remove();
      !$indicatorsContainer.children().length && $indicatorsContainer.remove();
      var isSortingAllowed = sortingMode !== 'none' && column.allowSorting;

      if (!isDefined(column.groupIndex) && (isSortingAllowed || isDefined(column.sortOrder))) {
        ariaSortState = column.sortOrder === 'asc' ? 'ascending' : 'descending';
        $sortIndicator = that.callBase(options).toggleClass(SORTUP_CLASS, column.sortOrder === 'asc').toggleClass(SORTDOWN_CLASS, column.sortOrder === 'desc');
        var hasSeveralSortIndexes = that.getController && !!that.getController('columns').columnOption('sortIndex:1');

        if (hasSeveralSortIndexes && that.option('sorting.showSortIndexes') && column.sortIndex >= 0) {
          $('<span>').addClass(SORT_INDEX_ICON_CLASS).text(column.sortIndex + 1).appendTo($sortIndicator);
          $sortIndicator.addClass(SORT_INDEX_CLASS);
        }

        if (isSortingAllowed) {
          options.rootElement.addClass(that.addWidgetPrefix(HEADERS_ACTION_CLASS));
        }
      }

      if (!isDefined(column.sortOrder)) {
        that.setAria('sort', 'none', rootElement);
      } else {
        that.setAria('sort', ariaSortState, rootElement);
      }

      return $sortIndicator;
    } else {
      return that.callBase(options);
    }
  },
  _getIndicatorClassName: function _getIndicatorClassName(name) {
    if (name === 'sort') {
      return SORT_CLASS;
    } else if (name === 'sortIndex') {
      return SORT_INDEX_ICON_CLASS;
    }

    return this.callBase(name);
  },
  _renderIndicator: function _renderIndicator(options) {
    var column = options.column;
    var $container = options.container;
    var $indicator = options.indicator;

    if (options.name === 'sort') {
      var rtlEnabled = this.option('rtlEnabled');

      if (!isDefined(column.sortOrder)) {
        $indicator && $indicator.addClass(SORT_NONE_CLASS);
      }

      if ($container.children().length && (!rtlEnabled && options.columnAlignment === 'left' || rtlEnabled && options.columnAlignment === 'right')) {
        $container.prepend($indicator);
        return;
      }
    }

    this.callBase(options);
  },
  _updateIndicator: function _updateIndicator($cell, column, indicatorName) {
    if (indicatorName === 'sort' && isDefined(column.groupIndex)) {
      return;
    }

    return this.callBase.apply(this, arguments);
  },
  _getIndicatorElements: function _getIndicatorElements($cell, returnAll) {
    var $indicatorElements = this.callBase($cell);
    return returnAll ? $indicatorElements : $indicatorElements && $indicatorElements.not('.' + SORT_NONE_CLASS);
  }
};