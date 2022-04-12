import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["children", "className", "filter", "height", "pointerEvents", "rootElementRef", "styles", "width"];
import { createVNode } from "inferno";
import { InfernoEffect, InfernoComponent, normalizeStyles } from "@devextreme/runtime/inferno";
import { ConfigContext } from "../../../common/config_context";
export var viewFunction = _ref => {
  var {
    config,
    props: {
      children,
      className,
      filter,
      height,
      pointerEvents,
      width
    },
    styles,
    svgRef
  } = _ref;
  return createVNode(32, "svg", className, children, 0, {
    "xmlns": "http://www.w3.org/2000/svg",
    "version": "1.1",
    "fill": "none",
    "stroke": "none",
    "stroke-width": 0,
    "style": normalizeStyles(styles),
    "width": width,
    "height": height,
    "direction": config !== null && config !== void 0 && config.rtlEnabled ? "rtl" : "ltr",
    "pointer-events": pointerEvents,
    "filter": filter
  }, null, svgRef);
};
export var RootSvgElementProps = {
  className: "",
  height: 0,
  width: 0
};
import { createRef as infernoCreateRef } from "inferno";
export class RootSvgElement extends InfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.svgRef = infernoCreateRef();
    this.setRootElementRef = this.setRootElementRef.bind(this);
  }

  get config() {
    if ("ConfigContext" in this.context) {
      return this.context.ConfigContext;
    }

    return ConfigContext;
  }

  createEffects() {
    return [new InfernoEffect(this.setRootElementRef, [])];
  }

  setRootElementRef() {
    var {
      rootElementRef
    } = this.props;

    if (rootElementRef) {
      rootElementRef.current = this.svgRef.current;
    }
  }

  get styles() {
    return _extends({
      display: "block",
      overflow: "hidden",
      lineHeight: "normal",
      msUserSelect: "none",
      MozUserSelect: "none",
      WebkitUserSelect: "none",
      WebkitTapHighlightColor: "rgba(0, 0, 0, 0)"
    }, this.props.styles);
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
      svgRef: this.svgRef,
      config: this.config,
      styles: this.styles,
      restAttributes: this.restAttributes
    });
  }

}
RootSvgElement.defaultProps = RootSvgElementProps;