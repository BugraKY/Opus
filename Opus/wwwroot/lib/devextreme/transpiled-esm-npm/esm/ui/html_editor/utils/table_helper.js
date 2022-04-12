import $ from '../../../core/renderer';
import { each } from '../../../core/utils/iterator';
import { camelize } from '../../../core/utils/inflector';
var TABLE_FORMATS = ['table', 'tableHeaderCell'];
var TABLE_OPERATIONS = ['insertTable', 'insertHeaderRow', 'insertRowAbove', 'insertRowBelow', 'insertColumnLeft', 'insertColumnRight', 'deleteColumn', 'deleteRow', 'deleteTable', 'cellProperties', 'tableProperties'];

function getTableFormats(quill) {
  var tableModule = quill.getModule('table'); // backward compatibility with an old devextreme-quill packages

  return tableModule !== null && tableModule !== void 0 && tableModule.tableFormats ? tableModule.tableFormats() : TABLE_FORMATS;
}

function hasEmbedContent(module, selection) {
  return !!selection && module.quill.getText(selection).trim().length < selection.length;
}

function unfixTableWidth($table, _ref) {
  var {
    tableBlot,
    quill
  } = _ref;
  var unfixValue = 'initial';
  var formatBlot = tableBlot !== null && tableBlot !== void 0 ? tableBlot : quill.scroll.find($table.get(0));
  formatBlot.format('tableWidth', unfixValue);
}

function getColumnElements($table) {
  var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return $table.find('tr').eq(index).find('th, td');
}

function getAutoSizedElements($table) {
  var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'horizontal';
  var result = [];
  var isHorizontal = direction === 'horizontal';
  var $lineElements = isHorizontal ? getColumnElements($table) : getRowElements($table);
  $lineElements.each((index, element) => {
    var $element = $(element);

    if ($element.get(0).style[isHorizontal ? 'width' : 'height'] === '') {
      result.push($element);
    }
  });
  return result;
}

function setLineElementsFormat(module, _ref2) {
  var {
    elements,
    property,
    value
  } = _ref2;
  var tableBlotNames = module.quill.getModule('table').tableBlots;
  var fullPropertyName = "cell".concat(camelize(property, true));
  each(elements, (i, element) => {
    var _formatBlot;

    var formatBlot = module.quill.scroll.find(element);

    if (!tableBlotNames.includes(formatBlot.statics.blotName)) {
      var descendBlot = formatBlot.descendant(blot => tableBlotNames.includes(blot.statics.blotName));
      formatBlot = descendBlot ? descendBlot[0] : null;
    }

    (_formatBlot = formatBlot) === null || _formatBlot === void 0 ? void 0 : _formatBlot.format(fullPropertyName, value + 'px');
  });
}

function getLineElements($table, index) {
  var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'horizontal';
  return direction === 'horizontal' ? getRowElements($table, index) : getColumnElements($table, index);
}

function getRowElements($table) {
  var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return $table.find("th:nth-child(".concat(1 + index, "), td:nth-child(").concat(1 + index, ")"));
}

function getTableOperationHandler(quill, operationName) {
  for (var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    rest[_key - 2] = arguments[_key];
  }

  return () => {
    var table = quill.getModule('table');

    if (!table) {
      return;
    }

    quill.focus();
    return table[operationName](...rest);
  };
}

export { TABLE_OPERATIONS, getTableFormats, getTableOperationHandler, unfixTableWidth, getColumnElements, getAutoSizedElements, setLineElementsFormat, getLineElements, getRowElements, hasEmbedContent };