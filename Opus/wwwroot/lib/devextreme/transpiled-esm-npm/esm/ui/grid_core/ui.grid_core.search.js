import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import { isDefined } from '../../core/utils/type';
import { compileGetter } from '../../core/utils/data';
import gridCoreUtils from './ui.grid_core.utils';
import messageLocalization from '../../localization/message';
import dataQuery from '../../data/query';
var SEARCH_PANEL_CLASS = 'search-panel';
var SEARCH_TEXT_CLASS = 'search-text';
var HEADER_PANEL_CLASS = 'header-panel';
var FILTERING_TIMEOUT = 700;

function allowSearch(column) {
  return isDefined(column.allowSearch) ? column.allowSearch : column.allowFiltering;
}

function parseValue(column, text) {
  var lookup = column.lookup;

  if (!column.parseValue) {
    return text;
  }

  if (lookup) {
    return column.parseValue.call(lookup, text);
  }

  return column.parseValue(text);
}

export var searchModule = {
  defaultOptions: function defaultOptions() {
    return {
      searchPanel: {
        visible: false,
        width: 160,
        placeholder: messageLocalization.format('dxDataGrid-searchPanelPlaceholder'),
        highlightSearchText: true,
        highlightCaseSensitive: false,
        text: '',
        searchVisibleColumnsOnly: false
      }
    };
  },
  extenders: {
    controllers: {
      data: function () {
        var calculateSearchFilter = function calculateSearchFilter(that, text) {
          var i;
          var column;

          var columns = that._columnsController.getColumns();

          var searchVisibleColumnsOnly = that.option('searchPanel.searchVisibleColumnsOnly');
          var lookup;
          var filters = [];
          if (!text) return null;

          function onQueryDone(items) {
            var valueGetter = compileGetter(lookup.valueExpr);

            for (var _i = 0; _i < items.length; _i++) {
              var value = valueGetter(items[_i]);
              filters.push(column.createFilterExpression(value, null, 'search'));
            }
          }

          for (i = 0; i < columns.length; i++) {
            column = columns[i];
            if (searchVisibleColumnsOnly && !column.visible) continue;

            if (allowSearch(column) && column.calculateFilterExpression) {
              lookup = column.lookup;
              var filterValue = parseValue(column, text);

              if (lookup && lookup.items) {
                dataQuery(lookup.items).filter(column.createFilterExpression.call({
                  dataField: lookup.displayExpr,
                  dataType: lookup.dataType,
                  calculateFilterExpression: column.calculateFilterExpression
                }, filterValue, null, 'search')).enumerate().done(onQueryDone);
              } else {
                if (filterValue !== undefined) {
                  filters.push(column.createFilterExpression(filterValue, null, 'search'));
                }
              }
            }
          }

          if (filters.length === 0) {
            return ['!'];
          }

          return gridCoreUtils.combineFilters(filters, 'or');
        };

        return {
          publicMethods: function publicMethods() {
            return this.callBase().concat(['searchByText']);
          },
          _calculateAdditionalFilter: function _calculateAdditionalFilter() {
            var that = this;
            var filter = that.callBase();
            var searchFilter = calculateSearchFilter(that, that.option('searchPanel.text'));
            return gridCoreUtils.combineFilters([filter, searchFilter]);
          },
          searchByText: function searchByText(text) {
            this.option('searchPanel.text', text);
          },
          optionChanged: function optionChanged(args) {
            var that = this;

            switch (args.fullName) {
              case 'searchPanel.text':
              case 'searchPanel':
                that._applyFilter();

                args.handled = true;
                break;

              default:
                that.callBase(args);
            }
          }
        };
      }()
    },
    views: {
      headerPanel: function () {
        var getSearchPanelOptions = function getSearchPanelOptions(that) {
          return that.option('searchPanel');
        };

        return {
          _getToolbarItems: function _getToolbarItems() {
            var items = this.callBase();
            return this._prepareSearchItem(items);
          },
          _prepareSearchItem: function _prepareSearchItem(items) {
            var that = this;
            var dataController = that.getController('data');
            var searchPanelOptions = getSearchPanelOptions(that);

            if (searchPanelOptions && searchPanelOptions.visible) {
              var toolbarItem = {
                template: function template(data, index, container) {
                  var $search = $('<div>').addClass(that.addWidgetPrefix(SEARCH_PANEL_CLASS)).appendTo(container);
                  that.getController('editorFactory').createEditor($search, {
                    width: searchPanelOptions.width,
                    placeholder: searchPanelOptions.placeholder,
                    parentType: 'searchPanel',
                    value: that.option('searchPanel.text'),
                    updateValueTimeout: FILTERING_TIMEOUT,
                    setValue: function setValue(value) {
                      dataController.searchByText(value);
                    },
                    editorOptions: {
                      inputAttr: {
                        'aria-label': messageLocalization.format("".concat(that.component.NAME, "-ariaSearchInGrid"))
                      }
                    }
                  });
                  that.resize();
                },
                name: 'searchPanel',
                location: 'after',
                locateInMenu: 'never',
                sortIndex: 40
              };
              items.push(toolbarItem);
            }

            return items;
          },
          getSearchTextEditor: function getSearchTextEditor() {
            var that = this;
            var $element = that.element();
            var $searchPanel = $element.find('.' + that.addWidgetPrefix(SEARCH_PANEL_CLASS)).filter(function () {
              return $(this).closest('.' + that.addWidgetPrefix(HEADER_PANEL_CLASS)).is($element);
            });

            if ($searchPanel.length) {
              return $searchPanel.dxTextBox('instance');
            }

            return null;
          },
          isVisible: function isVisible() {
            var searchPanelOptions = getSearchPanelOptions(this);
            return this.callBase() || searchPanelOptions && searchPanelOptions.visible;
          },
          optionChanged: function optionChanged(args) {
            if (args.name === 'searchPanel') {
              if (args.fullName === 'searchPanel.text') {
                var editor = this.getSearchTextEditor();

                if (editor) {
                  editor.option('value', args.value);
                }
              } else {
                this._invalidate();
              }

              args.handled = true;
            } else {
              this.callBase(args);
            }
          }
        };
      }(),
      rowsView: {
        init: function init() {
          this.callBase.apply(this, arguments);
          this._searchParams = [];
        },
        _getFormattedSearchText: function _getFormattedSearchText(column, searchText) {
          var value = parseValue(column, searchText);
          var formatOptions = gridCoreUtils.getFormatOptionsByColumn(column, 'search');
          return gridCoreUtils.formatValue(value, formatOptions);
        },
        _getStringNormalizer: function _getStringNormalizer() {
          var isCaseSensitive = this.option('searchPanel.highlightCaseSensitive');
          return function (str) {
            return isCaseSensitive ? str : str.toLowerCase();
          };
        },
        _findHighlightingTextNodes: function _findHighlightingTextNodes(column, cellElement, searchText) {
          var _$items;

          var that = this;
          var $parent = cellElement.parent();
          var $items;

          var stringNormalizer = this._getStringNormalizer();

          var normalizedSearchText = stringNormalizer(searchText);
          var resultTextNodes = [];

          if (!$parent.length) {
            $parent = $('<div>').append(cellElement);
          } else if (column) {
            if (column.groupIndex >= 0 && !column.showWhenGrouped) {
              $items = cellElement;
            } else {
              var columnIndex = that._columnsController.getVisibleIndex(column.index);

              $items = $parent.children('td').eq(columnIndex).find('*');
            }
          }

          $items = (_$items = $items) !== null && _$items !== void 0 && _$items.length ? $items : $parent.find('*');
          $items.each(function (_, element) {
            var $contents = $(element).contents();

            for (var i = 0; i < $contents.length; i++) {
              var node = $contents.get(i);

              if (node.nodeType === 3) {
                var normalizedText = stringNormalizer(node.textContent || node.nodeValue);

                if (normalizedText.indexOf(normalizedSearchText) > -1) {
                  resultTextNodes.push(node);
                }
              }
            }
          });
          return resultTextNodes;
        },
        _highlightSearchTextCore: function _highlightSearchTextCore($textNode, searchText) {
          var that = this;
          var $searchTextSpan = $('<span>').addClass(that.addWidgetPrefix(SEARCH_TEXT_CLASS));
          var text = $textNode.text();
          var firstContentElement = $textNode[0];

          var stringNormalizer = this._getStringNormalizer();

          var index = stringNormalizer(text).indexOf(stringNormalizer(searchText));

          if (index >= 0) {
            if (firstContentElement.textContent) {
              firstContentElement.textContent = text.substr(0, index);
            } else {
              firstContentElement.nodeValue = text.substr(0, index);
            }

            $textNode.after($searchTextSpan.text(text.substr(index, searchText.length)));
            $textNode = $(domAdapter.createTextNode(text.substr(index + searchText.length))).insertAfter($searchTextSpan);
            return that._highlightSearchTextCore($textNode, searchText);
          }
        },
        _highlightSearchText: function _highlightSearchText(cellElement, isEquals, column) {
          var that = this;

          var stringNormalizer = this._getStringNormalizer();

          var searchText = that.option('searchPanel.text');

          if (isEquals && column) {
            searchText = searchText && that._getFormattedSearchText(column, searchText);
          }

          if (searchText && that.option('searchPanel.highlightSearchText')) {
            var textNodes = that._findHighlightingTextNodes(column, cellElement, searchText);

            textNodes.forEach(textNode => {
              if (isEquals) {
                if (stringNormalizer($(textNode).text()) === stringNormalizer(searchText)) {
                  $(textNode).replaceWith($('<span>').addClass(that.addWidgetPrefix(SEARCH_TEXT_CLASS)).text($(textNode).text()));
                }
              } else {
                that._highlightSearchTextCore($(textNode), searchText);
              }
            });
          }
        },
        _renderCore: function _renderCore() {
          this.callBase.apply(this, arguments); // T103538

          if (this.option().rowTemplate || this.option('dataRowTemplate')) {
            if (this.option('templatesRenderAsynchronously')) {
              clearTimeout(this._highlightTimer);
              this._highlightTimer = setTimeout(function () {
                this._highlightSearchText(this.getTableElement());
              }.bind(this));
            } else {
              this._highlightSearchText(this.getTableElement());
            }
          }
        },
        _updateCell: function _updateCell($cell, parameters) {
          var column = parameters.column;
          var dataType = column.lookup && column.lookup.dataType || column.dataType;
          var isEquals = dataType !== 'string';

          if (allowSearch(column) && !parameters.isOnForm) {
            if (this.option('templatesRenderAsynchronously')) {
              if (!this._searchParams.length) {
                clearTimeout(this._highlightTimer);
                this._highlightTimer = setTimeout(function () {
                  this._searchParams.forEach(function (params) {
                    this._highlightSearchText.apply(this, params);
                  }.bind(this));

                  this._searchParams = [];
                }.bind(this));
              }

              this._searchParams.push([$cell, isEquals, column]);
            } else {
              this._highlightSearchText($cell, isEquals, column);
            }
          }

          this.callBase($cell, parameters);
        },
        dispose: function dispose() {
          clearTimeout(this._highlightTimer);
          this.callBase();
        }
      }
    }
  }
};