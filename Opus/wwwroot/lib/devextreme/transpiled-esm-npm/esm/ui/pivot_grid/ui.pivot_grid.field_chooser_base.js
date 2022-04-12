import { getOuterWidth } from '../../core/utils/size';
import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import ArrayStore from '../../data/array_store';
import { name as clickEventName } from '../../events/click';
import { noop } from '../../core/utils/common';
import { isDefined } from '../../core/utils/type';
import { inArray } from '../../core/utils/array';
import { extend } from '../../core/utils/extend';
import { each, map } from '../../core/utils/iterator';
import localizationMessage from '../../localization/message';
import registerComponent from '../../core/component_registrator';
import Widget from '../widget/ui.widget';
import { HeaderFilterView as HeaderFilterViewBase, updateHeaderFilterItemSelectionState, headerFilterMixin } from '../grid_core/ui.grid_core.header_filter_core';
import columnStateMixin from '../grid_core/ui.grid_core.column_state_mixin';
import sortingMixin from '../grid_core/ui.grid_core.sorting_mixin';
import { foreachTree, createPath } from './ui.pivot_grid.utils';
import Sortable from './ui.sortable';
import { Deferred } from '../../core/utils/deferred';
var IE_FIELD_WIDTH_CORRECTION = 1;
var DIV = '<div>';
var HeaderFilterView = HeaderFilterViewBase.inherit({
  _getSearchExpr: function _getSearchExpr(options) {
    options.useDefaultSearchExpr = true;
    return this.callBase(options);
  }
});

var processItems = function processItems(groupItems, field) {
  var filterValues = [];
  var isTree = !!field.groupName;
  var isExcludeFilterType = field.filterType === 'exclude';

  if (field.filterValues) {
    each(field.filterValues, function (_, filterValue) {
      filterValues.push(Array.isArray(filterValue) ? filterValue.join('/') : filterValue && filterValue.valueOf());
    });
  }

  foreachTree(groupItems, function (items) {
    var item = items[0];
    var path = createPath(items);
    var preparedFilterValueByText = isTree ? map(items, function (item) {
      return item.text;
    }).reverse().join('/') : item.text;
    item.value = isTree ? path.slice(0) : item.key || item.value;
    var preparedFilterValue = isTree ? path.join('/') : item.value && item.value.valueOf();

    if (item.children) {
      item.items = item.children;
      item.children = null;
    }

    updateHeaderFilterItemSelectionState(item, item.key && inArray(preparedFilterValueByText, filterValues) > -1 || inArray(preparedFilterValue, filterValues) > -1, isExcludeFilterType);
  });
};

function getMainGroupField(dataSource, sourceField) {
  var field = sourceField;

  if (isDefined(sourceField.groupIndex)) {
    field = dataSource.getAreaFields(sourceField.area, true)[sourceField.areaIndex];
  }

  return field;
}

function getStringState(state) {
  state = state || {};
  return JSON.stringify([state.fields, state.columnExpandedPaths, state.rowExpandedPaths]);
}

