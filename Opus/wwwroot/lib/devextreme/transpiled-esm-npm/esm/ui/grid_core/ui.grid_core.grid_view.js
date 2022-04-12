import { getOuterWidth, getInnerWidth, getWidth, getHeight, setHeight } from '../../core/utils/size';
import $ from '../../core/renderer';
import modules from './ui.grid_core.modules';
import { deferRender, deferUpdate } from '../../core/utils/common';
import { hasWindow, getWindow } from '../../core/utils/window';
import { each } from '../../core/utils/iterator';
import { isString, isDefined, isNumeric } from '../../core/utils/type';
import { getBoundingRect } from '../../core/utils/position';
import gridCoreUtils from './ui.grid_core.utils';
import messageLocalization from '../../localization/message';
import { when, Deferred } from '../../core/utils/deferred';
import domAdapter from '../../core/dom_adapter';
import * as accessibility from '../shared/accessibility';
import browser from '../../core/utils/browser';
var BORDERS_CLASS = 'borders';
var TABLE_FIXED_CLASS = 'table-fixed';
var IMPORTANT_MARGIN_CLASS = 'important-margin';
var GRIDBASE_CONTAINER_CLASS = 'dx-gridbase-container';
var HIDDEN_COLUMNS_WIDTH = 'adaptiveHidden';
var VIEW_NAMES = ['columnsSeparatorView', 'blockSeparatorView', 'trackerView', 'headerPanel', 'columnHeadersView', 'rowsView', 'footerView', 'columnChooserView', 'filterPanelView', 'pagerView', 'draggingHeaderView', 'contextMenuView', 'errorView', 'headerFilterView', 'filterBuilderView'];

var isPercentWidth = function isPercentWidth(width) {
  return isString(width) && width.slice(-1) === '%';
};

var isPixelWidth = function isPixelWidth(width) {
  return isString(width) && width.slice(-2) === 'px';
};

var getContainerHeight = function getContainerHeight($container) {
  var clientHeight = $container.get(0).clientHeight;
  var paddingTop = parseFloat($container.css('paddingTop'));
  var paddingBottom = parseFloat($container.css('paddingBottom'));
  return clientHeight - paddingTop - paddingBottom;
};

var calculateFreeWidth = function calculateFreeWidth(that, widths) {
  var contentWidth = that._rowsView.contentWidth();

  var totalWidth = that._getTotalWidth(widths, contentWidth);

  return contentWidth - totalWidth;
};

var calculateFreeWidthWithCurrentMinWidth = function calculateFreeWidthWithCurrentMinWidth(that, columnIndex, currentMinWidth, widths) {
  return calculateFreeWidth(that, widths.map(function (width, index) {
    return index === columnIndex ? currentMinWidth : width;
  }));
};

var restoreFocus = function restoreFocus(focusedElement, selectionRange) {
  accessibility.hiddenFocus(focusedElement);
  gridCoreUtils.setSelectionRange(focusedElement, selectionRange);
};

