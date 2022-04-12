import { isNumeric } from '../../../core/utils/type';

function normalizeBoundaryValue(value) {
  var _value$top, _value$right, _value$bottom, _value$left;

  if (isNumeric(value)) {
    return {
      top: value,
      right: value,
      bottom: value,
      left: value
    };
  }

  return {
    top: (_value$top = value === null || value === void 0 ? void 0 : value.top) !== null && _value$top !== void 0 ? _value$top : 0,
    right: (_value$right = value === null || value === void 0 ? void 0 : value.right) !== null && _value$right !== void 0 ? _value$right : 0,
    bottom: (_value$bottom = value === null || value === void 0 ? void 0 : value.bottom) !== null && _value$bottom !== void 0 ? _value$bottom : 0,
    left: (_value$left = value === null || value === void 0 ? void 0 : value.left) !== null && _value$left !== void 0 ? _value$left : 0
  };
}

function normalizeRowsInfo(rowsInfo) {
  rowsInfo.forEach(row => {
    row.cells.forEach(_ref => {
      var {
        pdfCell
      } = _ref;
      pdfCell.padding = normalizeBoundaryValue(pdfCell.padding);
    });
  });
}

export { normalizeRowsInfo, normalizeBoundaryValue };