"use strict";

exports.DataArea = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _uiPivot_grid = require("./ui.pivot_grid.area_item");

var _support = require("../../core/utils/support");

var _calculate_scrollbar_width = require("./utils/calculate_scrollbar_width");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PIVOTGRID_AREA_CLASS = 'dx-pivotgrid-area';
var PIVOTGRID_AREA_DATA_CLASS = 'dx-pivotgrid-area-data';
var PIVOTGRID_TOTAL_CLASS = 'dx-total';
var PIVOTGRID_GRAND_TOTAL_CLASS = 'dx-grandtotal';
var PIVOTGRID_ROW_TOTAL_CLASS = 'dx-row-total';

var DataArea = _uiPivot_grid.AreaItem.inherit({
  _getAreaName: function _getAreaName() {
    return 'data';
  },
  _createGroupElement: function _createGroupElement() {
    return (0, _renderer.default)('<div>').addClass(PIVOTGRID_AREA_CLASS).addClass(PIVOTGRID_AREA_DATA_CLASS).css('borderTopWidth', 0);
  },
  _applyCustomStyles: function _applyCustomStyles(options) {
    var cell = options.cell;
    var classArray = options.classArray;

    if (cell.rowType === 'T' || cell.columnType === 'T') {
      classArray.push(PIVOTGRID_TOTAL_CLASS);
    }

    if (cell.rowType === 'GT' || cell.columnType === 'GT') {
      classArray.push(PIVOTGRID_GRAND_TOTAL_CLASS);
    }

    if (cell.rowType === 'T' || cell.rowType === 'GT') {
      classArray.push(PIVOTGRID_ROW_TOTAL_CLASS);
    }

    if (options.rowIndex === options.rowsCount - 1) {
      options.cssArray.push('border-bottom: 0px');
    }

    this.callBase(options);
  },
  _moveFakeTable: function _moveFakeTable(scrollPos) {
    this._moveFakeTableHorizontally(scrollPos.x);

    this._moveFakeTableTop(scrollPos.y);

    this.callBase();
  },
  renderScrollable: function renderScrollable() {
    this._groupElement.dxScrollable({
      useNative: this.getUseNativeValue(),
      useSimulatedScrollbar: false,
      rtlEnabled: this.component.option('rtlEnabled'),
      bounceEnabled: false,
      updateManually: true
    });
  },
  getUseNativeValue: function getUseNativeValue() {
    var _this$component$optio = this.component.option('scrolling'),
        useNative = _this$component$optio.useNative;

    return useNative === 'auto' ? !!_support.nativeScrolling : !!useNative;
  },
  getScrollbarWidth: function getScrollbarWidth() {
    return this.getUseNativeValue() ? (0, _calculate_scrollbar_width.calculateScrollbarWidth)() : 0;
  },
  updateScrollableOptions: function updateScrollableOptions(_ref) {
    var direction = _ref.direction,
        rtlEnabled = _ref.rtlEnabled;

    var scrollable = this._getScrollable();

    scrollable.option('useNative', this.getUseNativeValue());
    scrollable.option({
      direction: direction,
      rtlEnabled: rtlEnabled
    });
  },
  getScrollableDirection: function getScrollableDirection(horizontal, vertical) {
    if (horizontal && !vertical) {
      return 'horizontal';
    } else if (!horizontal && vertical) {
      return 'vertical';
    }

    return 'both';
  },
  reset: function reset() {
    this.callBase();

    if (this._virtualContent) {
      this._virtualContent.parent().css('height', 'auto');
    }
  },
  setVirtualContentParams: function setVirtualContentParams(params) {
    this.callBase(params);

    this._virtualContent.parent().css('height', params.height);

    this._setTableCss({
      top: params.top,
      left: params.left
    });
  }
});

exports.DataArea = DataArea;