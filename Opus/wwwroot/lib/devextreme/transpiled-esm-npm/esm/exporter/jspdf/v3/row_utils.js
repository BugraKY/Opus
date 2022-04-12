import { isDefined } from '../../../core/utils/type';
import { calculateRowHeight } from './pdf_utils_v3';
import { normalizeBoundaryValue } from './normalizeOptions';

function calculateColumnsWidths(doc, dataProvider, topLeft, margin) {
  var _topLeft$x;

  var columnsWidths = dataProvider.getColumnsWidths();

  if (!columnsWidths.length) {
    return [];
  }

  var summaryGridWidth = columnsWidths.reduce((accumulator, width) => accumulator + width);
  var normalizedMargin = normalizeBoundaryValue(margin); // TODO: check measure units there

  var availablePageWidth = doc.internal.pageSize.getWidth() - ((_topLeft$x = topLeft === null || topLeft === void 0 ? void 0 : topLeft.x) !== null && _topLeft$x !== void 0 ? _topLeft$x : 0) - normalizedMargin.left - normalizedMargin.right;
  var ratio = availablePageWidth >= summaryGridWidth ? 1 : availablePageWidth / summaryGridWidth;
  return columnsWidths.map(width => width * ratio);
}

function initializeCellsWidth(doc, dataProvider, rows, options) {
  var _options$columnWidths;

  var columnWidths = (_options$columnWidths = options === null || options === void 0 ? void 0 : options.columnWidths) !== null && _options$columnWidths !== void 0 ? _options$columnWidths : calculateColumnsWidths(doc, dataProvider, options === null || options === void 0 ? void 0 : options.topLeft, options === null || options === void 0 ? void 0 : options.margin);
  rows.forEach(row => {
    row.cells.forEach((_ref, index) => {
      var {
        gridCell,
        pdfCell
      } = _ref;
      pdfCell._rect.w = columnWidths[index];
    });
  });
}

function calculateHeights(doc, rows, options) {
  rows.forEach(row => {
    var pdfCells = row.cells.map(c => c.pdfCell);
    var customerHeight;

    if (options.onRowExporting) {
      var args = {
        rowCells: pdfCells
      };
      options.onRowExporting(args);

      if (isDefined(args.rowHeight)) {
        customerHeight = args.rowHeight;
      }
    }

    row.height = isDefined(customerHeight) ? customerHeight : calculateRowHeight(doc, row.cells, pdfCells.map(c => c._rect.w));
    pdfCells.forEach(cell => {
      cell._rect.h = row.height;
    });
  });
}

function applyColSpans(rows) {
  for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    var row = rows[rowIndex];

    for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
      var cell = row.cells[cellIndex];

      if (isDefined(cell.colSpan) && !isDefined(cell.pdfCell.isMerged)) {
        for (var spanIndex = 1; spanIndex <= cell.colSpan; spanIndex++) {
          var mergedCell = rows[rowIndex].cells[cellIndex + spanIndex];
          cell.pdfCell._rect.w += mergedCell.pdfCell._rect.w;
          mergedCell.pdfCell._rect.w = 0;
          mergedCell.pdfCell.isMerged = true;
        }
      }
    }
  }
}

function applyRowSpans(rows) {
  for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    var row = rows[rowIndex];

    for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
      var cell = row.cells[cellIndex];

      if (isDefined(cell.rowSpan) && !isDefined(cell.pdfCell.isMerged)) {
        for (var spanIndex = 1; spanIndex <= cell.rowSpan; spanIndex++) {
          var mergedCell = rows[rowIndex + spanIndex].cells[cellIndex];
          cell.pdfCell._rect.h += mergedCell.pdfCell._rect.h;
          mergedCell.pdfCell._rect.h = 0;
          mergedCell.pdfCell.isMerged = true;
        }
      }
    }
  }
}

function resizeFirstColumnByIndentLevel(rows, options) {
  rows.forEach(row => {
    row.cells[0].pdfCell._rect.w -= row.indentLevel * options.indent;
  });
}

