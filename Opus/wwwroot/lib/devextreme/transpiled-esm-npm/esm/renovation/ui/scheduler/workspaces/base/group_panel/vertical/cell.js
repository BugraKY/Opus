import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["cellTemplate", "className", "color", "data", "id", "index", "text"];
import { createVNode, createComponentVNode, normalizeProps } from "inferno";
import { BaseInfernoComponent } from "@devextreme/runtime/inferno";
import { GroupPanelCellProps } from "../cell_props";
export var viewFunction = viewModel => {
  var CellTemplate = viewModel.props.cellTemplate;
  return createVNode(1, "div", "dx-scheduler-group-header ".concat(viewModel.props.className), [!!viewModel.props.cellTemplate && CellTemplate({
    data: {
      data: viewModel.props.data,
      id: viewModel.props.id,
      color: viewModel.props.color,
      text: viewModel.props.text
    },
    index: viewModel.props.index
  }), !viewModel.props.cellTemplate && createVNode(1, "div", "dx-scheduler-group-header-content", viewModel.props.text, 0)], 0);
};

var getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => normalizeProps(createComponentVNode(2, TemplateProp, _extends({}, props))) : TemplateProp);

export class GroupPanelVerticalCell extends BaseInfernoComponent {
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
        cellTemplate: getTemplate(props.cellTemplate)
      }),
      restAttributes: this.restAttributes
    });
  }

}
GroupPanelVerticalCell.defaultProps = GroupPanelCellProps;