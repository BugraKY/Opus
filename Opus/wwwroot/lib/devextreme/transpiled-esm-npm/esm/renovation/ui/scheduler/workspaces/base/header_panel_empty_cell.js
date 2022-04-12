import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
var _excluded = ["isRenderAllDayTitle", "width"];
import { createVNode, createComponentVNode } from "inferno";
import { BaseInfernoComponent, normalizeStyles } from "@devextreme/runtime/inferno";
import { AllDayPanelTitle } from "./date_table/all_day_panel/title";
export var viewFunction = _ref => {
  var {
    props: {
      isRenderAllDayTitle,
      width
    }
  } = _ref;
  return createVNode(1, "div", "dx-scheduler-header-panel-empty-cell", isRenderAllDayTitle && createComponentVNode(2, AllDayPanelTitle), 0, {
    "style": normalizeStyles({
      width
    })
  });
};
export var HeaderPanelEmptyCellProps = {
  isRenderAllDayTitle: false
};
export class HeaderPanelEmptyCell extends BaseInfernoComponent {
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
      props: _extends({}, props),
      restAttributes: this.restAttributes
    });
  }

}
HeaderPanelEmptyCell.defaultProps = HeaderPanelEmptyCellProps;