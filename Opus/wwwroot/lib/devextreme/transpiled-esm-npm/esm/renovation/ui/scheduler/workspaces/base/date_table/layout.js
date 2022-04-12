import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["addDateTableClass", "addVerticalSizesClassToRows", "bottomVirtualRowHeight", "cellTemplate", "dataCellTemplate", "groupOrientation", "leftVirtualCellWidth", "rightVirtualCellWidth", "tableRef", "topVirtualRowHeight", "viewData", "width"];
import { createComponentVNode, normalizeProps } from "inferno";
import { InfernoWrapperComponent } from "@devextreme/runtime/inferno";
import { Table } from "../table";
import { DateTableBody } from "./table_body";
import { LayoutProps } from "../layout_props";
import { DateTableCellBase } from "./cell";
export var viewFunction = _ref => {
  var {
    bottomVirtualRowHeight,
    classes,
    leftVirtualCellWidth,
    props: {
      addVerticalSizesClassToRows,
      cellTemplate,
      dataCellTemplate,
      groupOrientation,
      tableRef,
      viewData,
      width
    },
    restAttributes,
    rightVirtualCellWidth,
    topVirtualRowHeight,
    virtualCellsCount
  } = _ref;
  return normalizeProps(createComponentVNode(2, Table, _extends({}, restAttributes, {
    "tableRef": tableRef,
    "topVirtualRowHeight": topVirtualRowHeight,
    "bottomVirtualRowHeight": bottomVirtualRowHeight,
    "leftVirtualCellWidth": leftVirtualCellWidth,
    "rightVirtualCellWidth": rightVirtualCellWidth,
    "leftVirtualCellCount": viewData.leftVirtualCellCount,
    "rightVirtualCellCount": viewData.rightVirtualCellCount,
    "virtualCellsCount": virtualCellsCount,
    "className": classes,
    "width": width,
    children: createComponentVNode(2, DateTableBody, {
      "cellTemplate": cellTemplate,
      "viewData": viewData,
      "dataCellTemplate": dataCellTemplate,
      "leftVirtualCellWidth": leftVirtualCellWidth,
      "rightVirtualCellWidth": rightVirtualCellWidth,
      "groupOrientation": groupOrientation,
      "addVerticalSizesClassToRows": addVerticalSizesClassToRows
    })
  })));
};
export var DateTableLayoutProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(LayoutProps), Object.getOwnPropertyDescriptors({
  cellTemplate: DateTableCellBase
})));
import { createReRenderEffect } from "@devextreme/runtime/inferno";

var getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => normalizeProps(createComponentVNode(2, TemplateProp, _extends({}, props))) : TemplateProp);

export class DateTableLayoutBase extends InfernoWrapperComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  createEffects() {
    return [createReRenderEffect()];
  }

  get classes() {
    var {
      addDateTableClass
    } = this.props;
    return addDateTableClass ? "dx-scheduler-date-table" : undefined;
  }

  get topVirtualRowHeight() {
    var _this$props$viewData$;

    return (_this$props$viewData$ = this.props.viewData.topVirtualRowHeight) !== null && _this$props$viewData$ !== void 0 ? _this$props$viewData$ : 0;
  }

  get bottomVirtualRowHeight() {
    var _this$props$viewData$2;

    return (_this$props$viewData$2 = this.props.viewData.bottomVirtualRowHeight) !== null && _this$props$viewData$2 !== void 0 ? _this$props$viewData$2 : 0;
  }

  get leftVirtualCellWidth() {
    var _this$props$viewData$3;

    return (_this$props$viewData$3 = this.props.viewData.leftVirtualCellWidth) !== null && _this$props$viewData$3 !== void 0 ? _this$props$viewData$3 : 0;
  }

  get rightVirtualCellWidth() {
    var _this$props$viewData$4;

    return (_this$props$viewData$4 = this.props.viewData.rightVirtualCellWidth) !== null && _this$props$viewData$4 !== void 0 ? _this$props$viewData$4 : 0;
  }

  get virtualCellsCount() {
    return this.props.viewData.groupedData[0].dateTable[0].length;
  }

  get restAttributes() {
    var _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);

    return restProps;
  }

  render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        cellTemplate: getTemplate(props.cellTemplate),
        dataCellTemplate: getTemplate(props.dataCellTemplate)
      }),
      classes: this.classes,
      topVirtualRowHeight: this.topVirtualRowHeight,
      bottomVirtualRowHeight: this.bottomVirtualRowHeight,
      leftVirtualCellWidth: this.leftVirtualCellWidth,
      rightVirtualCellWidth: this.rightVirtualCellWidth,
      virtualCellsCount: this.virtualCellsCount,
      restAttributes: this.restAttributes
    });
  }

}
DateTableLayoutBase.defaultProps = DateTableLayoutProps;