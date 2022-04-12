import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["addWidgetClass", "aria", "bounceEnabled", "children", "classes", "direction", "disabled", "forceGeneratePockets", "height", "inertiaEnabled", "needRenderScrollbars", "needScrollViewContentWrapper", "needScrollViewLoadPanel", "onBounce", "onEnd", "onPullDown", "onReachBottom", "onScroll", "onStart", "onUpdated", "onVisibilityChange", "pullDownEnabled", "pulledDownText", "pullingDownText", "reachBottomEnabled", "reachBottomText", "refreshStrategy", "refreshingText", "rtlEnabled", "scrollByContent", "scrollByThumb", "scrollLocationChange", "showScrollbar", "useKeyboard", "useNative", "useSimulatedScrollbar", "visible", "width"];
import { createComponentVNode, normalizeProps } from "inferno";
import { InfernoWrapperComponent } from "@devextreme/runtime/inferno";
import { ScrollableNative } from "./strategy/native";
import { ScrollableSimulated } from "./strategy/simulated";
import { getElementLocationInternal } from "./utils/get_element_location_internal";
import { convertToLocation } from "./utils/convert_location";
import { getOffsetDistance } from "./utils/get_offset_distance";
import { isDefined, isNumeric } from "../../../core/utils/type";
import { hasWindow } from "../../../core/utils/window";
import { DIRECTION_HORIZONTAL, DIRECTION_VERTICAL } from "./common/consts";
import { ScrollableProps } from "./common/scrollable_props";
var isServerSide = !hasWindow();
export var viewFunction = viewModel => {
  var {
    props: {
      aria,
      bounceEnabled,
      children,
      classes,
      direction,
      disabled,
      forceGeneratePockets,
      height,
      inertiaEnabled,
      needScrollViewContentWrapper,
      needScrollViewLoadPanel,
      onBounce,
      onEnd,
      onPullDown,
      onReachBottom,
      onScroll,
      onStart,
      onUpdated,
      onVisibilityChange,
      pullDownEnabled,
      pulledDownText,
      pullingDownText,
      reachBottomEnabled,
      reachBottomText,
      refreshStrategy,
      refreshingText,
      rtlEnabled,
      scrollByContent,
      scrollByThumb,
      showScrollbar,
      useKeyboard,
      useNative,
      useSimulatedScrollbar,
      visible,
      width
    },
    restAttributes,
    scrollableNativeRef,
    scrollableSimulatedRef
  } = viewModel;
  isServerSide = !hasWindow();
  return useNative ? normalizeProps(createComponentVNode(2, ScrollableNative, _extends({
    "aria": aria,
    "classes": classes,
    "width": width,
    "height": height,
    "disabled": disabled,
    "visible": visible,
    "rtlEnabled": rtlEnabled,
    "direction": direction,
    "showScrollbar": showScrollbar,
    "pullDownEnabled": pullDownEnabled,
    "reachBottomEnabled": reachBottomEnabled,
    "forceGeneratePockets": forceGeneratePockets && !isServerSide,
    "needScrollViewContentWrapper": needScrollViewContentWrapper,
    "needScrollViewLoadPanel": needScrollViewLoadPanel && !isServerSide,
    "needRenderScrollbars": !isServerSide,
    "onScroll": onScroll,
    "onUpdated": onUpdated,
    "onPullDown": onPullDown,
    "onReachBottom": onReachBottom,
    "refreshStrategy": refreshStrategy,
    "pulledDownText": pulledDownText,
    "pullingDownText": pullingDownText,
    "refreshingText": refreshingText,
    "reachBottomText": reachBottomText,
    "useSimulatedScrollbar": useSimulatedScrollbar
  }, restAttributes, {
    children: children
  }), null, scrollableNativeRef)) : normalizeProps(createComponentVNode(2, ScrollableSimulated, _extends({
    "aria": aria,
    "classes": classes,
    "width": width,
    "height": height,
    "disabled": disabled,
    "visible": visible,
    "rtlEnabled": rtlEnabled,
    "direction": direction,
    "showScrollbar": showScrollbar,
    "scrollByThumb": scrollByThumb,
    "pullDownEnabled": pullDownEnabled,
    "reachBottomEnabled": reachBottomEnabled,
    "forceGeneratePockets": forceGeneratePockets && !isServerSide,
    "needScrollViewContentWrapper": needScrollViewContentWrapper,
    "needScrollViewLoadPanel": needScrollViewLoadPanel && !isServerSide,
    "needRenderScrollbars": !isServerSide,
    "onScroll": onScroll,
    "onUpdated": onUpdated,
    "onPullDown": onPullDown,
    "onReachBottom": onReachBottom,
    "refreshStrategy": "simulated",
    "pulledDownText": pulledDownText,
    "pullingDownText": pullingDownText,
    "refreshingText": refreshingText,
    "reachBottomText": reachBottomText,
    "onVisibilityChange": onVisibilityChange,
    "inertiaEnabled": inertiaEnabled,
    "bounceEnabled": bounceEnabled,
    "scrollByContent": scrollByContent,
    "useKeyboard": useKeyboard,
    "onStart": onStart,
    "onEnd": onEnd,
    "onBounce": onBounce
  }, restAttributes, {
    children: children
  }), null, scrollableSimulatedRef));
};
import { createReRenderEffect } from "@devextreme/runtime/inferno";
import { createRef as infernoCreateRef } from "inferno";
export class Scrollable extends InfernoWrapperComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.scrollableNativeRef = infernoCreateRef();
    this.scrollableSimulatedRef = infernoCreateRef();
    this.content = this.content.bind(this);
    this.container = this.container.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.scrollBy = this.scrollBy.bind(this);
    this.updateHandler = this.updateHandler.bind(this);
    this.release = this.release.bind(this);
    this.refresh = this.refresh.bind(this);
    this.scrollToElement = this.scrollToElement.bind(this);
    this.scrollHeight = this.scrollHeight.bind(this);
    this.scrollWidth = this.scrollWidth.bind(this);
    this.scrollOffset = this.scrollOffset.bind(this);
    this.scrollTop = this.scrollTop.bind(this);
    this.scrollLeft = this.scrollLeft.bind(this);
    this.clientHeight = this.clientHeight.bind(this);
    this.clientWidth = this.clientWidth.bind(this);
    this.getScrollElementPosition = this.getScrollElementPosition.bind(this);
    this.startLoading = this.startLoading.bind(this);
    this.finishLoading = this.finishLoading.bind(this);
    this.validate = this.validate.bind(this);
  }

  createEffects() {
    return [createReRenderEffect()];
  }

  validate(event) {
    return this.scrollableRef.validate(event);
  }

  get scrollableRef() {
    if (this.props.useNative) {
      return this.scrollableNativeRef.current;
    }

    return this.scrollableSimulatedRef.current;
  }

  get restAttributes() {
    var _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);

    return restProps;
  }

  content() {
    return this.scrollableRef.content();
  }

  container() {
    return this.scrollableRef.container();
  }

  scrollTo(targetLocation) {
    !this.props.useNative && this.updateHandler();
    var currentScrollOffset = this.props.useNative ? this.scrollOffset() : {
      top: this.container().scrollTop,
      left: this.container().scrollLeft
    };
    var distance = getOffsetDistance(convertToLocation(targetLocation, this.props.direction), currentScrollOffset);
    this.scrollBy(distance);
  }

  scrollBy(distance) {
    var {
      left,
      top
    } = convertToLocation(distance, this.props.direction);

    if (!isDefined(top) || !isNumeric(top)) {
      top = 0;
    }

    if (!isDefined(left) || !isNumeric(top)) {
      left = 0;
    }

    if (top === 0 && left === 0) {
      return;
    }

    this.scrollableRef.scrollByLocation({
      top,
      left
    });
  }

  updateHandler() {
    this.scrollableRef.updateHandler();
  }

  release() {
    if (!isServerSide) {
      this.scrollableRef.release();
    }
  }

  refresh() {
    if (!isServerSide) {
      this.scrollableRef.refresh();
    }
  }

  scrollToElement(element, offset) {
    if (!this.content().contains(element)) {
      return;
    }

    var scrollPosition = {
      top: 0,
      left: 0
    };
    var {
      direction
    } = this.props;

    if (direction !== DIRECTION_VERTICAL) {
      scrollPosition.left = this.getScrollElementPosition(element, DIRECTION_HORIZONTAL, offset);
    }

    if (direction !== DIRECTION_HORIZONTAL) {
      scrollPosition.top = this.getScrollElementPosition(element, DIRECTION_VERTICAL, offset);
    }

    this.scrollTo(scrollPosition);
  }

  scrollHeight() {
    return this.scrollableRef.scrollHeight();
  }

  scrollWidth() {
    return this.scrollableRef.scrollWidth();
  }

  scrollOffset() {
    return this.scrollableRef.scrollOffset();
  }

  scrollTop() {
    return this.scrollableRef.scrollTop();
  }

  scrollLeft() {
    return this.scrollableRef.scrollLeft();
  }

  clientHeight() {
    return this.scrollableRef.clientHeight();
  }

  clientWidth() {
    return this.scrollableRef.clientWidth();
  }

  getScrollElementPosition(targetElement, direction, offset) {
    var scrollOffset = this.scrollOffset();
    return getElementLocationInternal(targetElement, direction, this.container(), scrollOffset, offset);
  }

  startLoading() {
    this.scrollableRef.startLoading();
  }

  finishLoading() {
    if (!isServerSide) {
      this.scrollableRef.finishLoading();
    }
  }

  render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props),
      scrollableNativeRef: this.scrollableNativeRef,
      scrollableSimulatedRef: this.scrollableSimulatedRef,
      validate: this.validate,
      scrollableRef: this.scrollableRef,
      restAttributes: this.restAttributes
    });
  }

}
Scrollable.defaultProps = ScrollableProps;