var ResizingController = modules.ViewController.inherit({
  _initPostRenderHandlers: function _initPostRenderHandlers() {
    var dataController = this._dataController;

    if (!this._refreshSizesHandler) {
      this._refreshSizesHandler = e => {
        dataController.changed.remove(this._refreshSizesHandler);
        var templateDeferreds = e && e.templateDeferreds || [];
        when.apply(this, templateDeferreds).done(() => {
          this._refreshSizes(e);
        });
      }; // TODO remove resubscribing


      dataController.changed.add(() => {
        dataController.changed.add(this._refreshSizesHandler);
      });
    }
  },
  _refreshSizes: function _refreshSizes(e) {
    var resizeDeferred;
    var that = this;
    var changeType = e && e.changeType;
    var isDelayed = e && e.isDelayed;

    var items = that._dataController.items();

    if (!e || changeType === 'refresh' || changeType === 'prepend' || changeType === 'append') {
      if (!isDelayed) {
        resizeDeferred = that.resize();
      }
    } else if (changeType === 'update') {
      var _e$changeTypes;

      if (((_e$changeTypes = e.changeTypes) === null || _e$changeTypes === void 0 ? void 0 : _e$changeTypes.length) === 0) {
        return;
      }

      if ((items.length > 1 || e.changeTypes[0] !== 'insert') && !(items.length === 0 && e.changeTypes[0] === 'remove') && !e.needUpdateDimensions) {
        deferUpdate(() => deferRender(() => deferUpdate(() => {
          that._setScrollerSpacing(that._hasHeight);

          that._rowsView.resize();
        })));
      } else {
        resizeDeferred = that.resize();
      }
    }

    if (changeType && changeType !== 'updateSelection' && changeType !== 'updateFocusedRow' && changeType !== 'pageIndex' && !isDelayed) {
      when(resizeDeferred).done(function () {
        that._setAriaRowColCount();

        that.fireContentReadyAction();
      });
    }
  },
  fireContentReadyAction: function fireContentReadyAction() {
    this.component._fireContentReadyAction();
  },
  _setAriaRowColCount: function _setAriaRowColCount() {
    var component = this.component;
    component.setAria({
      'rowCount': this._dataController.totalItemsCount(),
      'colCount': component.columnCount()
    }, component.$element().children('.' + GRIDBASE_CONTAINER_CLASS));
  },
  _getBestFitWidths: function _getBestFitWidths() {
    var _widths;

    var rowsView = this._rowsView;
    var columnHeadersView = this._columnHeadersView;
    var widths = rowsView.getColumnWidths();

    if (!((_widths = widths) !== null && _widths !== void 0 && _widths.length)) {
      var _rowsView$getTableEle;

      var headersTableElement = columnHeadersView.getTableElement();
      columnHeadersView.setTableElement((_rowsView$getTableEle = rowsView.getTableElement()) === null || _rowsView$getTableEle === void 0 ? void 0 : _rowsView$getTableEle.children('.dx-header'));
      widths = columnHeadersView.getColumnWidths();
      columnHeadersView.setTableElement(headersTableElement);
    }

    return widths;
  },
  _setVisibleWidths: function _setVisibleWidths(visibleColumns, widths) {
    var columnsController = this._columnsController;
    columnsController.beginUpdate();
    each(visibleColumns, function (index, column) {
      var columnId = columnsController.getColumnId(column);
      columnsController.columnOption(columnId, 'visibleWidth', widths[index]);
    });
    columnsController.endUpdate();
  },
  _toggleBestFitModeForView: function _toggleBestFitModeForView(view, className, isBestFit) {
    if (!view || !view.isVisible()) return;

    var $rowsTables = this._rowsView.getTableElements();

    var $viewTables = view.getTableElements();
    each($rowsTables, (index, tableElement) => {
      var $tableBody;
      var $rowsTable = $(tableElement);
      var $viewTable = $viewTables.eq(index);

      if ($viewTable && $viewTable.length) {
        if (isBestFit) {
          $tableBody = $viewTable.children('tbody').appendTo($rowsTable);
        } else {
          $tableBody = $rowsTable.children('.' + className).appendTo($viewTable);
        }

        $tableBody.toggleClass(className, isBestFit);
        $tableBody.toggleClass(this.addWidgetPrefix('best-fit'), isBestFit);
      }
    });
  },
  _toggleBestFitMode: function _toggleBestFitMode(isBestFit) {
    var $rowsTable = this._rowsView.getTableElement();

    var $rowsFixedTable = this._rowsView.getTableElements().eq(1);

    if (!$rowsTable) return;
    $rowsTable.css('tableLayout', isBestFit ? 'auto' : 'fixed');
    $rowsTable.children('colgroup').css('display', isBestFit ? 'none' : '');
    $rowsFixedTable.toggleClass(this.addWidgetPrefix(TABLE_FIXED_CLASS), !isBestFit);

    this._toggleBestFitModeForView(this._columnHeadersView, 'dx-header', isBestFit);

    this._toggleBestFitModeForView(this._footerView, 'dx-footer', isBestFit);

    this._toggleContentMinHeight(isBestFit); // T1047239


    if (this._needStretch()) {
      $rowsTable.get(0).style.width = isBestFit ? 'auto' : '';
    }
  },
  _toggleContentMinHeight: function _toggleContentMinHeight(isBestFit) {
    if (this.option('wordWrapEnabled')) {
      var scrollable = this._rowsView.getScrollable();

      var $contentElement = this._rowsView._findContentElement();

      if ((scrollable === null || scrollable === void 0 ? void 0 : scrollable.option('useNative')) === false) {
        $contentElement.css({
          minHeight: isBestFit ? gridCoreUtils.getContentHeightLimit(browser) : ''
        });
      }
    }
  },
  _synchronizeColumns: function _synchronizeColumns() {
    var columnsController = this._columnsController;
    var visibleColumns = columnsController.getVisibleColumns();
    var columnAutoWidth = this.option('columnAutoWidth');

    var needBestFit = this._needBestFit();

    var hasMinWidth = false;
    var resetBestFitMode;
    var isColumnWidthsCorrected = false;
    var resultWidths = [];
    var focusedElement;
    var selectionRange;

    var normalizeWidthsByExpandColumns = function normalizeWidthsByExpandColumns() {
      var expandColumnWidth;
      each(visibleColumns, function (index, column) {
        if (column.type === 'groupExpand') {
          expandColumnWidth = resultWidths[index];
        }
      });
      each(visibleColumns, function (index, column) {
        if (column.type === 'groupExpand' && expandColumnWidth) {
          resultWidths[index] = expandColumnWidth;
        }
      });
    };

    !needBestFit && each(visibleColumns, function (index, column) {
      if (column.width === 'auto') {
        needBestFit = true;
        return false;
      }
    });
    each(visibleColumns, function (index, column) {
      if (column.minWidth) {
        hasMinWidth = true;
        return false;
      }
    });

    this._setVisibleWidths(visibleColumns, []);

    if (needBestFit) {
      focusedElement = domAdapter.getActiveElement();
      selectionRange = gridCoreUtils.getSelectionRange(focusedElement);

      this._toggleBestFitMode(true);

      resetBestFitMode = true;
    }

    var $element = this.component.$element();

    if ($element && $element[0] && this._maxWidth) {
      delete this._maxWidth;
      $element[0].style.maxWidth = '';
    }

    deferUpdate(() => {
      if (needBestFit) {
        resultWidths = this._getBestFitWidths();
        each(visibleColumns, function (index, column) {
          var columnId = columnsController.getColumnId(column);
          columnsController.columnOption(columnId, 'bestFitWidth', resultWidths[index], true);
        });
      } else if (hasMinWidth) {
        resultWidths = this._getBestFitWidths();
      }

      each(visibleColumns, function (index) {
        var width = this.width;

        if (width !== 'auto') {
          if (isDefined(width)) {
            resultWidths[index] = isNumeric(width) || isPixelWidth(width) ? parseFloat(width) : width;
          } else if (!columnAutoWidth) {
            resultWidths[index] = undefined;
          }
        }
      });

      if (resetBestFitMode) {
        this._toggleBestFitMode(false);

        resetBestFitMode = false;

        if (focusedElement && focusedElement !== domAdapter.getActiveElement()) {
          var isFocusOutsideWindow = getBoundingRect(focusedElement).bottom < 0;

          if (!isFocusOutsideWindow) {
            restoreFocus(focusedElement, selectionRange);
          }
        }
      }

      isColumnWidthsCorrected = this._correctColumnWidths(resultWidths, visibleColumns);

      if (columnAutoWidth) {
        normalizeWidthsByExpandColumns();

        if (this._needStretch()) {
          this._processStretch(resultWidths, visibleColumns);
        }
      }

      deferRender(() => {
        if (needBestFit || isColumnWidthsCorrected) {
          this._setVisibleWidths(visibleColumns, resultWidths);
        }
      });
    });
  },
  _needBestFit: function _needBestFit() {
    return this.option('columnAutoWidth');
  },
  _needStretch: function _needStretch() {
    return this._columnsController.getVisibleColumns().some(c => c.width === 'auto' && !c.command);
  },
  _getAverageColumnsWidth: function _getAverageColumnsWidth(resultWidths) {
    var freeWidth = calculateFreeWidth(this, resultWidths);
    var columnCountWithoutWidth = resultWidths.filter(function (width) {
      return width === undefined;
    }).length;
    return freeWidth / columnCountWithoutWidth;
  },
  _correctColumnWidths: function _correctColumnWidths(resultWidths, visibleColumns) {
    var that = this;
    var i;
    var hasPercentWidth = false;
    var hasAutoWidth = false;
    var isColumnWidthsCorrected = false;
    var $element = that.component.$element();
    var hasWidth = that._hasWidth;

    var _loop = function _loop() {
      var index = i;
      var column = visibleColumns[index];
      var isHiddenColumn = resultWidths[index] === HIDDEN_COLUMNS_WIDTH;
      var width = resultWidths[index];
      var minWidth = column.minWidth;

      if (minWidth) {
        if (width === undefined) {
          var averageColumnsWidth = that._getAverageColumnsWidth(resultWidths);

          width = averageColumnsWidth;
        } else if (isPercentWidth(width)) {
          var freeWidth = calculateFreeWidthWithCurrentMinWidth(that, index, minWidth, resultWidths);

          if (freeWidth < 0) {
            width = -1;
          }
        }
      }

      var realColumnWidth = that._getRealColumnWidth(index, resultWidths.map(function (columnWidth, columnIndex) {
        return index === columnIndex ? width : columnWidth;
      }));

      if (minWidth && !isHiddenColumn && realColumnWidth < minWidth) {
        resultWidths[index] = minWidth;
        isColumnWidthsCorrected = true;
        i = -1;
      }

      if (!isDefined(column.width)) {
        hasAutoWidth = true;
      }

      if (isPercentWidth(column.width)) {
        hasPercentWidth = true;
      }
    };

    for (i = 0; i < visibleColumns.length; i++) {
      _loop();
    }

    if (!hasAutoWidth && resultWidths.length) {
      var $rowsViewElement = that._rowsView.element();

      var contentWidth = that._rowsView.contentWidth();

      var scrollbarWidth = that._rowsView.getScrollbarWidth();

      var totalWidth = that._getTotalWidth(resultWidths, contentWidth);

      if (totalWidth < contentWidth) {
        var lastColumnIndex = gridCoreUtils.getLastResizableColumnIndex(visibleColumns, resultWidths);

        if (lastColumnIndex >= 0) {
          resultWidths[lastColumnIndex] = 'auto';
          isColumnWidthsCorrected = true;

          if (hasWidth === false && !hasPercentWidth) {
            var borderWidth = that.option('showBorders') ? Math.ceil(getOuterWidth($rowsViewElement) - getInnerWidth($rowsViewElement)) : 0;
            that._maxWidth = totalWidth + scrollbarWidth + borderWidth;
            $element.css('maxWidth', that._maxWidth);
          }
        }
      }
    }

    return isColumnWidthsCorrected;
  },
  _processStretch: function _processStretch(resultSizes, visibleColumns) {
    var groupSize = this._rowsView.contentWidth();

    var tableSize = this._getTotalWidth(resultSizes, groupSize);

    var unusedIndexes = {
      length: 0
    };
    if (!resultSizes.length) return;
    each(visibleColumns, function (index) {
      if (this.width || resultSizes[index] === HIDDEN_COLUMNS_WIDTH) {
        unusedIndexes[index] = true;
        unusedIndexes.length++;
      }
    });
    var diff = groupSize - tableSize;
    var diffElement = Math.floor(diff / (resultSizes.length - unusedIndexes.length));
    var onePixelElementsCount = diff - diffElement * (resultSizes.length - unusedIndexes.length);

    if (diff >= 0) {
      for (var i = 0; i < resultSizes.length; i++) {
        if (unusedIndexes[i]) {
          continue;
        }

        resultSizes[i] += diffElement;

        if (onePixelElementsCount > 0) {
          if (onePixelElementsCount < 1) {
            resultSizes[i] += onePixelElementsCount;
            onePixelElementsCount = 0;
          } else {
            resultSizes[i]++;
            onePixelElementsCount--;
          }
        }
      }
    }
  },
  _getRealColumnWidth: function _getRealColumnWidth(columnIndex, columnWidths, groupWidth) {
    var ratio = 1;
    var width = columnWidths[columnIndex];

    if (!isPercentWidth(width)) {
      return parseFloat(width);
    }

    var percentTotalWidth = columnWidths.reduce((sum, width, index) => {
      if (!isPercentWidth(width)) {
        return sum;
      }

      return sum + parseFloat(width);
    }, 0);
    var pixelTotalWidth = columnWidths.reduce((sum, width) => {
      if (!width || width === HIDDEN_COLUMNS_WIDTH || isPercentWidth(width)) {
        return sum;
      }

      return sum + parseFloat(width);
    }, 0);
    groupWidth = groupWidth || this._rowsView.contentWidth();
    var freeSpace = groupWidth - pixelTotalWidth;
    var percentTotalWidthInPixel = percentTotalWidth * groupWidth / 100;

    if (pixelTotalWidth > 0 && percentTotalWidthInPixel + pixelTotalWidth >= groupWidth) {
      ratio = percentTotalWidthInPixel > freeSpace ? freeSpace / percentTotalWidthInPixel : 1;
    }

    return parseFloat(width) * groupWidth * ratio / 100;
  },
  _getTotalWidth: function _getTotalWidth(widths, groupWidth) {
    var result = 0;

    for (var i = 0; i < widths.length; i++) {
      var width = widths[i];

      if (width && width !== HIDDEN_COLUMNS_WIDTH) {
        result += this._getRealColumnWidth(i, widths, groupWidth);
      }
    }

    return Math.ceil(result);
  },
  updateSize: function updateSize(rootElement) {
    var that = this;
    var $groupElement;
    var width;
    var $rootElement = $(rootElement);
    var importantMarginClass = that.addWidgetPrefix(IMPORTANT_MARGIN_CLASS);

    if (that._hasHeight === undefined && $rootElement && $rootElement.is(':visible') && getWidth($rootElement)) {
      $groupElement = $rootElement.children('.' + that.getWidgetContainerClass());

      if ($groupElement.length) {
        $groupElement.detach();
      }

      that._hasHeight = !!getContainerHeight($rootElement);
      width = getWidth($rootElement);
      $rootElement.addClass(importantMarginClass);
      that._hasWidth = getWidth($rootElement) === width;
      $rootElement.removeClass(importantMarginClass);

      if ($groupElement.length) {
        $groupElement.appendTo($rootElement);
      }
    }
  },
  publicMethods: function publicMethods() {
    return ['resize', 'updateDimensions'];
  },
  resize: function resize() {
    return !this.component._requireResize && this.updateDimensions();
  },
  updateDimensions: function updateDimensions(checkSize) {
    var that = this;

    that._initPostRenderHandlers(); // T335767


    if (!that._checkSize(checkSize)) {
      return;
    }

    var prevResult = that._resizeDeferred;
    var result = that._resizeDeferred = new Deferred();
    when(prevResult).always(function () {
      deferRender(function () {
        if (that._dataController.isLoaded()) {
          that._synchronizeColumns();
        } // IE11


        that._resetGroupElementHeight();

        deferUpdate(function () {
          deferRender(function () {
            deferUpdate(function () {
              that._updateDimensionsCore();
            });
          });
        });
      }).done(result.resolve).fail(result.reject);
    });
    return result.promise();
  },
  _resetGroupElementHeight: function _resetGroupElementHeight() {
    var groupElement = this.component.$element().children().get(0);

    var scrollable = this._rowsView.getScrollable();

    if (groupElement && groupElement.style.height && (!scrollable || !scrollable.scrollTop())) {
      groupElement.style.height = '';
    }
  },
  _checkSize: function _checkSize(checkSize) {
    var $rootElement = this.component.$element();

    if (checkSize && (this._lastWidth === getWidth($rootElement) && this._lastHeight === getHeight($rootElement) && this._devicePixelRatio === getWindow().devicePixelRatio || !$rootElement.is(':visible'))) {
      return false;
    }

    return true;
  },
  _setScrollerSpacingCore: function _setScrollerSpacingCore(hasHeight) {
    var that = this;
    var vScrollbarWidth = hasHeight ? that._rowsView.getScrollbarWidth() : 0;

    var hScrollbarWidth = that._rowsView.getScrollbarWidth(true);

    deferRender(function () {
      that._columnHeadersView && that._columnHeadersView.setScrollerSpacing(vScrollbarWidth);
      that._footerView && that._footerView.setScrollerSpacing(vScrollbarWidth);

      that._rowsView.setScrollerSpacing(vScrollbarWidth, hScrollbarWidth);
    });
  },
  _setScrollerSpacing: function _setScrollerSpacing(hasHeight) {
    if (this.option('scrolling.useNative') === true) {
      // T722415, T758955
      deferRender(() => {
        deferUpdate(() => {
          this._setScrollerSpacingCore(hasHeight);
        });
      });
    } else {
      this._setScrollerSpacingCore(hasHeight);
    }
  },
  _updateDimensionsCore: function _updateDimensionsCore() {
    var that = this;
    var dataController = that._dataController;
    var rowsView = that._rowsView;
    var $rootElement = that.component.$element();
    var groupElement = $rootElement.children().get(0);
    var rootElementHeight = $rootElement && ($rootElement.get(0).clientHeight || getHeight($rootElement));
    var maxHeight = parseInt($rootElement.css('maxHeight'));
    var maxHeightHappened = maxHeight && rootElementHeight >= maxHeight;
    var height = that.option('height') || $rootElement.get(0).style.height;
    var editorFactory = that.getController('editorFactory');
    var isMaxHeightApplied = maxHeightHappened && groupElement.scrollHeight === groupElement.offsetHeight;
    var $testDiv;
    that.updateSize($rootElement);
    var hasHeight = that._hasHeight || maxHeightHappened;

    if (height && that._hasHeight ^ height !== 'auto') {
      $testDiv = $('<div>');
      setHeight($testDiv, height);
      $testDiv.appendTo($rootElement);
      that._hasHeight = !!getHeight($testDiv);
      $testDiv.remove();
    }

    deferRender(function () {
      rowsView.height(null, hasHeight); // IE11

      if (maxHeightHappened && !isMaxHeightApplied) {
        $(groupElement).css('height', maxHeight);
      }

      if (!dataController.isLoaded()) {
        rowsView.setLoading(dataController.isLoading());
        return;
      }

      deferUpdate(function () {
        that._updateLastSizes($rootElement);

        that._setScrollerSpacing(hasHeight);

        each(VIEW_NAMES, function (index, viewName) {
          var view = that.getView(viewName);

          if (view) {
            view.resize();
          }
        });
        editorFactory && editorFactory.resize();
      });
    });
  },
  _updateLastSizes: function _updateLastSizes($rootElement) {
    this._lastWidth = getWidth($rootElement);
    this._lastHeight = getHeight($rootElement);
    this._devicePixelRatio = getWindow().devicePixelRatio;
  },
  optionChanged: function optionChanged(args) {
    switch (args.name) {
      case 'width':
      case 'height':
        this.component._renderDimensions();

        this.resize();

      /* falls through */

      case 'renderAsync':
        args.handled = true;
        return;

      default:
        this.callBase(args);
    }
  },
  init: function init() {
    var that = this;
    that._dataController = that.getController('data');
    that._columnsController = that.getController('columns');
    that._columnHeadersView = that.getView('columnHeadersView');
    that._footerView = that.getView('footerView');
    that._rowsView = that.getView('rowsView');
  }
});
var SynchronizeScrollingController = modules.ViewController.inherit({
  _scrollChangedHandler: function _scrollChangedHandler(views, pos, viewName) {
    for (var j = 0; j < views.length; j++) {
      if (views[j] && views[j].name !== viewName) {
        views[j].scrollTo({
          left: pos.left,
          top: pos.top
        });
      }
    }
  },
  init: function init() {
    var views = [this.getView('columnHeadersView'), this.getView('footerView'), this.getView('rowsView')];

    for (var i = 0; i < views.length; i++) {
      var view = views[i];

      if (view) {
        view.scrollChanged.add(this._scrollChangedHandler.bind(this, views));
      }
    }
  }
});
var GridView = modules.View.inherit({
  _endUpdateCore: function _endUpdateCore() {
    if (this.component._requireResize) {
      this.component._requireResize = false;

      this._resizingController.resize();
    }
  },
  _getWidgetAriaLabel: function _getWidgetAriaLabel() {
    return 'dxDataGrid-ariaDataGrid';
  },
  init: function init() {
    var that = this;
    that._resizingController = that.getController('resizing');
    that._dataController = that.getController('data');
  },
  getView: function getView(name) {
    return this.component._views[name];
  },
  element: function element() {
    return this._groupElement;
  },
  optionChanged: function optionChanged(args) {
    var that = this;

    if (isDefined(that._groupElement) && args.name === 'showBorders') {
      that._groupElement.toggleClass(that.addWidgetPrefix(BORDERS_CLASS), !!args.value);

      args.handled = true;
    } else {
      that.callBase(args);
    }
  },
  _renderViews: function _renderViews($groupElement) {
    var that = this;
    each(VIEW_NAMES, function (index, viewName) {
      var view = that.getView(viewName);

      if (view) {
        view.render($groupElement);
      }
    });
  },
  _getTableRoleName: function _getTableRoleName() {
    return 'grid';
  },
  render: function render($rootElement) {
    var that = this;
    var isFirstRender = !that._groupElement;
    var $groupElement = that._groupElement || $('<div>').addClass(that.getWidgetContainerClass());
    $groupElement.addClass(GRIDBASE_CONTAINER_CLASS);
    $groupElement.toggleClass(that.addWidgetPrefix(BORDERS_CLASS), !!that.option('showBorders'));
    that.setAria('role', 'presentation', $rootElement);
    that.component.setAria({
      'role': this._getTableRoleName(),
      'label': messageLocalization.format(that._getWidgetAriaLabel())
    }, $groupElement);
    that._rootElement = $rootElement || that._rootElement;

    if (isFirstRender) {
      that._groupElement = $groupElement;
      hasWindow() && that.getController('resizing').updateSize($rootElement);
      $groupElement.appendTo($rootElement);
    }

    that._renderViews($groupElement);
  },
  update: function update() {
    var that = this;
    var $rootElement = that._rootElement;
    var $groupElement = that._groupElement;
    var resizingController = that.getController('resizing');

    if ($rootElement && $groupElement) {
      resizingController.resize();

      if (that._dataController.isLoaded()) {
        that._resizingController.fireContentReadyAction();
      }
    }
  }
});
export var gridViewModule = {
  defaultOptions: function defaultOptions() {
    return {
      showBorders: false,
      renderAsync: false
    };
  },
  controllers: {
    resizing: ResizingController,
    synchronizeScrolling: SynchronizeScrollingController
  },
  views: {
    gridView: GridView
  },
  VIEW_NAMES: VIEW_NAMES
};