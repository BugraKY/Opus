"use strict";

exports.anyOf = anyOf;
exports.noneOf = noneOf;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _message = _interopRequireDefault(require("../../localization/message"));

var _extend = require("../../core/utils/extend");

var _data_source = require("../../data/data_source/data_source");

var _deferred = require("../../core/utils/deferred");

var _utils = require("../filter_builder/utils");

var _ui = _interopRequireDefault(require("../widget/ui.errors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function baseOperation(grid) {
  var calculateFilterExpression = function calculateFilterExpression(filterValue, field, fields) {
    var result = [];
    var lastIndex = filterValue.length - 1;
    filterValue && filterValue.forEach(function (value, index) {
      if ((0, _utils.isCondition)(value) || (0, _utils.isGroup)(value)) {
        var filterExpression = (0, _utils.getFilterExpression)(value, fields, [], 'headerFilter');
        result.push(filterExpression);
      } else {
        result.push((0, _utils.getFilterExpression)([field.dataField, '=', value], fields, [], 'headerFilter'));
      }

      index !== lastIndex && result.push('or');
    });

    if (result.length === 1) {
      result = result[0];
    }

    return result;
  };

  var getFullText = function getFullText(itemText, parentText) {
    return parentText ? parentText + '/' + itemText : itemText;
  };

  var getSelectedItemsTexts = function getSelectedItemsTexts(items, parentText) {
    var result = [];
    items.forEach(function (item) {
      if (item.items) {
        var selectedItemsTexts = getSelectedItemsTexts(item.items, getFullText(item.text, parentText));
        result = result.concat(selectedItemsTexts);
      }

      item.selected && result.push(getFullText(item.text, parentText));
    });
    return result;
  };

  var headerFilterController = grid && grid.getController('headerFilter');

  var customizeText = function customizeText(fieldInfo, options) {
    options = options || {};
    var value = fieldInfo.value;
    var column = grid.columnOption(fieldInfo.field.dataField);
    var headerFilter = column && column.headerFilter;
    var lookup = column && column.lookup;
    var values = options.values || [value];

    if (headerFilter && headerFilter.dataSource || lookup && lookup.dataSource) {
      var result = new _deferred.Deferred();
      var itemsDeferred = options.items || new _deferred.Deferred();

      if (!options.items) {
        column = (0, _extend.extend)({}, column, {
          filterType: 'include',
          filterValues: values
        });
        var dataSourceOptions = headerFilterController.getDataSource(column);
        dataSourceOptions.paginate = false;
        var dataSource = new _data_source.DataSource(dataSourceOptions);
        var key = dataSource.store().key();

        if (key) {
          var _options = options,
              _values = _options.values;

          if (_values && _values.length > 1) {
            var filter = _values.reduce(function (result, value) {
              if (result.length) {
                result.push('or');
              }

              result.push([key, '=', value]);
              return result;
            }, []);

            dataSource.filter(filter);
          } else {
            dataSource.filter([key, '=', fieldInfo.value]);
          }
        } else if (fieldInfo.field.calculateDisplayValue) {
          _ui.default.log('W1017');
        }

        options.items = itemsDeferred;
        dataSource.load().done(itemsDeferred.resolve);
      }

      itemsDeferred.done(function (items) {
        var index = values.indexOf(fieldInfo.value);
        result.resolve(getSelectedItemsTexts(items)[index]);
      });
      return result;
    } else {
      var text = headerFilterController.getHeaderItemText(value, column, 0, grid.option('headerFilter'));
      return text;
    }
  };

  return {
    dataTypes: ['string', 'date', 'datetime', 'number', 'boolean', 'object'],
    calculateFilterExpression: calculateFilterExpression,
    editorTemplate: function editorTemplate(conditionInfo, container) {
      var div = (0, _renderer.default)('<div>').addClass('dx-filterbuilder-item-value-text').appendTo(container);
      var column = (0, _extend.extend)(true, {}, grid.columnOption(conditionInfo.field.dataField));
      (0, _utils.renderValueText)(div, conditionInfo.text && conditionInfo.text.split('|'));

      var setValue = function setValue(value) {
        conditionInfo.setValue(value);
      };

      column.filterType = 'include';
      column.filterValues = conditionInfo.value ? conditionInfo.value.slice() : [];
      headerFilterController.showHeaderFilterMenuBase({
        columnElement: div,
        column: column,
        apply: function apply() {
          setValue(this.filterValues);
          headerFilterController.hideHeaderFilterMenu();
          conditionInfo.closeEditor();
        },
        onHidden: function onHidden() {
          conditionInfo.closeEditor();
        },
        isFilterBuilder: true
      });
      return container;
    },
    customizeText: customizeText
  };
}

function anyOf(grid) {
  return (0, _extend.extend)(baseOperation(grid), {
    name: 'anyof',
    icon: 'selectall',
    caption: _message.default.format('dxFilterBuilder-filterOperationAnyOf')
  });
}

function noneOf(grid) {
  var baseOp = baseOperation(grid);
  return (0, _extend.extend)({}, baseOp, {
    calculateFilterExpression: function calculateFilterExpression(filterValue, field, fields) {
      var baseFilter = baseOp.calculateFilterExpression(filterValue, field, fields);
      if (!baseFilter || baseFilter.length === 0) return null;
      return baseFilter[0] === '!' ? baseFilter : ['!', baseFilter];
    },
    name: 'noneof',
    icon: 'unselectall',
    caption: _message.default.format('dxFilterBuilder-filterOperationNoneOf')
  });
}