import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["children", "rtlEnabled"];
import { BaseInfernoComponent } from "@devextreme/runtime/inferno";
export var viewFunction = viewModel => viewModel.props.children;
export var ConfigProviderProps = {};
export class ConfigProvider extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.__getterCache = {};
  }

  getChildContext() {
    return _extends({}, this.context, {
      ConfigContext: this.config
    });
  }

  get config() {
    if (this.__getterCache["config"] !== undefined) {
      return this.__getterCache["config"];
    }

    return this.__getterCache["config"] = (() => {
      return {
        rtlEnabled: this.props.rtlEnabled
      };
    })();
  }

  get restAttributes() {
    var _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);

    return restProps;
  }

  componentWillUpdate(nextProps, nextState, context) {
    if (this.props["rtlEnabled"] !== nextProps["rtlEnabled"]) {
      this.__getterCache["config"] = undefined;
    }
  }

  render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props),
      config: this.config,
      restAttributes: this.restAttributes
    });
  }

}
ConfigProvider.defaultProps = ConfigProviderProps;