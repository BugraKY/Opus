import $ from '../../core/renderer';
import messageLocalization from '../../localization/message';
import { extend } from '../../core/utils/extend';
import { DataSource } from '../../data/data_source/data_source';
import { Deferred } from '../../core/utils/deferred';
import { isGroup, isCondition, getFilterExpression, renderValueText } from '../filter_builder/utils';
import errors from '../widget/ui.errors';

function baseOperation(grid) {
  var calculateFilterExpression = function calculateFilterExpression(filterValue, field, fields) {
    var result = [];
    var lastIndex = filterValue.length - 1;
    filterValue && filterValue.forEach(function (value, index) {
      if (isCondition(value) || isGroup(value)) {
        var filterExpression = getFilterExpression(value, fields, [], 'headerFilter');
        result.push(filterExpression);
      } else {
        result.push(getFilterExpression([field.dataField, '=', value], fields, [], 'headerFilter'));
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
      var result = new Deferred();
      var itemsDeferred = options.items || new Deferred();

      if (!options.items) {
        column = extend({}, column, {
          filterType: 'include',
          filterValues: values
        });
        var dataSourceOptions = headerFilterController.getDataSource(column);
        dataSourceOptions.paginate = false;
        var dataSource = new DataSource(dataSourceOptions);
        var key = dataSource.store().key();

        if (key) {
          var {
            values: _values
          } = options;

          if (_values && _values.length > 1) {
            var filter = _values.reduce((result, value) => {
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
          errors.log('W1017');
        }

        options.items = itemsDeferred;
        dataSource.load().done(itemsDeferred.resolve);
      }

      itemsDeferred.done(items => {
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
      var div = $('<div>').addClass('dx-filterbuilder-item-value-text').appendTo(container);
      var column = extend(true, {}, grid.columnOption(conditionInfo.field.dataField));
      renderValueText(div, conditionInfo.text && conditionInfo.text.split('|'));

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

export function anyOf(grid) {
  return extend(baseOperation(grid), {
    name: 'anyof',
    icon: 'selectall',
    caption: messageLocalization.format('dxFilterBuilder-filterOperationAnyOf')
  });
}
export function noneOf(grid) {
  var baseOp = baseOperation(grid);
  return extend({}, baseOp, {
    calculateFilterExpression: function calculateFilterExpression(filterValue, field, fields) {
      var baseFilter = baseOp.calculateFilterExpression(filterValue, field, fields);
      if (!baseFilter || baseFilter.length === 0) return null;
      return baseFilter[0] === '!' ? baseFilter : ['!', baseFilter];
    },
    name: 'noneof',
    icon: 'unselectall',
    caption: messageLocalization.format('dxFilterBuilder-filterOperationNoneOf')
  });
}