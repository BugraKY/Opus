import { getOuterWidth, getOuterHeight } from '../../core/utils/size';
import $ from '../../core/renderer';
import { deferUpdate, noop } from '../../core/utils/common';
import modules from './ui.grid_core.modules';
import { ColumnsView } from './ui.grid_core.columns_view';
import messageLocalization from '../../localization/message';
import { isMaterial as isMaterialTheme, isGeneric, current } from '../themes';
import Button from '../button';
import TreeView from '../tree_view';
import devices from '../../core/devices';
import Popup from '../popup';
import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
var COLUMN_CHOOSER_CLASS = 'column-chooser';
var COLUMN_CHOOSER_BUTTON_CLASS = 'column-chooser-button';
var NOTOUCH_ACTION_CLASS = 'notouch-action';
var COLUMN_CHOOSER_LIST_CLASS = 'column-chooser-list';
var COLUMN_CHOOSER_PLAIN_CLASS = 'column-chooser-plain';
var COLUMN_CHOOSER_DRAG_CLASS = 'column-chooser-mode-drag';
var COLUMN_CHOOSER_SELECT_CLASS = 'column-chooser-mode-select';
var COLUMN_CHOOSER_ICON_NAME = 'column-chooser';
var COLUMN_CHOOSER_ITEM_CLASS = 'dx-column-chooser-item';
var TREEVIEW_NODE_SELECTOR = '.dx-treeview-node';
var CHECKBOX_SELECTOR = '.dx-checkbox';
var CLICK_TIMEOUT = 300;

var processItems = function processItems(that, chooserColumns) {
  var items = [];
  var isSelectMode = that.option('columnChooser.mode') === 'select';

  if (chooserColumns.length) {
    each(chooserColumns, function (index, column) {
      var item = {
        text: column.caption,
        cssClass: column.cssClass,
        allowHiding: column.allowHiding,
        expanded: true,
        id: column.index,
        disabled: false,
        disableCheckBox: column.allowHiding === false,
        parentId: isDefined(column.ownerBand) ? column.ownerBand : null
      };

      if (isSelectMode) {
        item.selected = column.visible;
      }

      items.push(item);
    });
  }

  return items;
};

