"use strict";

exports.default = void 0;

var _type = require("../../core/utils/type");

var _array = require("../../core/utils/array");

var _iterator = require("../../core/utils/iterator");

var DEFAULT_DATE_INTERVAL = ['year', 'month', 'day'];
var DEFAULT_DATETIME_INTERVAL = ['year', 'month', 'day', 'hour', 'minute'];

var isDateType = function isDateType(dataType) {
  return dataType === 'date' || dataType === 'datetime';
};

var getGroupInterval = function getGroupInterval(column) {
  var index;
  var result = [];
  var dateIntervals = ['year', 'month', 'day', 'hour', 'minute', 'second'];
  var groupInterval = column.headerFilter && column.headerFilter.groupInterval;
  var interval = groupInterval === 'quarter' ? 'month' : groupInterval;

  if (isDateType(column.dataType) && groupInterval !== null) {
    result = column.dataType === 'datetime' ? DEFAULT_DATETIME_INTERVAL : DEFAULT_DATE_INTERVAL;
    index = (0, _array.inArray)(interval, dateIntervals);

    if (index >= 0) {
      result = dateIntervals.slice(0, index);
      result.push(groupInterval);
      return result;
    }

    return result;
  } else if ((0, _type.isDefined)(groupInterval)) {
    return Array.isArray(groupInterval) ? groupInterval : [groupInterval];
  }
};

var _default = function () {
  var getFilterSelector = function getFilterSelector(column, target) {
    var selector = column.dataField || column.selector;

    if (target === 'search') {
      selector = column.displayField || column.calculateDisplayValue || selector;
    }

    return selector;
  };

  var isZeroTime = function isZeroTime(date) {
    return date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds() < 1;
  };

  var getDateValues = function getDateValues(dateValue) {
    if ((0, _type.isDate)(dateValue)) {
      return [dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate(), dateValue.getHours(), dateValue.getMinutes(), dateValue.getSeconds()];
    }

    return (0, _iterator.map)(('' + dateValue).split('/'), function (value, index) {
      return index === 1 ? Number(value) - 1 : Number(value);
    });
  };

  var getFilterExpressionByRange = function getFilterExpressionByRange(filterValue, target) {
    var column = this;
    var endFilterValue;
    var startFilterExpression;
    var endFilterExpression;
    var selector = getFilterSelector(column, target);

    if (Array.isArray(filterValue) && (0, _type.isDefined)(filterValue[0]) && (0, _type.isDefined)(filterValue[1])) {
      startFilterExpression = [selector, '>=', filterValue[0]];
      endFilterExpression = [selector, '<=', filterValue[1]];

      if (isDateType(column.dataType) && isZeroTime(filterValue[1])) {
        endFilterValue = new Date(filterValue[1].getTime());

        if (column.dataType === 'date') {
          endFilterValue.setDate(filterValue[1].getDate() + 1);
        }

        endFilterExpression = [selector, '<', endFilterValue];
      }

      return [startFilterExpression, 'and', endFilterExpression];
    }
  };

  var getFilterExpressionForDate = function getFilterExpressionForDate(filterValue, selectedFilterOperation, target) {
    var column = this;
    var dateStart;
    var dateEnd;
    var dateInterval;
    var values = getDateValues(filterValue);
    var selector = getFilterSelector(column, target);

    if (target === 'headerFilter') {
      dateInterval = getGroupInterval(column)[values.length - 1];
    } else if (column.dataType === 'datetime') {
      dateInterval = 'minute';
    }

    switch (dateInterval) {
      case 'year':
        dateStart = new Date(values[0], 0, 1);
        dateEnd = new Date(values[0] + 1, 0, 1);
        break;

      case 'month':
        dateStart = new Date(values[0], values[1], 1);
        dateEnd = new Date(values[0], values[1] + 1, 1);
        break;

      case 'quarter':
        dateStart = new Date(values[0], 3 * values[1], 1);
        dateEnd = new Date(values[0], 3 * values[1] + 3, 1);
        break;

      case 'hour':
        dateStart = new Date(values[0], values[1], values[2], values[3]);
        dateEnd = new Date(values[0], values[1], values[2], values[3] + 1);
        break;

      case 'minute':
        dateStart = new Date(values[0], values[1], values[2], values[3], values[4]);
        dateEnd = new Date(values[0], values[1], values[2], values[3], values[4] + 1);
        break;

      case 'second':
        dateStart = new Date(values[0], values[1], values[2], values[3], values[4], values[5]);
        dateEnd = new Date(values[0], values[1], values[2], values[3], values[4], values[5] + 1);
        break;

      default:
        dateStart = new Date(values[0], values[1], values[2]);
        dateEnd = new Date(values[0], values[1], values[2] + 1);
    }

    switch (selectedFilterOperation) {
      case '<':
        return [selector, '<', dateStart];

      case '<=':
        return [selector, '<', dateEnd];

      case '>':
        return [selector, '>=', dateEnd];

      case '>=':
        return [selector, '>=', dateStart];

      case '<>':
        return [[selector, '<', dateStart], 'or', [selector, '>=', dateEnd]];

      default:
        return [[selector, '>=', dateStart], 'and', [selector, '<', dateEnd]];
    }
  };

  var getFilterExpressionForNumber = function getFilterExpressionForNumber(filterValue, selectedFilterOperation, target) {
    var column = this;
    var selector = getFilterSelector(column, target);
    var groupInterval = getGroupInterval(column);

    if (target === 'headerFilter' && groupInterval && (0, _type.isDefined)(filterValue)) {
      var values = ('' + filterValue).split('/');
      var value = Number(values[values.length - 1]);
      var interval = groupInterval[values.length - 1];
      var startFilterValue = [selector, '>=', value];
      var endFilterValue = [selector, '<', value + interval];
      var condition = [startFilterValue, 'and', endFilterValue];
      return condition;
    }

    return [selector, selectedFilterOperation || '=', filterValue];
  };

  return {
    defaultCalculateFilterExpression: function defaultCalculateFilterExpression(filterValue, selectedFilterOperation, target) {
      var column = this;
      var selector = getFilterSelector(column, target);
      var isSearchByDisplayValue = column.calculateDisplayValue && target === 'search';
      var dataType = isSearchByDisplayValue && column.lookup && column.lookup.dataType || column.dataType;
      var filter = null;

      if ((target === 'headerFilter' || target === 'filterBuilder') && filterValue === null) {
        filter = [selector, selectedFilterOperation || '=', null];

        if (dataType === 'string') {
          filter = [filter, selectedFilterOperation === '=' ? 'or' : 'and', [selector, selectedFilterOperation || '=', '']];
        }
      } else if (dataType === 'string' && (!column.lookup || isSearchByDisplayValue)) {
        filter = [selector, selectedFilterOperation || 'contains', filterValue];
      } else if (selectedFilterOperation === 'between') {
        return getFilterExpressionByRange.apply(column, [filterValue, target]);
      } else if (isDateType(dataType) && (0, _type.isDefined)(filterValue)) {
        return getFilterExpressionForDate.apply(column, arguments);
      } else if (dataType === 'number') {
        return getFilterExpressionForNumber.apply(column, arguments);
      } else if (dataType !== 'object') {
        filter = [selector, selectedFilterOperation || '=', filterValue];
      }

      return filter;
    },
    getGroupInterval: getGroupInterval
  };
}();

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;