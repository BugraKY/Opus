"use strict";

exports.exportDataGrid = exportDataGrid;

var _type = require("../../../core/utils/type");

var _extend = require("../../../core/utils/extend");

var _normalizeOptions = require("./normalizeOptions");

var _row_utils = require("./row_utils");

var _height_updater = require("./height_updater");

var _rows_generator = require("./rows_generator");

var _draw_utils = require("./draw_utils");

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// TODO: check names with techwritters
// IPDFExportOptions: {
//    topLeft: {x: number, y: number},
//    indent: number,
//    margin: { top:number, left:number, right:number, bottom:number } | number
//    customizeCell: (IPdfRowInfo): void
//    customDrawCell: (rect, pdfCell, gridCell, cancel): void (similar to the https://docs.devexpress.com/WindowsForms/DevExpress.XtraGrid.Views.Grid.GridView.CustomDrawCell)
// }
function _getFullOptions(options) {
  var fullOptions = (0, _extend.extend)({}, options);

  if (!(0, _type.isDefined)(fullOptions.topLeft)) {
    throw 'options.topLeft is required';
  }

  if (!(0, _type.isDefined)(fullOptions.indent)) {
    fullOptions.indent = 10;
  }

  return fullOptions;
}

function exportDataGrid(doc, dataGrid, options) {
  options = (0, _extend.extend)({}, _getFullOptions(options));
  var dataProvider = dataGrid.getDataProvider();
  return new Promise(function (resolve) {
    dataProvider.ready().done(function () {
      var _options$rowOptions, _options$rowOptions$h;

      // TODO: pass rowOptions: { headerStyles: { backgroundColor }, groupStyles: {...}, totalStyles: {...} }
      var rowsInfo = (0, _rows_generator.generateRowsInfo)(dataProvider, dataGrid, (_options$rowOptions = options.rowOptions) === null || _options$rowOptions === void 0 ? void 0 : (_options$rowOptions$h = _options$rowOptions.headerStyles) === null || _options$rowOptions$h === void 0 ? void 0 : _options$rowOptions$h.backgroundColor);

      if (options.customizeCell) {
        rowsInfo.forEach(function (rowInfo) {
          return rowInfo.cells.forEach(function (cellInfo) {
            return (// In 'customizeCell' callback you can change values of these properties:
              // - e.pdfCell.height - will be used instead of a calculated height
              // - e.pdfCell.text - the text that will be printed
              // - e.pdfCell.customDrawContent - will be called at the drawing stage
              //     you can introduce new properties to 'e.pdfCell' and use them in your callback
              //     TODO: e.pdfRow + e.gridCell ???
              // - e.pdfCell.wordWrapEnabled - will be used to split cell text by the width of its cell
              //
              // And, you can read values of these properties ('readonly'):
              // - e.gridCell (TODO: list of properties)
              // - e.pdfRowInfo (TODO: list of properties)
              options.customizeCell(cellInfo)
            );
          });
        });
      }

      (0, _normalizeOptions.normalizeRowsInfo)(rowsInfo); // computes withs of the cells depending of the options

      (0, _row_utils.initializeCellsWidth)(doc, dataProvider, rowsInfo, options); // apply intends for correctly set width and colSpan for grouped rows

      (0, _row_utils.resizeFirstColumnByIndentLevel)(rowsInfo, options); // apply colSpans + recalculate cellsWidth

      (0, _row_utils.applyColSpans)(rowsInfo); // set/update/initCellHeight - autocalculate by text+width+wordWrapEnabled+padding or use value from customizeCell

      (0, _row_utils.calculateHeights)(doc, rowsInfo, options); // apply rowSpans + recalculate cells height

      (0, _row_utils.applyRowSpans)(rowsInfo); // when we know all rowSpans we can recalculate rowsHeight

      (0, _height_updater.updateRowsAndCellsHeights)(doc, rowsInfo); // when we known all sizes we can calculate all coordinates

      (0, _row_utils.calculateCoordinates)(doc, rowsInfo, options); // set/init/update 'pdfCell.top/left'
      // recalculate for grouped rows
      // TODO: applyGroupIndents()

      (0, _row_utils.applyBordersConfig)(rowsInfo); // splitting to pages
      // ?? TODO: Does split a cell which have an attribute 'colSpan/rowSpan > 0' into two cells and place the first cell on the first page and second cell on the second page. And show initial 'text' in the both new cells ??
      // TODO: applySplitting()

      var pdfCellsInfo = [].concat.apply([], rowsInfo.map(function (rowInfo) {
        return rowInfo.cells.filter(function (cell) {
          return !(0, _type.isDefined)(cell.pdfCell.isMerged);
        }).map(function (cellInfo) {
          return _extends({}, cellInfo.pdfCell, {
            gridCell: cellInfo.gridCell,
            pdfRowInfo: cellInfo.pdfRowInfo
          });
        });
      }));
      var docStyles = (0, _draw_utils.getDocumentStyles)(doc);
      (0, _draw_utils.drawCellsContent)(doc, options.customDrawCell, pdfCellsInfo, docStyles);
      (0, _draw_utils.drawCellsLines)(doc, pdfCellsInfo, docStyles);
      var isDrawTableBorderSpecified = options.drawTableBorder === true;
      var isEmptyPdfCellsInfoSpecified = (0, _type.isDefined)(pdfCellsInfo) && pdfCellsInfo.length === 0;

      if (isDrawTableBorderSpecified || isEmptyPdfCellsInfoSpecified) {
        var tableRect = (0, _row_utils.calculateTableSize)(doc, rowsInfo, options); // TODO: after splitting to pages we need get 'rowsInfo' for selected table in the page

        (0, _draw_utils.drawGridLines)(doc, tableRect, docStyles);
      }

      (0, _draw_utils.setDocumentStyles)(doc, docStyles);
      resolve();
    });
  });
}