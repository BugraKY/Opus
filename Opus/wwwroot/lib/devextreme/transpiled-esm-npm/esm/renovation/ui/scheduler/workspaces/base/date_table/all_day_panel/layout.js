import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["addDateTableClass", "addVerticalSizesClassToRows", "allDayAppointments", "bottomVirtualRowHeight", "dataCellTemplate", "groupOrientation", "leftVirtualCellWidth", "rightVirtualCellWidth", "tableRef", "topVirtualRowHeight", "viewData", "width"];
import { createVNode, createComponentVNode, normalizeProps } from "inferno";
import { BaseInfernoComponent } from "@devextreme/runtime/inferno";
import { LayoutProps } from "../../layout_props";
import { AllDayTable } from "./table";
export var viewFunction = _ref => {
  var {
    props: {
      allDayAppointments,
      dataCellTemplate,
      tableRef,
      viewData,
      width
    }
  } = _ref;
  return createVNode(1, "div", "dx-scheduler-all-day-panel", [allDayAppointments, createComponentVNode(2, AllDayTable, {
    "tableRef": tableRef,
    "viewData": viewData,
    "dataCellTemplate": dataCellTemplate,
    "width": width
  })], 0);
};
export var AllDayPanelLayoutProps = LayoutProps;

var getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => normalizeProps(createComponentVNode(2, TemplateProp, _extends({}, props))) : TemplateProp);

export class AllDayPanelLayout extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
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
        dataCellTemplate: getTemplate(props.dataCellTemplate)
      }),
      restAttributes: this.restAttributes
    });
  }

}
AllDayPanelLayout.defaultProps = AllDayPanelLayoutProps;