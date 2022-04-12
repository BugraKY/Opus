"use strict";

exports.default = void 0;
var OPERATION_ICONS = {
  '=': 'equal',
  '<>': 'notequal',
  '<': 'less',
  '<=': 'lessorequal',
  '>': 'greater',
  '>=': 'greaterorequal',
  'notcontains': 'doesnotcontain',
  'contains': 'contains',
  'startswith': 'startswith',
  'endswith': 'endswith',
  'isblank': 'isblank',
  'isnotblank': 'isnotblank'
};
var OPERATION_NAME = {
  '=': 'equal',
  '<>': 'notEqual',
  '<': 'lessThan',
  '<=': 'lessThanOrEqual',
  '>': 'greaterThan',
  '>=': 'greaterThanOrEqual',
  'startswith': 'startsWith',
  'contains': 'contains',
  'notcontains': 'notContains',
  'endswith': 'endsWith',
  'isblank': 'isBlank',
  'isnotblank': 'isNotBlank',
  'between': 'between'
};
var _default = {
  getIconByFilterOperation: function getIconByFilterOperation(filterOperation) {
    return OPERATION_ICONS[filterOperation];
  },
  getNameByFilterOperation: function getNameByFilterOperation(filterOperation) {
    return OPERATION_NAME[filterOperation];
  }
};
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;