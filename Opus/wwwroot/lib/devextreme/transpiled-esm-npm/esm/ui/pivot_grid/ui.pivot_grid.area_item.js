import { setWidth } from '../../core/utils/size';
import $ from '../../core/renderer';
import Class from '../../core/class';
import { getPublicElement } from '../../core/element';
import { extend } from '../../core/utils/extend';
import { getBoundingRect } from '../../core/utils/position';
import { isDefined } from '../../core/utils/type';
var PIVOTGRID_EXPAND_CLASS = 'dx-expand';

var getRealElementWidth = function getRealElementWidth(element) {
  var width = 0;
  var offsetWidth = element.offsetWidth;

  if (element.getBoundingClientRect) {
    var clientRect = getBoundingRect(element);
    width = clientRect.width;

    if (!width) {
      width = clientRect.right - clientRect.left;
    }

    if (width <= offsetWidth - 1) {
      width = offsetWidth;
    }
  }

  return width > 0 ? width : offsetWidth;
};

function getFakeTableOffset(scrollPos, elementOffset, tableSize, viewPortSize) {
  var offset = 0;
  var halfTableCount = 0;
  var halfTableSize = tableSize / 2;

  if (scrollPos + viewPortSize - (elementOffset + tableSize) > 1) {
    if (scrollPos >= elementOffset + tableSize + halfTableSize) {
      halfTableCount = parseInt((scrollPos - (elementOffset + tableSize)) / halfTableSize, 10);
    }

    offset = elementOffset + tableSize + halfTableSize * halfTableCount;
  } else if (scrollPos < elementOffset) {
    if (scrollPos <= elementOffset - halfTableSize) {
      halfTableCount = parseInt((scrollPos - (elementOffset - halfTableSize)) / halfTableSize, 10);
    }

    offset = elementOffset - (tableSize - halfTableSize * halfTableCount);
  } else {
    offset = elementOffset;
  }

  return offset;
}

