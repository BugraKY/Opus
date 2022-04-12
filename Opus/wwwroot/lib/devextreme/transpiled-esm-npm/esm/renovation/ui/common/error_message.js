import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["className", "message"];
import { createVNode, normalizeProps } from "inferno";
import { BaseInfernoComponent } from "@devextreme/runtime/inferno";
export var viewFunction = _ref => {
  var {
    props: {
      className,
      message
    },
    restAttributes
  } = _ref;
  return normalizeProps(createVNode(1, "div", "dx-validationsummary dx-validationsummary-item ".concat(className), message, 0, _extends({}, restAttributes)));
};
export var ErrorMessageProps = {
  className: "",
  message: ""
};
export class ErrorMessage extends BaseInfernoComponent {
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
ErrorMessage.defaultProps = ErrorMessageProps;