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
export default {
  getIconByFilterOperation: function getIconByFilterOperation(filterOperation) {
    return OPERATION_ICONS[filterOperation];
  },
  getNameByFilterOperation: function getNameByFilterOperation(filterOperation) {
    return OPERATION_NAME[filterOperation];
  }
};