var FieldChooserBase = Widget.inherit(columnStateMixin).inherit(sortingMixin).inherit(headerFilterMixin).inherit({
  _getDefaultOptions: function _getDefaultOptions() {
    return extend(this.callBase(), {
      allowFieldDragging: true,
      applyChangesMode: 'instantly',
      state: null,
      headerFilter: {
        width: 252,
        height: 325,
        searchTimeout: 500,
        texts: {
          emptyValue: localizationMessage.format('dxDataGrid-headerFilterEmptyValue'),
          ok: localizationMessage.format('dxDataGrid-headerFilterOK'),
          cancel: localizationMessage.format('dxDataGrid-headerFilterCancel')
        }
      }
    });
  },
  _init: function _init() {
    this.callBase();
    this._headerFilterView = new HeaderFilterView(this);

    this._refreshDataSource();

    this.subscribeToEvents();
  },
  _refreshDataSource: function _refreshDataSource() {
    var dataSource = this.option('dataSource');

    if (dataSource && dataSource.fields && dataSource.load
    /* instanceof DX.ui.dxPivotGrid.DataSource */
    ) {
      this._dataSource = dataSource;
    }
  },
  _optionChanged: function _optionChanged(args) {
    switch (args.name) {
      case 'dataSource':
        this._refreshDataSource();

        break;

      case 'applyChangesMode':
        break;

      case 'state':
        if (this._skipStateChange || !this._dataSource) {
          break;
        }

        if (this.option('applyChangesMode') === 'instantly' && getStringState(this._dataSource.state()) !== getStringState(args.value)) {
          this._dataSource.state(args.value);
        } else {
          this._clean(true);

          this._renderComponent();
        }

        break;

      case 'headerFilter':
      case 'allowFieldDragging':
        this._invalidate();

        break;

      default:
        this.callBase(args);
    }
  },
  renderField: function renderField(field, showColumnLines) {
    var that = this;
    var $fieldContent = $(DIV).addClass('dx-area-field-content').text(field.caption || field.dataField);
    var $fieldElement = $(DIV).addClass('dx-area-field').addClass('dx-area-box').data('field', field).append($fieldContent);
    var mainGroupField = getMainGroupField(that._dataSource, field);

    if (field.area !== 'data') {
      if (field.allowSorting) {
        that._applyColumnState({
          name: 'sort',
          rootElement: $fieldElement,
          column: {
            alignment: that.option('rtlEnabled') ? 'right' : 'left',
            sortOrder: field.sortOrder === 'desc' ? 'desc' : 'asc',
            allowSorting: field.allowSorting
          },
          showColumnLines: showColumnLines
        });
      }

      that._applyColumnState({
        name: 'headerFilter',
        rootElement: $fieldElement,
        column: {
          alignment: that.option('rtlEnabled') ? 'right' : 'left',
          filterValues: mainGroupField.filterValues,
          allowFiltering: mainGroupField.allowFiltering && !field.groupIndex,
          allowSorting: field.allowSorting
        },
        showColumnLines: showColumnLines
      });
    }

    if (field.groupName) {
      $fieldElement.attr('item-group', field.groupName);
    }

    return $fieldElement;
  },
  _clean: function _clean() {},
  _render: function _render() {
    this.callBase();

    this._headerFilterView.render(this.$element());
  },
  renderSortable: function renderSortable() {
    var that = this;

    that._createComponent(that.$element(), Sortable, extend({
      allowDragging: that.option('allowFieldDragging'),
      itemSelector: '.dx-area-field',
      itemContainerSelector: '.dx-area-field-container',
      groupSelector: '.dx-area-fields',
      groupFilter: function groupFilter() {
        var dataSource = that._dataSource;
        var $sortable = $(this).closest('.dx-sortable-old');
        var pivotGrid = $sortable.data('dxPivotGrid');
        var pivotGridFieldChooser = $sortable.data('dxPivotGridFieldChooser');

        if (pivotGrid) {
          return pivotGrid.getDataSource() === dataSource;
        }

        if (pivotGridFieldChooser) {
          return pivotGridFieldChooser.option('dataSource') === dataSource;
        }

        return false;
      },
      itemRender: function itemRender($sourceItem, target) {
        var $item;

        if ($sourceItem.hasClass('dx-area-box')) {
          $item = $sourceItem.clone();

          if (target === 'drag') {
            each($sourceItem, function (index, sourceItem) {
              $item.eq(index).css('width', parseInt(getOuterWidth(sourceItem), 10) + IE_FIELD_WIDTH_CORRECTION);
            });
          }
        } else {
          $item = $(DIV).addClass('dx-area-field').addClass('dx-area-box').text($sourceItem.text());
        }

        if (target === 'drag') {
          var wrapperContainer = $(DIV);
          each($item, function (_, item) {
            var wrapper = $('<div>').addClass('dx-pivotgrid-fields-container').addClass('dx-widget').append($(item));
            wrapperContainer.append(wrapper);
          });
          return wrapperContainer.children();
        }

        return $item;
      },
      onDragging: function onDragging(e) {
        var field = e.sourceElement.data('field');
        var targetGroup = e.targetGroup;
        e.cancel = false;

        if (field.isMeasure === true) {
          if (targetGroup === 'column' || targetGroup === 'row' || targetGroup === 'filter') {
            e.cancel = true;
          }
        } else if (field.isMeasure === false && targetGroup === 'data') {
          e.cancel = true;
        }
      },
      useIndicator: true,
      onChanged: function onChanged(e) {
        var dataSource = that._dataSource;
        var field = e.sourceElement.data('field');
        e.removeSourceElement = !!e.sourceGroup;

        that._adjustSortableOnChangedArgs(e);

        if (field) {
          that._applyChanges([getMainGroupField(dataSource, field)], {
            area: e.targetGroup,
            areaIndex: e.targetIndex
          });
        }
      }
    }, that._getSortableOptions()));
  },
  _processDemandState: function _processDemandState(func) {
    var that = this;
    var isInstantlyMode = that.option('applyChangesMode') === 'instantly';
    var dataSource = that._dataSource;

    if (isInstantlyMode) {
      func(dataSource, isInstantlyMode);
    } else {
      var currentState = dataSource.state();
      var pivotGridState = that.option('state');

      if (pivotGridState) {
        dataSource.state(pivotGridState, true);
      }

      func(dataSource, isInstantlyMode);
      dataSource.state(currentState, true);
    }
  },

  _applyChanges(fields, props) {
    var that = this;

    that._processDemandState(function (dataSource, isInstantlyMode) {
      fields.forEach(_ref => {
        var {
          index
        } = _ref;
        dataSource.field(index, props);
      });

      if (isInstantlyMode) {
        dataSource.load();
      } else {
        that._changedHandler();
      }
    });
  },

  _adjustSortableOnChangedArgs: function _adjustSortableOnChangedArgs(e) {
    e.removeSourceElement = false;
    e.removeTargetElement = true;
    e.removeSourceClass = false;
  },
  _getSortableOptions: function _getSortableOptions() {
    return {
      direction: 'auto'
    };
  },
  subscribeToEvents: function subscribeToEvents(element) {
    var that = this;

    var func = function func(e) {
      var field = $(e.currentTarget).data('field');
      var mainGroupField = extend(true, {}, getMainGroupField(that._dataSource, field));
      var isHeaderFilter = $(e.target).hasClass('dx-header-filter');
      var dataSource = that._dataSource;
      var type = mainGroupField.groupName ? 'tree' : 'list';
      var paginate = dataSource.paginate() && type === 'list';

      if (isHeaderFilter) {
        that._headerFilterView.showHeaderFilterMenu($(e.currentTarget), extend(mainGroupField, {
          type: type,
          encodeHtml: that.option('encodeHtml'),
          dataSource: {
            useDefaultSearch: !paginate,
            // paginate: false,
            load: function load(options) {
              var userData = options.userData;

              if (userData.store) {
                return userData.store.load(options);
              } else {
                var d = new Deferred();
                dataSource.getFieldValues(mainGroupField.index, that.option('headerFilter.showRelevantValues'), paginate ? options : undefined).done(function (data) {
                  var emptyValue = that.option('headerFilter.texts.emptyValue');
                  data.forEach(element => {
                    if (!element.text) {
                      element.text = emptyValue;
                    }
                  });

                  if (paginate) {
                    d.resolve(data);
                  } else {
                    userData.store = new ArrayStore(data);
                    userData.store.load(options).done(d.resolve).fail(d.reject);
                  }
                }).fail(d.reject);
                return d;
              }
            },
            postProcess: function postProcess(data) {
              processItems(data, mainGroupField);
              return data;
            }
          },
          apply: function apply() {
            that._applyChanges([mainGroupField], {
              filterValues: this.filterValues,
              filterType: this.filterType
            });
          }
        }));
      } else if (field.allowSorting && field.area !== 'data') {
        that._applyChanges([field], {
          sortOrder: field.sortOrder === 'desc' ? 'asc' : 'desc'
        });
      }
    };

    if (element) {
      eventsEngine.on(element, clickEventName, '.dx-area-field.dx-area-box', func);
      return;
    }

    eventsEngine.on(that.$element(), clickEventName, '.dx-area-field.dx-area-box', func);
  },
  _initTemplates: noop,
  addWidgetPrefix: function addWidgetPrefix(className) {
    return 'dx-pivotgrid-' + className;
  }
});
registerComponent('dxPivotGridFieldChooserBase', FieldChooserBase);
export default FieldChooserBase;