var ColumnChooserController = modules.ViewController.inherit({
  renderShowColumnChooserButton: function renderShowColumnChooserButton($element) {
    var that = this;
    var columnChooserButtonClass = that.addWidgetPrefix(COLUMN_CHOOSER_BUTTON_CLASS);
    var columnChooserEnabled = that.option('columnChooser.enabled');
    var $showColumnChooserButton = $element.find('.' + columnChooserButtonClass);
    var $columnChooserButton;

    if (columnChooserEnabled) {
      if (!$showColumnChooserButton.length) {
        $columnChooserButton = $('<div>').addClass(columnChooserButtonClass).appendTo($element);

        that._createComponent($columnChooserButton, Button, {
          icon: COLUMN_CHOOSER_ICON_NAME,
          onClick: function onClick() {
            that.getView('columnChooserView').showColumnChooser();
          },
          hint: that.option('columnChooser.title'),
          integrationOptions: {}
        });
      } else {
        $showColumnChooserButton.show();
      }
    } else {
      $showColumnChooserButton.hide();
    }
  },
  getPosition: function getPosition() {
    var rowsView = this.getView('rowsView');
    return {
      my: 'right bottom',
      at: 'right bottom',
      of: rowsView && rowsView.element(),
      collision: 'fit',
      offset: '-2 -2',
      boundaryOffset: '2 2'
    };
  }
});
var ColumnChooserView = ColumnsView.inherit({
  _resizeCore: noop,
  _isWinDevice: function _isWinDevice() {
    return !!devices.real().win;
  },
  _updateList: function _updateList(change) {
    var items;

    var $popupContent = this._popupContainer.$content();

    var isSelectMode = this.option('columnChooser.mode') === 'select';
    var columnChooserList = this._columnChooserList;

    var chooserColumns = this._columnsController.getChooserColumns(isSelectMode); // T726413


    if (isSelectMode && columnChooserList && change && change.changeType === 'selection') {
      items = processItems(this, chooserColumns);

      for (var i = 0; i < items.length; i++) {
        var selected = items[i].selected;
        var id = items[i].id;

        if (id === change.columnIndex) {
          if (selected) {
            columnChooserList.selectItem(id, selected);
          } else {
            columnChooserList.unselectItem(id, selected);
          }
        }
      }
    } else if (!isSelectMode || !columnChooserList || change === 'full') {
      this._popupContainer.$wrapper().toggleClass(this.addWidgetPrefix(COLUMN_CHOOSER_DRAG_CLASS), !isSelectMode).toggleClass(this.addWidgetPrefix(COLUMN_CHOOSER_SELECT_CLASS), isSelectMode);

      items = processItems(this, chooserColumns);

      this._renderTreeView($popupContent, items);
    }
  },
  _initializePopupContainer: function _initializePopupContainer() {
    var that = this;
    var $element = that.element().addClass(that.addWidgetPrefix(COLUMN_CHOOSER_CLASS));
    var columnChooserOptions = that.option('columnChooser');
    var themeName = current();
    var isGenericTheme = isGeneric(themeName);
    var isMaterial = isMaterialTheme(themeName);
    var dxPopupOptions = {
      visible: false,
      shading: false,
      showCloseButton: false,
      dragEnabled: true,
      resizeEnabled: true,
      copyRootClassesToWrapper: true,
      _ignoreCopyRootClassesToWrapperDeprecation: true,
      toolbarItems: [{
        text: columnChooserOptions.title,
        toolbar: 'top',
        location: isGenericTheme || isMaterial ? 'before' : 'center'
      }],
      position: that.getController('columnChooser').getPosition(),
      width: columnChooserOptions.width,
      height: columnChooserOptions.height,
      rtlEnabled: that.option('rtlEnabled'),
      onHidden: function onHidden() {
        if (that._isWinDevice()) {
          $('body').removeClass(that.addWidgetPrefix(NOTOUCH_ACTION_CLASS));
        }
      },
      container: columnChooserOptions.container
    };

    if (isGenericTheme || isMaterial) {
      extend(dxPopupOptions, {
        showCloseButton: true
      });
    } else {
      dxPopupOptions.toolbarItems[dxPopupOptions.toolbarItems.length] = {
        shortcut: 'cancel'
      };
    }

    if (!isDefined(this._popupContainer)) {
      that._popupContainer = that._createComponent($element, Popup, dxPopupOptions);

      that._popupContainer.on('optionChanged', function (args) {
        if (args.name === 'visible') {
          that.renderCompleted.fire();
        }
      });
    } else {
      this._popupContainer.option(dxPopupOptions);
    }
  },
  _renderCore: function _renderCore(change) {
    if (this._popupContainer) {
      this._updateList(change);
    }
  },
  _renderTreeView: function _renderTreeView($container, items) {
    var that = this;
    var columnChooser = this.option('columnChooser');
    var isSelectMode = columnChooser.mode === 'select';
    var treeViewConfig = {
      items: items,
      dataStructure: 'plain',
      activeStateEnabled: true,
      focusStateEnabled: true,
      hoverStateEnabled: true,
      itemTemplate: 'item',
      showCheckBoxesMode: 'none',
      rootValue: null,
      searchEnabled: columnChooser.allowSearch,
      searchTimeout: columnChooser.searchTimeout,
      onItemRendered: function onItemRendered(e) {
        if (e.itemData.disableCheckBox) {
          var $treeViewNode = $(e.itemElement).closest(TREEVIEW_NODE_SELECTOR);
          var $checkBox;

          if ($treeViewNode.length) {
            $checkBox = $treeViewNode.find(CHECKBOX_SELECTOR);

            if ($checkBox.length) {
              var checkBoxInstance = $checkBox.data('dxCheckBox');
              checkBoxInstance && checkBoxInstance.option('disabled', true);
            }
          }
        }
      }
    };
    var scrollableInstance = $container.find('.dx-scrollable').data('dxScrollable');
    var scrollTop = scrollableInstance && scrollableInstance.scrollTop();

    if (isSelectMode && !this._columnsController.isBandColumnsUsed()) {
      $container.addClass(this.addWidgetPrefix(COLUMN_CHOOSER_PLAIN_CLASS));
    }

    treeViewConfig.onContentReady = function (e) {
      deferUpdate(function () {
        if (scrollTop) {
          var scrollable = $(e.element).find('.dx-scrollable').data('dxScrollable');
          scrollable && scrollable.scrollTo({
            y: scrollTop
          });
        }

        that.renderCompleted.fire();
      });
    };

    if (this._isWinDevice()) {
      treeViewConfig.useNativeScrolling = false;
    }

    extend(treeViewConfig, isSelectMode ? this._prepareSelectModeConfig() : this._prepareDragModeConfig());

    if (this._columnChooserList) {
      if (!treeViewConfig.searchEnabled) {
        treeViewConfig.searchValue = '';
      }

      this._columnChooserList.option(treeViewConfig);
    } else {
      this._columnChooserList = this._createComponent($container, TreeView, treeViewConfig);
      $container.addClass(this.addWidgetPrefix(COLUMN_CHOOSER_LIST_CLASS));
    }
  },
  _prepareDragModeConfig: function _prepareDragModeConfig() {
    var columnChooserOptions = this.option('columnChooser');
    return {
      noDataText: columnChooserOptions.emptyPanelText,
      activeStateEnabled: false,
      focusStateEnabled: false,
      hoverStateEnabled: false,
      itemTemplate: function itemTemplate(data, index, item) {
        $(item).text(data.text).parent().addClass(data.cssClass).addClass(COLUMN_CHOOSER_ITEM_CLASS);
      }
    };
  },
  _prepareSelectModeConfig: function _prepareSelectModeConfig() {
    var that = this;

    var selectionChangedHandler = function selectionChangedHandler(e) {
      var visibleColumns = that._columnsController.getVisibleColumns().filter(function (item) {
        return !item.command;
      });

      var isLastColumnUnselected = visibleColumns.length === 1 && !e.itemData.selected;

      if (isLastColumnUnselected) {
        e.component.selectItem(e.itemElement);
      } else {
        setTimeout(function () {
          that._columnsController.columnOption(e.itemData.id, 'visible', e.itemData.selected);
        }, CLICK_TIMEOUT);
      }
    };

    return {
      selectNodesRecursive: false,
      showCheckBoxesMode: 'normal',
      onItemSelectionChanged: selectionChangedHandler
    };
  },
  _columnOptionChanged: function _columnOptionChanged(e) {
    var changeTypes = e.changeTypes;
    var optionNames = e.optionNames;
    var isSelectMode = this.option('columnChooser.mode') === 'select';
    this.callBase(e);

    if (isSelectMode) {
      var needPartialRender = optionNames.visible && optionNames.length === 1 && e.columnIndex !== undefined;
      var needFullRender = optionNames.showInColumnChooser || optionNames.caption || optionNames.visible || changeTypes.columns && optionNames.all;

      if (needPartialRender) {
        this.render(null, {
          changeType: 'selection',
          columnIndex: e.columnIndex
        });
      } else if (needFullRender) {
        this.render(null, 'full');
      }
    }
  },
  optionChanged: function optionChanged(args) {
    switch (args.name) {
      case 'columnChooser':
        this._initializePopupContainer();

        this.render(null, 'full');
        break;

      default:
        this.callBase(args);
    }
  },
  getColumnElements: function getColumnElements() {
    var result = [];
    var $node;
    var isSelectMode = this.option('columnChooser.mode') === 'select';

    var chooserColumns = this._columnsController.getChooserColumns(isSelectMode);

    var $content = this._popupContainer && this._popupContainer.$content();

    var $nodes = $content && $content.find('.dx-treeview-node');

    if ($nodes) {
      chooserColumns.forEach(function (column) {
        $node = $nodes.filter('[data-item-id = \'' + column.index + '\']');
        var item = $node.length ? $node.children('.' + COLUMN_CHOOSER_ITEM_CLASS).get(0) : null;
        result.push(item);
      });
    }

    return $(result);
  },
  getName: function getName() {
    return 'columnChooser';
  },
  getColumns: function getColumns() {
    return this._columnsController.getChooserColumns();
  },
  allowDragging: function allowDragging(column, sourceLocation) {
    var columnVisible = column && column.allowHiding && (sourceLocation !== 'columnChooser' || !column.visible && this._columnsController.isParentColumnVisible(column.index));

    return this.isColumnChooserVisible() && columnVisible;
  },
  getBoundingRect: function getBoundingRect() {
    var that = this;

    var container = that._popupContainer && that._popupContainer.$overlayContent();

    if (container && container.is(':visible')) {
      var offset = container.offset();
      return {
        left: offset.left,
        top: offset.top,
        right: offset.left + getOuterWidth(container),
        bottom: offset.top + getOuterHeight(container)
      };
    }

    return null;
  },
  showColumnChooser: function showColumnChooser() {
    if (!this._popupContainer) {
      this._initializePopupContainer();

      this.render();
    }

    this._popupContainer.show();

    if (this._isWinDevice()) {
      $('body').addClass(this.addWidgetPrefix(NOTOUCH_ACTION_CLASS));
    }
  },
  hideColumnChooser: function hideColumnChooser() {
    if (this._popupContainer) {
      this._popupContainer.hide();
    }
  },
  isColumnChooserVisible: function isColumnChooserVisible() {
    var popupContainer = this._popupContainer;
    return popupContainer && popupContainer.option('visible');
  },
  publicMethods: function publicMethods() {
    return ['showColumnChooser', 'hideColumnChooser'];
  }
});
export var columnChooserModule = {
  defaultOptions: function defaultOptions() {
    return {
      columnChooser: {
        enabled: false,
        allowSearch: false,
        searchTimeout: 500,
        mode: 'dragAndDrop',
        width: 250,
        height: 260,
        title: messageLocalization.format('dxDataGrid-columnChooserTitle'),
        emptyPanelText: messageLocalization.format('dxDataGrid-columnChooserEmptyText'),
        // TODO private option
        container: undefined
      }
    };
  },
  controllers: {
    columnChooser: ColumnChooserController
  },
  views: {
    columnChooserView: ColumnChooserView
  },
  extenders: {
    views: {
      headerPanel: {
        _getToolbarItems: function _getToolbarItems() {
          var items = this.callBase();
          return this._appendColumnChooserItem(items);
        },
        _appendColumnChooserItem: function _appendColumnChooserItem(items) {
          var that = this;
          var columnChooserEnabled = that.option('columnChooser.enabled');

          if (columnChooserEnabled) {
            var onClickHandler = function onClickHandler() {
              that.component.getView('columnChooserView').showColumnChooser();
            };

            var onInitialized = function onInitialized(e) {
              $(e.element).addClass(that._getToolbarButtonClass(that.addWidgetPrefix(COLUMN_CHOOSER_BUTTON_CLASS)));
            };

            var hintText = that.option('columnChooser.title');
            var toolbarItem = {
              widget: 'dxButton',
              options: {
                icon: COLUMN_CHOOSER_ICON_NAME,
                onClick: onClickHandler,
                hint: hintText,
                text: hintText,
                onInitialized: onInitialized
              },
              showText: 'inMenu',
              location: 'after',
              name: 'columnChooserButton',
              locateInMenu: 'auto',
              sortIndex: 40
            };
            items.push(toolbarItem);
          }

          return items;
        },
        optionChanged: function optionChanged(args) {
          switch (args.name) {
            case 'columnChooser':
              this._invalidate();

              args.handled = true;
              break;

            default:
              this.callBase(args);
          }
        },
        isVisible: function isVisible() {
          var that = this;
          var columnChooserEnabled = that.option('columnChooser.enabled');
          return that.callBase() || columnChooserEnabled;
        }
      }
    },
    controllers: {
      columns: {
        allowMoveColumn: function allowMoveColumn(fromVisibleIndex, toVisibleIndex, sourceLocation, targetLocation) {
          var columnChooserMode = this.option('columnChooser.mode');
          var isMoveColumnDisallowed = columnChooserMode === 'select' && targetLocation === 'columnChooser';
          return isMoveColumnDisallowed ? false : this.callBase(fromVisibleIndex, toVisibleIndex, sourceLocation, targetLocation);
        }
      }
    }
  }
};