function applyBordersConfig(rows) {
  for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    var cells = rows[rowIndex].cells;

    for (var columnIndex = 0; columnIndex < cells.length; columnIndex++) {
      var pdfCell = cells[columnIndex].pdfCell;
      var leftPdfCell = columnIndex >= 1 ? cells[columnIndex - 1].pdfCell : null;
      var topPdfCell = rowIndex >= 1 ? rows[rowIndex - 1].cells[columnIndex].pdfCell : null;

      if (pdfCell.drawLeftBorder === false && !isDefined(cells[columnIndex].colSpan)) {
        // TODO: Check this logic after implementing splitting to pages
        if (isDefined(leftPdfCell)) {
          leftPdfCell.drawRightBorder = false;
        }
      } else if (!isDefined(pdfCell.drawLeftBorder)) {
        if (isDefined(leftPdfCell) && leftPdfCell.drawRightBorder === false) {
          pdfCell.drawLeftBorder = false;
        }
      }

      if (pdfCell.drawTopBorder === false) {
        if (isDefined(topPdfCell)) {
          topPdfCell.drawBottomBorder = false;
        }
      } else if (!isDefined(pdfCell.drawTopBorder)) {
        if (isDefined(topPdfCell) && topPdfCell.drawBottomBorder === false) {
          pdfCell.drawTopBorder = false;
        }
      }
    }
  }
}

function calculateCoordinates(doc, rows, options) {
  var _topLeft$y;

  var topLeft = options === null || options === void 0 ? void 0 : options.topLeft;
  var margin = normalizeBoundaryValue(options === null || options === void 0 ? void 0 : options.margin);
  var y = ((_topLeft$y = topLeft === null || topLeft === void 0 ? void 0 : topLeft.y) !== null && _topLeft$y !== void 0 ? _topLeft$y : 0) + margin.top;
  rows.forEach(row => {
    var _topLeft$x2;

    var x = ((_topLeft$x2 = topLeft === null || topLeft === void 0 ? void 0 : topLeft.x) !== null && _topLeft$x2 !== void 0 ? _topLeft$x2 : 0) + margin.left;
    var intend = row.indentLevel * options.indent;
    row.cells.forEach(cell => {
      cell.pdfCell._rect.x = x + intend;
      cell.pdfCell._rect.y = y;
      x += cell.pdfCell._rect.w;
    });
    y += row.height;
  });
}

function calculateTableSize(doc, rows, options) {
  var _topLeft$x3, _topLeft$y2, _columnWidths$reduce, _rowHeights$reduce;

  var topLeft = options === null || options === void 0 ? void 0 : options.topLeft;
  var columnWidths = options === null || options === void 0 ? void 0 : options.columnWidths;
  var rowHeights = rows.map(row => row.height);
  return {
    x: (_topLeft$x3 = topLeft === null || topLeft === void 0 ? void 0 : topLeft.x) !== null && _topLeft$x3 !== void 0 ? _topLeft$x3 : 0,
    y: (_topLeft$y2 = topLeft === null || topLeft === void 0 ? void 0 : topLeft.y) !== null && _topLeft$y2 !== void 0 ? _topLeft$y2 : 0,
    w: (_columnWidths$reduce = columnWidths === null || columnWidths === void 0 ? void 0 : columnWidths.reduce((a, b) => a + b, 0)) !== null && _columnWidths$reduce !== void 0 ? _columnWidths$reduce : 0,
    h: (_rowHeights$reduce = rowHeights === null || rowHeights === void 0 ? void 0 : rowHeights.reduce((a, b) => a + b, 0)) !== null && _rowHeights$reduce !== void 0 ? _rowHeights$reduce : 0
  };
}

export { initializeCellsWidth, applyColSpans, applyRowSpans, resizeFirstColumnByIndentLevel, applyBordersConfig, calculateHeights, calculateCoordinates, calculateTableSize };