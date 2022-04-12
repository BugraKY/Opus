import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
var _excluded = ["bottomVirtualRowHeight", "children", "className", "height", "leftVirtualCellCount", "leftVirtualCellWidth", "rightVirtualCellCount", "rightVirtualCellWidth", "tableRef", "topVirtualRowHeight", "virtualCellsCount", "width"];
import { createVNode, createComponentVNode } from "inferno";
import { BaseInfernoComponent, normalizeStyles } from "@devextreme/runtime/inferno";
import { addHeightToStyle, addWidthToStyle } from "../utils";
import { VirtualRow } from "./virtual_row";
export var viewFunction = _ref => {
  var {
    hasBottomVirtualRow,
    hasTopVirtualRow,
    props: {
      bottomVirtualRowHeight,
      children,
      className,
      leftVirtualCellCount,
      leftVirtualCellWidth,
      rightVirtualCellCount,
      rightVirtualCellWidth,
      tableRef,
      topVirtualRowHeight,
      virtualCellsCount
    },
    style
  } = _ref;
  return createVNode(1, "table", className, createVNode(1, "tbody", null, [hasTopVirtualRow && createComponentVNode(2, VirtualRow, {
    "height": topVirtualRowHeight,
    "cellsCount": virtualCellsCount,
    "leftVirtualCellWidth": leftVirtualCellWidth,
    "rightVirtualCellWidth": rightVirtualCellWidth,
    "leftVirtualCellCount": leftVirtualCellCount,
    "rightVirtualCellCount": rightVirtualCellCount
  }), children, hasBottomVirtualRow && createComponentVNode(2, VirtualRow, {
    "height": bottomVirtualRowHeight,
    "cellsCount": virtualCellsCount,
    "leftVirtualCellWidth": leftVirtualCellWidth,
    "rightVirtualCellWidth": rightVirtualCellWidth,
    "leftVirtualCellCount": leftVirtualCellCount,
    "rightVirtualCellCount": rightVirtualCellCount
  })], 0), 2, {
    "style": normalizeStyles(style)
  }, null, tableRef);
};
export var TableProps = {
  className: "",
  topVirtualRowHeight: 0,
  bottomVirtualRowHeight: 0,
  leftVirtualCellWidth: 0,
  rightVirtualCellWidth: 0,
  virtualCellsCount: 0
};
import { createRef as infernoCreateRef } from "inferno";
export class Table extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.elementRef = infernoCreateRef();
  }

  get style() {
    var {
      height,
      width
    } = this.props;
    var {
      style
    } = this.restAttributes;
    var heightAdded = addHeightToStyle(height, style);
    return addWidthToStyle(width, heightAdded);
  }

  get hasTopVirtualRow() {
    var {
      topVirtualRowHeight
    } = this.props;
    return !!topVirtualRowHeight;
  }

  get hasBottomVirtualRow() {
    var {
      bottomVirtualRowHeight
    } = this.props;
    return !!bottomVirtualRowHeight;
  }

  get restAttributes() {
    var _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);

    return restProps;
  }

  render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props),
      elementRef: this.elementRef,
      style: this.style,
      hasTopVirtualRow: this.hasTopVirtualRow,
      hasBottomVirtualRow: this.hasBottomVirtualRow,
      restAttributes: this.restAttributes
    });
  }

}
Table.defaultProps = TableProps;