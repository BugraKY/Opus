"use strict";

exports.GanttSizeHelper = void 0;

var _size = require("../../core/utils/size");

var _window = require("../../core/utils/window");

var GanttSizeHelper = /*#__PURE__*/function () {
  function GanttSizeHelper(gantt) {
    this._gantt = gantt;
  }

  var _proto = GanttSizeHelper.prototype;

  _proto._setTreeListDimension = function _setTreeListDimension(dimension, value) {
    var _this$_gantt$_ganttTr;

    var setter = dimension === 'width' ? _size.setWidth : _size.setHeight;
    var getter = dimension === 'width' ? _size.getWidth : _size.getHeight;
    setter(this._gantt._$treeListWrapper, value);
    (_this$_gantt$_ganttTr = this._gantt._ganttTreeList) === null || _this$_gantt$_ganttTr === void 0 ? void 0 : _this$_gantt$_ganttTr.setOption(dimension, getter(this._gantt._$treeListWrapper));
  };

  _proto._setGanttViewDimension = function _setGanttViewDimension(dimension, value) {
    var setter = dimension === 'width' ? _size.setWidth : _size.setHeight;
    var getter = dimension === 'width' ? _size.getWidth : _size.getHeight;
    setter(this._gantt._$ganttView, value);

    this._gantt._setGanttViewOption(dimension, getter(this._gantt._$ganttView));
  };

  _proto._getPanelsWidthByOption = function _getPanelsWidthByOption() {
    return {
      leftPanelWidth: this._gantt.option('taskListWidth'),
      rightPanelWidth: (0, _size.getWidth)(this._gantt._$element) - this._gantt.option('taskListWidth')
    };
  };

  _proto.onAdjustControl = function onAdjustControl() {
    var elementHeight = (0, _size.getHeight)(this._gantt._$element);
    this.updateGanttWidth();
    this.setGanttHeight(elementHeight);
  };

  _proto.onApplyPanelSize = function onApplyPanelSize(e) {
    this.setInnerElementsWidth(e);
    this.updateGanttRowHeights();
  };

  _proto.updateGanttRowHeights = function updateGanttRowHeights() {
    var rowHeight = this._gantt._ganttTreeList.getRowHeight();

    if (this._gantt._getGanttViewOption('rowHeight') !== rowHeight) {
      var _this$_gantt$_ganttVi;

      this._gantt._setGanttViewOption('rowHeight', rowHeight);

      (_this$_gantt$_ganttVi = this._gantt._ganttView) === null || _this$_gantt$_ganttVi === void 0 ? void 0 : _this$_gantt$_ganttVi._ganttViewCore.updateRowHeights(rowHeight);
    }
  };

  _proto.adjustHeight = function adjustHeight() {
    if (!this._gantt._hasHeight) {
      this._gantt._setGanttViewOption('height', 0);

      this._gantt._setGanttViewOption('height', this._gantt._ganttTreeList.getOffsetHeight());
    }
  };

  _proto.setInnerElementsWidth = function setInnerElementsWidth(widths) {
    if (!(0, _window.hasWindow)()) {
      return;
    }

    if (!widths) {
      widths = this._getPanelsWidthByOption();
    }

    this._setTreeListDimension('width', widths.leftPanelWidth);

    this._setGanttViewDimension('width', widths.rightPanelWidth);
  };

  _proto.updateGanttWidth = function updateGanttWidth() {
    this._gantt._splitter._dimensionChanged();
  };

  _proto.setGanttHeight = function setGanttHeight(height) {
    var _this$_gantt$_ganttVi2;

    var toolbarHeightOffset = this._gantt._$toolbarWrapper.get(0).offsetHeight;

    var mainWrapperHeight = height - toolbarHeightOffset;

    this._setTreeListDimension('height', mainWrapperHeight);

    this._setGanttViewDimension('height', mainWrapperHeight);

    (_this$_gantt$_ganttVi2 = this._gantt._ganttView) === null || _this$_gantt$_ganttVi2 === void 0 ? void 0 : _this$_gantt$_ganttVi2._ganttViewCore.resetAndUpdate();
  };

  return GanttSizeHelper;
}();

exports.GanttSizeHelper = GanttSizeHelper;