export var AreaItem = Class.inherit({
  ctor: function ctor(component) {
    this.component = component;
  },
  option: function option() {
    return this.component.option.apply(this.component, arguments);
  },
  _getRowElement: function _getRowElement(index) {
    var that = this;

    if (that._tableElement && that._tableElement.length > 0) {
      return that._tableElement[0].rows[index];
    }

    return null;
  },
  _createGroupElement: function _createGroupElement() {
    return $('<div>');
  },
  _createTableElement: function _createTableElement() {
    return $('<table>');
  },
  _getCellText: function _getCellText(cell, encodeHtml) {
    var cellText = cell.isWhiteSpace ? '&nbsp' : cell.text || '&nbsp';

    if (encodeHtml && (cellText.indexOf('<') !== -1 || cellText.indexOf('>') !== -1)) {
      cellText = $('<div>').text(cellText).html();
    }

    return cellText;
  },
  _getRowClassNames: function _getRowClassNames() {},
  _applyCustomStyles: function _applyCustomStyles(options) {
    if (options.cell.width) {
      options.cssArray.push('min-width:' + options.cell.width + 'px');
    }

    if (options.cell.sorted) {
      options.classArray.push('dx-pivotgrid-sorted');
    }
  },
  _getMainElementMarkup: function _getMainElementMarkup() {
    return '<tbody>';
  },
  _getCloseMainElementMarkup: function _getCloseMainElementMarkup() {
    return '</tbody>';
  },
  _renderTableContent: function _renderTableContent(tableElement, data) {
    var that = this;
    var rowsCount = data.length;
    var row;
    var cell;
    var i;
    var j;
    var rowElement;
    var cellElement;
    var cellText;
    var rtlEnabled = that.option('rtlEnabled');
    var markupArray = [];
    var encodeHtml = that.option('encodeHtml');
    var rowClassNames;
    var colspan = 'colspan=\'';
    var rowspan = 'rowspan=\'';
    tableElement.data('area', that._getAreaName());
    tableElement.data('data', data);
    tableElement.css('width', '');
    markupArray.push(that._getMainElementMarkup());

    for (i = 0; i < rowsCount; i++) {
      row = data[i];
      var columnMarkupArray = [];
      rowClassNames = [];
      markupArray.push('<tr ');

      for (j = 0; j < row.length; j++) {
        cell = row[j];

        this._getRowClassNames(i, cell, rowClassNames);

        columnMarkupArray.push('<td ');

        if (cell) {
          cell.rowspan && columnMarkupArray.push(rowspan + (cell.rowspan || 1) + '\'');
          cell.colspan && columnMarkupArray.push(colspan + (cell.colspan || 1) + '\'');
          var styleOptions = {
            cellElement: cellElement,
            cell: cell,
            cellsCount: row.length,
            cellIndex: j,
            rowElement: rowElement,
            rowIndex: i,
            rowsCount: rowsCount,
            rtlEnabled: rtlEnabled,
            classArray: [],
            cssArray: []
          };

          that._applyCustomStyles(styleOptions);

          if (styleOptions.cssArray.length) {
            columnMarkupArray.push('style=\'');
            columnMarkupArray.push(styleOptions.cssArray.join(';'));
            columnMarkupArray.push('\'');
          }

          if (styleOptions.classArray.length) {
            columnMarkupArray.push('class=\'');
            columnMarkupArray.push(styleOptions.classArray.join(' '));
            columnMarkupArray.push('\'');
          }

          columnMarkupArray.push('>');

          if (isDefined(cell.expanded)) {
            columnMarkupArray.push('<div class=\'dx-expand-icon-container\'><span class=\'' + PIVOTGRID_EXPAND_CLASS + '\'></span></div>');
          }

          cellText = this._getCellText(cell, encodeHtml);
        } else {
          cellText = '';
        }

        columnMarkupArray.push('<span ');

        if (isDefined(cell.wordWrapEnabled)) {
          columnMarkupArray.push('style=\'white-space:', cell.wordWrapEnabled ? 'normal' : 'nowrap', ';\'');
        }

        columnMarkupArray.push('>' + cellText + '</span>');

        if (cell.sorted) {
          columnMarkupArray.push('<span class=\'dx-icon-sorted\'></span>');
        }

        columnMarkupArray.push('</td>');
      }

      if (rowClassNames.length) {
        markupArray.push('class=\'');
        markupArray.push(rowClassNames.join(' '));
        markupArray.push('\'');
      }

      markupArray.push('>');
      markupArray.push(columnMarkupArray.join(''));
      markupArray.push('</tr>');
    }

    markupArray.push(this._getCloseMainElementMarkup());
    tableElement.append(markupArray.join(''));

    this._triggerOnCellPrepared(tableElement, data);
  },
  _triggerOnCellPrepared: function _triggerOnCellPrepared(tableElement, data) {
    var that = this;
    var rowElements = tableElement.find('tr');

    var areaName = that._getAreaName();

    var onCellPrepared = that.option('onCellPrepared');

    var hasEvent = that.component._eventsStrategy.hasEvent('cellPrepared');

    var rowElement;
    var $cellElement;
    var onCellPreparedArgs;

    var defaultActionArgs = this.component._defaultActionArgs();

    var row;
    var cell;
    var rowIndex;
    var columnIndex;

    if (onCellPrepared || hasEvent) {
      for (rowIndex = 0; rowIndex < data.length; rowIndex++) {
        row = data[rowIndex];
        rowElement = rowElements.eq(rowIndex);

        for (columnIndex = 0; columnIndex < row.length; columnIndex++) {
          cell = row[columnIndex];
          $cellElement = rowElement.children().eq(columnIndex);
          onCellPreparedArgs = {
            area: areaName,
            rowIndex: rowIndex,
            columnIndex: columnIndex,
            cellElement: getPublicElement($cellElement),
            cell: cell
          };

          if (hasEvent) {
            that.component._trigger('onCellPrepared', onCellPreparedArgs);
          } else {
            onCellPrepared(extend(onCellPreparedArgs, defaultActionArgs));
          }
        }
      }
    }
  },
  _getRowHeight: function _getRowHeight(index) {
    var row = this._getRowElement(index);

    var height = 0;
    var offsetHeight = row.offsetHeight;

    if (row && row.lastChild) {
      if (row.getBoundingClientRect) {
        var clientRect = getBoundingRect(row);
        height = clientRect.height;

        if (height <= offsetHeight - 1) {
          height = offsetHeight;
        }
      }

      return height > 0 ? height : offsetHeight;
    }

    return 0;
  },
  _setRowHeight: function _setRowHeight(index, value) {
    var row = this._getRowElement(index);

    if (row) {
      row.style.height = value + 'px';
    }
  },
  getRowsLength: function getRowsLength() {
    var that = this;

    if (that._tableElement && that._tableElement.length > 0) {
      return that._tableElement[0].rows.length;
    }

    return 0;
  },
  getRowsHeight: function getRowsHeight() {
    var that = this;
    var result = [];
    var rowsLength = that.getRowsLength();
    var i;

    for (i = 0; i < rowsLength; i++) {
      result.push(that._getRowHeight(i));
    }

    return result;
  },
  setRowsHeight: function setRowsHeight(values) {
    var that = this;
    var totalHeight = 0;
    var valuesLength = values.length;
    var i;

    for (i = 0; i < valuesLength; i++) {
      totalHeight += values[i];

      that._setRowHeight(i, values[i]);
    }

    this._tableHeight = totalHeight;
    this._tableElement[0].style.height = totalHeight + 'px';
  },
  getColumnsWidth: function getColumnsWidth() {
    var rowsLength = this.getRowsLength();
    var rowIndex;
    var row;
    var i;
    var columnIndex;
    var processedCells = [];
    var result = [];

    var fillCells = function fillCells(cells, rowIndex, columnIndex, rowSpan, colSpan) {
      var rowOffset;
      var columnOffset;

      for (rowOffset = 0; rowOffset < rowSpan; rowOffset++) {
        for (columnOffset = 0; columnOffset < colSpan; columnOffset++) {
          cells[rowIndex + rowOffset] = cells[rowIndex + rowOffset] || [];
          cells[rowIndex + rowOffset][columnIndex + columnOffset] = true;
        }
      }
    };

    if (rowsLength) {
      for (rowIndex = 0; rowIndex < rowsLength; rowIndex++) {
        processedCells[rowIndex] = processedCells[rowIndex] || [];
        row = this._getRowElement(rowIndex);

        for (i = 0; i < row.cells.length; i++) {
          for (columnIndex = 0; processedCells[rowIndex][columnIndex]; columnIndex++) {
            ;
          }

          fillCells(processedCells, rowIndex, columnIndex, row.cells[i].rowSpan, row.cells[i].colSpan);

          if (row.cells[i].colSpan === 1) {
            result[columnIndex] = result[columnIndex] || getRealElementWidth(row.cells[i]);
          }
        }
      }
    }

    return result;
  },
  setColumnsWidth: function setColumnsWidth(values) {
    var i;
    var tableElement = this._tableElement[0];
    var colgroupElementHTML = '';
    var columnsCount = this.getColumnsCount();
    var columnWidth = [];

    for (i = 0; i < columnsCount; i++) {
      columnWidth.push(values[i] || 0);
    }

    for (i = columnsCount; i < values.length && values; i++) {
      columnWidth[columnsCount - 1] += values[i];
    }

    for (i = 0; i < columnsCount; i++) {
      colgroupElementHTML += '<col style="width: ' + columnWidth[i] + 'px">';
    }

    this._colgroupElement.html(colgroupElementHTML);

    this._tableWidth = columnWidth.reduce((sum, width) => sum + width, 0);
    tableElement.style.width = this._tableWidth + 'px';
    tableElement.style.tableLayout = 'fixed';
  },
  resetColumnsWidth: function resetColumnsWidth() {
    setWidth(this._colgroupElement.find('col'), 'auto');

    this._tableElement.css({
      width: '',
      tableLayout: ''
    });
  },
  setGroupWidth: function setGroupWidth(value) {
    this._getScrollable().option('width', value);
  },
  setGroupHeight: function setGroupHeight(value) {
    this._getScrollable().option('height', value);
  },
  getGroupHeight: function getGroupHeight() {
    return this._getGroupElementSize('height');
  },
  getGroupWidth: function getGroupWidth() {
    return this._getGroupElementSize('width');
  },

  _getGroupElementSize(dimension) {
    var size = this.groupElement()[0].style[dimension];

    if (size.indexOf('px') > 0) {
      return parseFloat(size);
    }

    return null;
  },

  groupElement: function groupElement() {
    return this._groupElement;
  },
  tableElement: function tableElement() {
    return this._tableElement;
  },
  element: function element() {
    return this._rootElement;
  },
  headElement: function headElement() {
    return this._tableElement.find('thead');
  },
  _setTableCss: function _setTableCss(styles) {
    if (this.option('rtlEnabled')) {
      styles.right = styles.left;
      delete styles.left;
    }

    this.tableElement().css(styles);
  },
  setVirtualContentParams: function setVirtualContentParams(params) {
    this._virtualContent.css({
      width: params.width,
      height: params.height
    });

    this.groupElement().addClass('dx-virtual-mode');
  },
  disableVirtualMode: function disableVirtualMode() {
    this.groupElement().removeClass('dx-virtual-mode');
  },
  _renderVirtualContent: function _renderVirtualContent() {
    var that = this;

    if (!that._virtualContent && that.option('scrolling.mode') === 'virtual') {
      that._virtualContent = $('<div>').addClass('dx-virtual-content').insertBefore(that._tableElement);
    }
  },
  reset: function reset() {
    var that = this;
    var tableElement = that._tableElement[0];
    that._fakeTable && that._fakeTable.detach();
    that._fakeTable = null;
    that.disableVirtualMode();
    that.setGroupWidth('100%');
    that.setGroupHeight('auto');
    that.resetColumnsWidth();

    if (tableElement) {
      for (var i = 0; i < tableElement.rows.length; i++) {
        tableElement.rows[i].style.height = '';
      }

      tableElement.style.height = '';
      tableElement.style.width = '100%';
    }
  },
  _updateFakeTableVisibility: function _updateFakeTableVisibility() {
    var that = this;
    var tableElement = that.tableElement()[0];
    var horizontalOffsetName = that.option('rtlEnabled') ? 'right' : 'left';
    var fakeTableElement = that._fakeTable[0];

    if (tableElement.style.top === fakeTableElement.style.top && fakeTableElement.style[horizontalOffsetName] === tableElement.style[horizontalOffsetName]) {
      that._fakeTable.addClass('dx-hidden');
    } else {
      that._fakeTable.removeClass('dx-hidden');
    }
  },
  _moveFakeTableHorizontally: function _moveFakeTableHorizontally(scrollPos) {
    var that = this;
    var rtlEnabled = that.option('rtlEnabled');
    var offsetStyleName = rtlEnabled ? 'right' : 'left';
    var tableElementOffset = parseFloat(that.tableElement()[0].style[offsetStyleName]);
    var offset = getFakeTableOffset(scrollPos, tableElementOffset, that._tableWidth, that.getGroupWidth());

    if (parseFloat(that._fakeTable[0].style[offsetStyleName]) !== offset) {
      that._fakeTable[0].style[offsetStyleName] = offset + 'px';
    }
  },
  _moveFakeTableTop: function _moveFakeTableTop(scrollPos) {
    var that = this;
    var tableElementOffsetTop = parseFloat(that.tableElement()[0].style.top);
    var offsetTop = getFakeTableOffset(scrollPos, tableElementOffsetTop, that._tableHeight, that.getGroupHeight());

    if (parseFloat(that._fakeTable[0].style.top) !== offsetTop) {
      that._fakeTable[0].style.top = offsetTop + 'px';
    }
  },
  _moveFakeTable: function _moveFakeTable() {
    this._updateFakeTableVisibility();
  },
  _createFakeTable: function _createFakeTable() {
    var that = this;

    if (!that._fakeTable) {
      that._fakeTable = that.tableElement().clone().addClass('dx-pivot-grid-fake-table').appendTo(that._virtualContent);
    }
  },
  render: function render(rootElement, data) {
    var that = this;

    if (that._tableElement) {
      try {
        that._tableElement[0].innerHTML = '';
      } catch (e) {
        that._tableElement.empty();
      }

      that._tableElement.attr('style', '');
    } else {
      that._groupElement = that._createGroupElement();
      that._tableElement = that._createTableElement();

      that._tableElement.appendTo(that._groupElement);

      that._groupElement.appendTo(rootElement);

      that._rootElement = rootElement;
    }

    that._colgroupElement = $('<colgroup>').appendTo(that._tableElement);

    that._renderTableContent(that._tableElement, data);

    that._renderVirtualContent();
  },
  _getScrollable: function _getScrollable() {
    return this.groupElement().data('dxScrollable');
  },

  _getMaxLeftOffset(scrollable) {
    var containerElement = $(scrollable.container()).get(0);
    return containerElement.scrollWidth - containerElement.clientWidth;
  },

  on: function on(eventName, handler) {
    var that = this;

    var scrollable = that._getScrollable();

    if (scrollable) {
      scrollable.on(eventName, function (e) {
        if (that.option('rtlEnabled') && isDefined(e.scrollOffset.left)) {
          e.scrollOffset.left = that._getMaxLeftOffset(scrollable) - e.scrollOffset.left;
        }

        handler(e);
      });
    }

    return this;
  },
  off: function off(eventName) {
    var scrollable = this._getScrollable();

    if (scrollable) {
      scrollable.off(eventName);
    }

    return this;
  },
  scrollTo: function scrollTo(pos) {
    var scrollable = this._getScrollable();

    var scrollablePos = pos;

    if (scrollable) {
      if (this.option('rtlEnabled')) {
        if (this._getAreaName() === 'column') {
          scrollablePos = this._getMaxLeftOffset(scrollable) - pos.left;
        } else if (this._getAreaName() === 'data') {
          scrollablePos = {
            left: this._getMaxLeftOffset(scrollable) - pos.left,
            top: pos.top
          };
        }
      }

      scrollable.scrollTo(scrollablePos);

      if (this._virtualContent) {
        this._createFakeTable();

        this._moveFakeTable(pos);
      }
    }
  },
  updateScrollable: function updateScrollable() {
    var scrollable = this._getScrollable();

    if (scrollable) {
      return scrollable.update();
    }
  },
  getColumnsCount: function getColumnsCount() {
    var columnCount = 0;

    var row = this._getRowElement(0);

    var cells;

    if (row) {
      cells = row.cells;

      for (var i = 0, len = cells.length; i < len; ++i) {
        columnCount += cells[i].colSpan;
      }
    }

    return columnCount;
  },
  getData: function getData() {
    var tableElement = this._tableElement;
    return tableElement ? tableElement.data('data') : [];
  }
});