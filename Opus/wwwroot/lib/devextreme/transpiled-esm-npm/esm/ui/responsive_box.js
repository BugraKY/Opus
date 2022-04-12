import { getWidth } from '../core/utils/size';
import $ from '../core/renderer';
import eventsEngine from '../events/core/events_engine';
import { grep, noop } from '../core/utils/common';
import { isDefined, isPlainObject, isEmptyObject } from '../core/utils/type';
import errors from './widget/ui.errors';
import { getWindow, defaultScreenFactorFunc, hasWindow } from '../core/utils/window';
var window = getWindow();
import { each, map } from '../core/utils/iterator';
import { extend } from '../core/utils/extend';
import registerComponent from '../core/component_registrator';
import Box from './box';
import CollectionWidget from './collection/ui.collection_widget.edit'; // STYLE responsiveBox

var RESPONSIVE_BOX_CLASS = 'dx-responsivebox';
var SCREEN_SIZE_CLASS_PREFIX = RESPONSIVE_BOX_CLASS + '-screen-';
var BOX_ITEM_CLASS = 'dx-box-item';
var BOX_ITEM_DATA_KEY = 'dxBoxItemData';
var HD_SCREEN_WIDTH = 1920;
var ResponsiveBox = CollectionWidget.inherit({
  _getDefaultOptions: function _getDefaultOptions() {
    return extend(this.callBase(), {
      rows: [],
      cols: [],
      screenByWidth: null,
      singleColumnScreen: '',
      height: '100%',
      width: '100%',

      /**
      * @name dxResponsiveBoxOptions.activeStateEnabled
      * @hidden
      */
      activeStateEnabled: false,

      /**
      * @name dxResponsiveBoxOptions.focusStateEnabled
      * @hidden
      */
      focusStateEnabled: false,
      onItemStateChanged: undefined,

      /**
      * @name dxResponsiveBoxOptions.accessKey
      * @hidden
      */

      /**
      * @name dxResponsiveBoxOptions.hint
      * @hidden
      */

      /**
      * @name dxResponsiveBoxOptions.noDataText
      * @hidden
      */

      /**
      * @name dxResponsiveBoxOptions.onSelectionChanged
      * @action
      * @hidden
      */

      /**
      * @name dxResponsiveBoxOptions.selectedIndex
      * @hidden
      */

      /**
      * @name dxResponsiveBoxOptions.selectedItem
      * @hidden
      */

      /**
      * @name dxResponsiveBoxOptions.selectedItems
      * @hidden
      */

      /**
      * @name dxResponsiveBoxOptions.selectedItemKeys
      * @hidden
      */

      /**
      * @name dxResponsiveBoxOptions.keyExpr
      * @hidden
      */

      /**
      * @name dxResponsiveBoxOptions.tabIndex
      * @hidden
      */
      onLayoutChanged: null,
      currentScreenFactor: undefined,
      _layoutStrategy: undefined
    });
  },
  _init: function _init() {
    if (!this.option('screenByWidth')) {
      this._options.silent('screenByWidth', defaultScreenFactorFunc);
    }

    this.callBase();

    this._initLayoutChangedAction();
  },
  _initLayoutChangedAction: function _initLayoutChangedAction() {
    this._layoutChangedAction = this._createActionByOption('onLayoutChanged', {
      excludeValidators: ['disabled', 'readonly']
    });
  },
  _itemClass: function _itemClass() {
    return BOX_ITEM_CLASS;
  },
  _itemDataKey: function _itemDataKey() {
    return BOX_ITEM_DATA_KEY;
  },
  _initMarkup: function _initMarkup() {
    this.callBase();
    this.$element().addClass(RESPONSIVE_BOX_CLASS); // NOTE: Fallback box strategy

    this._updateRootBox();
  },
  _updateRootBox: function _updateRootBox() {
    clearTimeout(this._updateTimer);
    this._updateTimer = setTimeout(function () {
      if (this._$root) {
        eventsEngine.triggerHandler(this._$root, 'dxupdate');
      }
    }.bind(this));
  },
  _renderItems: function _renderItems() {
    this._setScreenSize();

    this._screenItems = this._itemsByScreen();

    this._prepareGrid();

    this._spreadItems();

    this._layoutItems();

    this._linkNodeToItem();
  },
  _itemOptionChanged: function _itemOptionChanged(item) {
    var $item = this._findItemElementByItem(item);

    if (!$item.length) {
      return;
    }

    this._refreshItem($item, item);

    this._clearItemNodeTemplates();

    this._update(true);
  },
  _setScreenSize: function _setScreenSize() {
    var currentScreen = this._getCurrentScreen();

    this._removeScreenSizeClass();

    this.$element().addClass(SCREEN_SIZE_CLASS_PREFIX + currentScreen);
    this.option('currentScreenFactor', currentScreen);
  },
  _removeScreenSizeClass: function _removeScreenSizeClass() {
    var currentScreenFactor = this.option('currentScreenFactor');
    currentScreenFactor && this.$element().removeClass(SCREEN_SIZE_CLASS_PREFIX + currentScreenFactor);
  },
  _prepareGrid: function _prepareGrid() {
    var grid = this._grid = [];

    this._prepareRowsAndCols();

    each(this._rows, function () {
      var row = [];
      grid.push(row);
      each(this._cols, function () {
        row.push(this._createEmptyCell());
      }.bind(this));
    }.bind(this));
  },
  getSingleColumnRows: function getSingleColumnRows() {
    var rows = this.option('rows');
    var screenItemsLength = this._screenItems.length;

    if (rows.length) {
      var filteredRows = this._filterByScreen(rows);

      var result = [];

      for (var i = 0; i < screenItemsLength; i++) {
        var sizeConfig = this._defaultSizeConfig();

        if (i < filteredRows.length && isDefined(filteredRows[i].shrink)) {
          sizeConfig.shrink = filteredRows[i].shrink;
        }

        result.push(sizeConfig);
      }

      return result;
    } else {
      return this._defaultSizeConfig(screenItemsLength);
    }
  },
  _prepareRowsAndCols: function _prepareRowsAndCols() {
    if (this._isSingleColumnScreen()) {
      this._prepareSingleColumnScreenItems();

      this._rows = this.getSingleColumnRows();
      this._cols = this._defaultSizeConfig(1);
    } else {
      this._rows = this._sizesByScreen(this.option('rows'));
      this._cols = this._sizesByScreen(this.option('cols'));
    }
  },
  _isSingleColumnScreen: function _isSingleColumnScreen() {
    return this._screenRegExp().test(this.option('singleColumnScreen')) || !this.option('rows').length || !this.option('cols').length;
  },
  _prepareSingleColumnScreenItems: function _prepareSingleColumnScreenItems() {
    this._screenItems.sort(function (item1, item2) {
      return item1.location.row - item2.location.row || item1.location.col - item2.location.col;
    });

    each(this._screenItems, function (index, item) {
      extend(item.location, {
        row: index,
        col: 0,
        rowspan: 1,
        colspan: 1
      });
    });
  },
  _sizesByScreen: function _sizesByScreen(sizeConfigs) {
    return map(this._filterByScreen(sizeConfigs), function (sizeConfig) {
      return extend(this._defaultSizeConfig(), sizeConfig);
    }.bind(this));
  },
  _createDefaultSizeConfig: function _createDefaultSizeConfig() {
    return {
      ratio: 1,
      baseSize: 0,
      minSize: 0,
      maxSize: 0
    };
  },
  _defaultSizeConfig: function _defaultSizeConfig(size) {
    var defaultSizeConfig = this._createDefaultSizeConfig();

    if (!arguments.length) {
      return defaultSizeConfig;
    }

    var result = [];

    for (var i = 0; i < size; i++) {
      result.push(defaultSizeConfig);
    }

    return result;
  },
  _filterByScreen: function _filterByScreen(items) {
    var screenRegExp = this._screenRegExp();

    return grep(items, function (item) {
      return !item.screen || screenRegExp.test(item.screen);
    });
  },
  _screenRegExp: function _screenRegExp() {
    var screen = this._getCurrentScreen();

    return new RegExp('(^|\\s)' + screen + '($|\\s)', 'i');
  },
  _getCurrentScreen: function _getCurrentScreen() {
    var width = this._screenWidth();

    return this.option('screenByWidth')(width);
  },
  _screenWidth: function _screenWidth() {
    return hasWindow() ? getWidth(window) : HD_SCREEN_WIDTH;
  },
  _createEmptyCell: function _createEmptyCell() {
    return {
      item: {},
      location: {
        colspan: 1,
        rowspan: 1
      }
    };
  },
  _spreadItems: function _spreadItems() {
    each(this._screenItems, function (_, itemInfo) {
      var location = itemInfo.location || {};
      var itemCol = location.col;
      var itemRow = location.row;
      var row = this._grid[itemRow];
      var itemCell = row && row[itemCol];

      this._occupyCells(itemCell, itemInfo);
    }.bind(this));
  },
  _itemsByScreen: function _itemsByScreen() {
    return this.option('items').reduce((result, item) => {
      var locations = item.location || {};
      locations = isPlainObject(locations) ? [locations] : locations;

      this._filterByScreen(locations).forEach(location => {
        result.push({
          item: item,
          location: extend({
            rowspan: 1,
            colspan: 1
          }, location)
        });
      });

      return result;
    }, []);
  },
  _occupyCells: function _occupyCells(itemCell, itemInfo) {
    if (!itemCell || this._isItemCellOccupied(itemCell, itemInfo)) {
      return;
    }

    extend(itemCell, itemInfo);

    this._markSpanningCell(itemCell);
  },
  _isItemCellOccupied: function _isItemCellOccupied(itemCell, itemInfo) {
    if (!isEmptyObject(itemCell.item)) {
      return true;
    }

    var result = false;

    this._loopOverSpanning(itemInfo.location, function (cell) {
      result = result || !isEmptyObject(cell.item);
    });

    return result;
  },
  _loopOverSpanning: function _loopOverSpanning(location, callback) {
    var rowEnd = location.row + location.rowspan - 1;
    var colEnd = location.col + location.colspan - 1;
    var boundRowEnd = Math.min(rowEnd, this._rows.length - 1);
    var boundColEnd = Math.min(colEnd, this._cols.length - 1);
    location.rowspan -= rowEnd - boundRowEnd;
    location.colspan -= colEnd - boundColEnd;

    for (var rowIndex = location.row; rowIndex <= boundRowEnd; rowIndex++) {
      for (var colIndex = location.col; colIndex <= boundColEnd; colIndex++) {
        if (rowIndex !== location.row || colIndex !== location.col) {
          callback(this._grid[rowIndex][colIndex]);
        }
      }
    }
  },
  _markSpanningCell: function _markSpanningCell(itemCell) {
    this._loopOverSpanning(itemCell.location, function (cell) {
      extend(cell, {
        item: itemCell.item,
        spanningCell: itemCell
      });
    });
  },
  _linkNodeToItem: function _linkNodeToItem() {
    each(this._itemElements(), function (_, itemNode) {
      var $item = $(itemNode);
      var item = $item.data(BOX_ITEM_DATA_KEY);

      if (!item.box) {
        item.node = $item.children();
      }
    });
  },
  _layoutItems: function _layoutItems() {
    var rowsCount = this._grid.length;
    var colsCount = rowsCount && this._grid[0].length;

    if (!rowsCount && !colsCount) {
      return;
    }

    var result = this._layoutBlock({
      direction: 'col',
      row: {
        start: 0,
        end: rowsCount - 1
      },
      col: {
        start: 0,
        end: colsCount - 1
      }
    });

    var rootBox = this._prepareBoxConfig(result.box || {
      direction: 'row',
      items: [extend(result, {
        ratio: 1
      })]
    });

    extend(rootBox, this._rootBoxConfig(rootBox.items));
    this._$root = $('<div>').appendTo(this._itemContainer());

    this._createComponent(this._$root, Box, rootBox);
  },
  _rootBoxConfig: function _rootBoxConfig(items) {
    var rootItems = each(items, function (index, item) {
      this._needApplyAutoBaseSize(item) && extend(item, {
        baseSize: 'auto'
      });
    }.bind(this));
    return extend({
      width: '100%',
      height: '100%',
      items: rootItems,
      itemTemplate: this._getTemplateByOption('itemTemplate'),
      itemHoldTimeout: this.option('itemHoldTimeout'),
      onItemHold: this._createActionByOption('onItemHold'),
      onItemClick: this._createActionByOption('onItemClick'),
      onItemContextMenu: this._createActionByOption('onItemContextMenu'),
      onItemRendered: this._createActionByOption('onItemRendered')
    }, {
      _layoutStrategy: this.option('_layoutStrategy')
    });
  },
  _needApplyAutoBaseSize: function _needApplyAutoBaseSize(item) {
    return !item.baseSize && (!item.minSize || item.minSize === 'auto') && (!item.maxSize || item.maxSize === 'auto');
  },
  _prepareBoxConfig: function _prepareBoxConfig(config) {
    return extend(config || {}, {
      crossAlign: 'stretch',
      onItemStateChanged: this.option('onItemStateChanged')
    });
  },
  _layoutBlock: function _layoutBlock(options) {
    if (this._isSingleItem(options)) {
      return this._itemByCell(options.row.start, options.col.start);
    }

    return this._layoutDirection(options);
  },
  _isSingleItem: function _isSingleItem(options) {
    var firstCellLocation = this._grid[options.row.start][options.col.start].location;
    var isItemRowSpanned = options.row.end - options.row.start === firstCellLocation.rowspan - 1;
    var isItemColSpanned = options.col.end - options.col.start === firstCellLocation.colspan - 1;
    return isItemRowSpanned && isItemColSpanned;
  },
  _itemByCell: function _itemByCell(rowIndex, colIndex) {
    var itemCell = this._grid[rowIndex][colIndex];
    return itemCell.spanningCell ? null : itemCell.item;
  },
  _layoutDirection: function _layoutDirection(options) {
    var items = [];
    var direction = options.direction;

    var crossDirection = this._crossDirection(direction);

    var block;

    while (block = this._nextBlock(options)) {
      if (this._isBlockIndivisible(options.prevBlockOptions, block)) {
        throw errors.Error('E1025');
      }

      var item = this._layoutBlock({
        direction: crossDirection,
        row: block.row,
        col: block.col,
        prevBlockOptions: options
      });

      if (item) {
        extend(item, this._blockSize(block, crossDirection));
        items.push(item);
      }

      options[crossDirection].start = block[crossDirection].end + 1;
    }

    return {
      box: this._prepareBoxConfig({
        direction: direction,
        items: items
      })
    };
  },
  _isBlockIndivisible: function _isBlockIndivisible(options, block) {
    return options && options.col.start === block.col.start && options.col.end === block.col.end && options.row.start === block.row.start && options.row.end === block.row.end;
  },
  _crossDirection: function _crossDirection(direction) {
    return direction === 'col' ? 'row' : 'col';
  },
  _nextBlock: function _nextBlock(options) {
    var direction = options.direction;

    var crossDirection = this._crossDirection(direction);

    var startIndex = options[direction].start;
    var endIndex = options[direction].end;
    var crossStartIndex = options[crossDirection].start;

    if (crossStartIndex > options[crossDirection].end) {
      return null;
    }

    var crossSpan = 1;

    for (var crossIndex = crossStartIndex; crossIndex < crossStartIndex + crossSpan; crossIndex++) {
      var lineCrossSpan = 1;

      for (var index = startIndex; index <= endIndex; index++) {
        var cell = this._cellByDirection(direction, index, crossIndex);

        lineCrossSpan = Math.max(lineCrossSpan, cell.location[crossDirection + 'span']);
      }

      var lineCrossEndIndex = crossIndex + lineCrossSpan;
      var crossEndIndex = crossStartIndex + crossSpan;

      if (lineCrossEndIndex > crossEndIndex) {
        crossSpan += lineCrossEndIndex - crossEndIndex;
      }
    }

    var result = {};
    result[direction] = {
      start: startIndex,
      end: endIndex
    };
    result[crossDirection] = {
      start: crossStartIndex,
      end: crossStartIndex + crossSpan - 1
    };
    return result;
  },
  _cellByDirection: function _cellByDirection(direction, index, crossIndex) {
    return direction === 'col' ? this._grid[crossIndex][index] : this._grid[index][crossIndex];
  },
  _blockSize: function _blockSize(block, direction) {
    var defaultMinSize = direction === 'row' ? 'auto' : 0;
    var sizeConfigs = direction === 'row' ? this._rows : this._cols;
    var result = extend(this._createDefaultSizeConfig(), {
      ratio: 0
    });

    for (var index = block[direction].start; index <= block[direction].end; index++) {
      var sizeConfig = sizeConfigs[index];
      result.ratio += sizeConfig.ratio;
      result.baseSize += sizeConfig.baseSize;
      result.minSize += sizeConfig.minSize;
      result.maxSize += sizeConfig.maxSize;

      if (isDefined(sizeConfig.shrink)) {
        result.shrink = sizeConfig.shrink;
      }
    }

    result.minSize = result.minSize ? result.minSize : defaultMinSize;
    result.maxSize = result.maxSize ? result.maxSize : 'auto';
    this._isSingleColumnScreen() && (result.baseSize = 'auto');
    return result;
  },
  _update: function _update(forceRemoveRoot) {
    var $existingRoot = this._$root;

    this._renderItems();

    if ($existingRoot) {
      if (forceRemoveRoot) {
        $existingRoot.remove();
      } else {
        $existingRoot.detach();

        this._saveAssistantRoot($existingRoot);
      }
    }

    this._layoutChangedAction();

    this._updateRootBox();
  },
  _saveAssistantRoot: function _saveAssistantRoot($root) {
    this._assistantRoots = this._assistantRoots || [];

    this._assistantRoots.push($root);
  },
  _dispose: function _dispose() {
    clearTimeout(this._updateTimer);

    this._clearItemNodeTemplates();

    this._cleanUnusedRoots();

    this.callBase.apply(this, arguments);
  },
  _cleanUnusedRoots: function _cleanUnusedRoots() {
    if (!this._assistantRoots) {
      return;
    }

    each(this._assistantRoots, function (_, item) {
      $(item).remove();
    });
  },
  _clearItemNodeTemplates: function _clearItemNodeTemplates() {
    each(this.option('items'), function () {
      delete this.node;
    });
  },
  _toggleVisibility: function _toggleVisibility(visible) {
    this.callBase(visible);

    if (visible) {
      this._updateRootBox();
    }
  },
  _attachClickEvent: noop,
  _optionChanged: function _optionChanged(args) {
    switch (args.name) {
      case 'rows':
      case 'cols':
      case 'screenByWidth':
      case '_layoutStrategy':
      case 'singleColumnScreen':
        this._clearItemNodeTemplates();

        this._invalidate();

        break;

      case 'width':
      case 'height':
        this.callBase(args);

        this._update();

        break;

      case 'onLayoutChanged':
        this._initLayoutChangedAction();

        break;

      case 'itemTemplate':
        this._clearItemNodeTemplates();

        this.callBase(args);
        break;

      case 'currentScreenFactor':
        break;

      default:
        this.callBase(args);
    }
  },
  _dimensionChanged: function _dimensionChanged() {
    if (this._getCurrentScreen() !== this.option('currentScreenFactor')) {
      this._update();
    }
  },
  repaint: function repaint() {
    this._update();
  }
  /**
  * @name dxResponsiveBox.registerKeyHandler
  * @publicName registerKeyHandler(key, handler)
  * @hidden
  */

  /**
  * @name dxResponsiveBox.focus
  * @publicName focus()
  * @hidden
  */

});
registerComponent('dxResponsiveBox', ResponsiveBox);
export default ResponsiveBox;
/**
 * @name dxResponsiveBoxItem
 * @inherits CollectionWidgetItem
 * @type object
 */