"use strict";

exports.updateRowsAndCellsHeights = updateRowsAndCellsHeights;

var _type = require("../../../core/utils/type");

var _pdf_utils_v = require("./pdf_utils_v3");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function updateRowsAndCellsHeights(doc, rows) {
  var rowsAdditionalHeights = calculateAdditionalRowsHeights(doc, rows);
  rows.forEach(function (row) {
    row.height += rowsAdditionalHeights[row.rowIndex];
  });
  rows.forEach(function (row) {
    row.cells.forEach(function (cell) {
      var _cell$rowSpan;

      var rowsCount = ((_cell$rowSpan = cell.rowSpan) !== null && _cell$rowSpan !== void 0 ? _cell$rowSpan : 0) + 1;
      cell.pdfCell._rect.h = rows.slice(row.rowIndex, row.rowIndex + rowsCount).reduce(function (accumulator, rowInfo) {
        return accumulator + rowInfo.height;
      }, 0);
    });
  });
}

function calculateAdditionalRowsHeights(doc, rows) {
  var rowsAdditionalHeights = Array.from({
    length: rows.length
  }, function () {
    return 0;
  });
  var sortedRows = sortRowsByMaxRowSpanAsc(rows);
  sortedRows.forEach(function (row) {
    var cellsWithRowSpan = row.cells.filter(function (cell) {
      return (0, _type.isDefined)(cell.rowSpan);
    });
    cellsWithRowSpan.forEach(function (cell) {
      var targetRectWidth = (0, _pdf_utils_v.calculateTargetRectWidth)(cell.pdfCell._rect.w, cell.pdfCell.padding);
      var textHeight = (0, _pdf_utils_v.calculateTextHeight)(doc, cell.pdfCell.text, cell.pdfCell.font, {
        wordWrapEnabled: cell.pdfCell.wordWrapEnabled,
        targetRectWidth: targetRectWidth
      });
      var cellHeight = textHeight + cell.pdfCell.padding.top + cell.pdfCell.padding.bottom;
      var rowsCount = cell.rowSpan + 1;
      var currentRowSpanRowsHeight = rows.slice(row.rowIndex, row.rowIndex + rowsCount).reduce(function (accumulator, rowInfo) {
        return accumulator + rowInfo.height + rowsAdditionalHeights[rowInfo.rowIndex];
      }, 0);

      if (cellHeight > currentRowSpanRowsHeight) {
        var delta = (cellHeight - currentRowSpanRowsHeight) / rowsCount;

        for (var spanIndex = row.rowIndex; spanIndex < row.rowIndex + rowsCount; spanIndex++) {
          rowsAdditionalHeights[spanIndex] += delta;
        }
      }
    });
  });
  return rowsAdditionalHeights;
}

function sortRowsByMaxRowSpanAsc(rows) {
  var getMaxRowSpan = function getMaxRowSpan(row) {
    var spansArray = row.cells.map(function (cell) {
      var _cell$rowSpan2;

      return (_cell$rowSpan2 = cell.rowSpan) !== null && _cell$rowSpan2 !== void 0 ? _cell$rowSpan2 : 0;
    });
    return Math.max.apply(Math, _toConsumableArray(spansArray));
  };

  var sortByMaxRowSpan = function sortByMaxRowSpan(row1, row2) {
    var row1RowSpan = getMaxRowSpan(row1);
    var row2RowSpan = getMaxRowSpan(row2);

    if (row1RowSpan > row2RowSpan) {
      return 1;
    }

    if (row2RowSpan > row1RowSpan) {
      return -1;
    }

    return 0;
  };

  return _toConsumableArray(rows).sort(sortByMaxRowSpan);
}