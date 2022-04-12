import { getWidth, getHeight, setHeight, setWidth } from '../../core/utils/size';
import { hasWindow } from '../../core/utils/window';
export class GanttSizeHelper {
  constructor(gantt) {
    this._gantt = gantt;
  }

  _setTreeListDimension(dimension, value) {
    var _this$_gantt$_ganttTr;

    var setter = dimension === 'width' ? setWidth : setHeight;
    var getter = dimension === 'width' ? getWidth : getHeight;
    setter(this._gantt._$treeListWrapper, value);
    (_this$_gantt$_ganttTr = this._gantt._ganttTreeList) === null || _this$_gantt$_ganttTr === void 0 ? void 0 : _this$_gantt$_ganttTr.setOption(dimension, getter(this._gantt._$treeListWrapper));
  }

  _setGanttViewDimension(dimension, value) {
    var setter = dimension === 'width' ? setWidth : setHeight;
    var getter = dimension === 'width' ? getWidth : getHeight;
    setter(this._gantt._$ganttView, value);

    this._gantt._setGanttViewOption(dimension, getter(this._gantt._$ganttView));
  }

  _getPanelsWidthByOption() {
    return {
      leftPanelWidth: this._gantt.option('taskListWidth'),
      rightPanelWidth: getWidth(this._gantt._$element) - this._gantt.option('taskListWidth')
    };
  }

  onAdjustControl() {
    var elementHeight = getHeight(this._gantt._$element);
    this.updateGanttWidth();
    this.setGanttHeight(elementHeight);
  }

  onApplyPanelSize(e) {
    this.setInnerElementsWidth(e);
    this.updateGanttRowHeights();
  }

  updateGanttRowHeights() {
    var rowHeight = this._gantt._ganttTreeList.getRowHeight();

    if (this._gantt._getGanttViewOption('rowHeight') !== rowHeight) {
      var _this$_gantt$_ganttVi;

      this._gantt._setGanttViewOption('rowHeight', rowHeight);

      (_this$_gantt$_ganttVi = this._gantt._ganttView) === null || _this$_gantt$_ganttVi === void 0 ? void 0 : _this$_gantt$_ganttVi._ganttViewCore.updateRowHeights(rowHeight);
    }
  }

  adjustHeight() {
    if (!this._gantt._hasHeight) {
      this._gantt._setGanttViewOption('height', 0);

      this._gantt._setGanttViewOption('height', this._gantt._ganttTreeList.getOffsetHeight());
    }
  }

  setInnerElementsWidth(widths) {
    if (!hasWindow()) {
      return;
    }

    if (!widths) {
      widths = this._getPanelsWidthByOption();
    }

    this._setTreeListDimension('width', widths.leftPanelWidth);

    this._setGanttViewDimension('width', widths.rightPanelWidth);
  }

  updateGanttWidth() {
    this._gantt._splitter._dimensionChanged();
  }

  setGanttHeight(height) {
    var _this$_gantt$_ganttVi2;

    var toolbarHeightOffset = this._gantt._$toolbarWrapper.get(0).offsetHeight;

    var mainWrapperHeight = height - toolbarHeightOffset;

    this._setTreeListDimension('height', mainWrapperHeight);

    this._setGanttViewDimension('height', mainWrapperHeight);

    (_this$_gantt$_ganttVi2 = this._gantt._ganttView) === null || _this$_gantt$_ganttVi2 === void 0 ? void 0 : _this$_gantt$_ganttVi2._ganttViewCore.resetAndUpdate();
  }

}