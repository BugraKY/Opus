import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
var _excluded = ["pocketState", "pocketTop", "pullDownIconAngle", "pullDownOpacity", "pullDownTranslateTop", "pulledDownText", "pullingDownText", "refreshStrategy", "refreshingText", "topPocketRef", "topPocketTranslateTop", "visible"];
import { createVNode, createComponentVNode } from "inferno";
import { BaseInfernoComponent, normalizeStyles } from "@devextreme/runtime/inferno";
import { LoadIndicator } from "../../../load_indicator";
import { combineClasses } from "../../../../utils/combine_classes";
import messageLocalization from "../../../../../localization/message";
import { PULLDOWN_ICON_CLASS, SCROLLVIEW_PULLDOWN, SCROLLVIEW_PULLDOWN_IMAGE_CLASS, SCROLLVIEW_PULLDOWN_INDICATOR_CLASS, SCROLLVIEW_PULLDOWN_READY_CLASS, SCROLLVIEW_PULLDOWN_LOADING_CLASS, SCROLLVIEW_PULLDOWN_TEXT_CLASS, SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS, SCROLLVIEW_TOP_POCKET_CLASS, TopPocketState } from "../../common/consts";
import { current, isMaterial } from "../../../../../ui/themes";
export var viewFunction = viewModel => {
  var {
    props: {
      pulledDownText,
      pullingDownText,
      refreshStrategy,
      refreshingText,
      topPocketRef
    },
    pullDownClasses,
    pullDownIconStyles,
    pullDownRef,
    pullDownStyles,
    readyVisibleClass,
    refreshVisibleClass,
    releaseVisibleClass,
    topPocketClasses,
    topPocketStyles
  } = viewModel;
  return createVNode(1, "div", topPocketClasses, createVNode(1, "div", pullDownClasses, [refreshStrategy !== "swipeDown" && createVNode(1, "div", SCROLLVIEW_PULLDOWN_IMAGE_CLASS), refreshStrategy === "swipeDown" && createVNode(1, "div", PULLDOWN_ICON_CLASS, null, 1, {
    "style": normalizeStyles(pullDownIconStyles)
  }), createVNode(1, "div", SCROLLVIEW_PULLDOWN_INDICATOR_CLASS, createComponentVNode(2, LoadIndicator), 2), refreshStrategy !== "swipeDown" && createVNode(1, "div", SCROLLVIEW_PULLDOWN_TEXT_CLASS, [createVNode(1, "div", releaseVisibleClass, pullingDownText, 0), createVNode(1, "div", readyVisibleClass, pulledDownText, 0), createVNode(1, "div", refreshVisibleClass, refreshingText, 0)], 4)], 0, {
    "style": normalizeStyles(pullDownStyles)
  }, null, pullDownRef), 2, {
    "style": normalizeStyles(topPocketStyles)
  }, null, topPocketRef);
};
export var TopPocketProps = {
  get pullingDownText() {
    return isMaterial(current()) ? "" : messageLocalization.format("dxScrollView-pullingDownText");
  },

  get pulledDownText() {
    return isMaterial(current()) ? "" : messageLocalization.format("dxScrollView-pulledDownText");
  },

  get refreshingText() {
    return isMaterial(current()) ? "" : messageLocalization.format("dxScrollView-refreshingText");
  },

  get pocketState() {
    return TopPocketState.STATE_RELEASED;
  },

  pullDownTranslateTop: 0,
  pullDownIconAngle: 0,
  pullDownOpacity: 0,
  pocketTop: 0,
  topPocketTranslateTop: 0,
  visible: true
};
import { createRef as infernoCreateRef } from "inferno";
export class TopPocket extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.pullDownRef = infernoCreateRef();
    this.__getterCache = {};
  }

  get releaseVisibleClass() {
    return this.props.pocketState === TopPocketState.STATE_RELEASED ? SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS : undefined;
  }

  get readyVisibleClass() {
    return this.props.pocketState === TopPocketState.STATE_READY ? SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS : undefined;
  }

  get refreshVisibleClass() {
    return this.props.pocketState === TopPocketState.STATE_REFRESHING ? SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS : undefined;
  }

  get pullDownClasses() {
    var {
      pocketState,
      visible
    } = this.props;
    var classesMap = {
      [SCROLLVIEW_PULLDOWN]: true,
      [SCROLLVIEW_PULLDOWN_READY_CLASS]: pocketState === TopPocketState.STATE_READY,
      [SCROLLVIEW_PULLDOWN_LOADING_CLASS]: pocketState === TopPocketState.STATE_REFRESHING,
      "dx-state-invisible": !visible
    };
    return combineClasses(classesMap);
  }

  get topPocketClasses() {
    var classesMap = {
      [SCROLLVIEW_TOP_POCKET_CLASS]: true,
      "dx-state-invisible": !this.props.visible
    };
    return combineClasses(classesMap);
  }

  get pullDownStyles() {
    if (this.__getterCache["pullDownStyles"] !== undefined) {
      return this.__getterCache["pullDownStyles"];
    }

    return this.__getterCache["pullDownStyles"] = (() => {
      if (this.props.refreshStrategy === "swipeDown") {
        return {
          opacity: this.props.pullDownOpacity,
          transform: "translate(0px, ".concat(this.props.pullDownTranslateTop, "px)")
        };
      }

      return undefined;
    })();
  }

  get topPocketStyles() {
    if (this.__getterCache["topPocketStyles"] !== undefined) {
      return this.__getterCache["topPocketStyles"];
    }

    return this.__getterCache["topPocketStyles"] = (() => {
      if (this.props.refreshStrategy === "pullDown") {
        return {
          top: "".concat(-this.props.pocketTop, "px"),
          transform: "translate(0px, ".concat(this.props.topPocketTranslateTop, "px)")
        };
      }

      return undefined;
    })();
  }

  get pullDownIconStyles() {
    if (this.__getterCache["pullDownIconStyles"] !== undefined) {
      return this.__getterCache["pullDownIconStyles"];
    }

    return this.__getterCache["pullDownIconStyles"] = (() => {
      return {
        transform: "rotate(".concat(this.props.pullDownIconAngle, "deg)")
      };
    })();
  }

  get restAttributes() {
    var _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);

    return restProps;
  }

  componentWillUpdate(nextProps, nextState, context) {
    if (this.props["refreshStrategy"] !== nextProps["refreshStrategy"] || this.props["pullDownOpacity"] !== nextProps["pullDownOpacity"] || this.props["pullDownTranslateTop"] !== nextProps["pullDownTranslateTop"]) {
      this.__getterCache["pullDownStyles"] = undefined;
    }

    if (this.props["refreshStrategy"] !== nextProps["refreshStrategy"] || this.props["pocketTop"] !== nextProps["pocketTop"] || this.props["topPocketTranslateTop"] !== nextProps["topPocketTranslateTop"]) {
      this.__getterCache["topPocketStyles"] = undefined;
    }

    if (this.props["pullDownIconAngle"] !== nextProps["pullDownIconAngle"]) {
      this.__getterCache["pullDownIconStyles"] = undefined;
    }
  }

  render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props),
      pullDownRef: this.pullDownRef,
      releaseVisibleClass: this.releaseVisibleClass,
      readyVisibleClass: this.readyVisibleClass,
      refreshVisibleClass: this.refreshVisibleClass,
      pullDownClasses: this.pullDownClasses,
      topPocketClasses: this.topPocketClasses,
      pullDownStyles: this.pullDownStyles,
      topPocketStyles: this.topPocketStyles,
      pullDownIconStyles: this.pullDownIconStyles,
      restAttributes: this.restAttributes
    });
  }

}
TopPocket.defaultProps = TopPocketProps;