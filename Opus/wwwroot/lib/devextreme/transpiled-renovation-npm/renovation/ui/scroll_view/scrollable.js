"use strict";

exports.viewFunction = exports.Scrollable = void 0;

var _inferno = require("inferno");

var _inferno2 = require("@devextreme/runtime/inferno");

var _native = require("./strategy/native");

var _simulated = require("./strategy/simulated");

var _get_element_location_internal = require("./utils/get_element_location_internal");

var _convert_location = require("./utils/convert_location");

var _get_offset_distance = require("./utils/get_offset_distance");

var _type = require("../../../core/utils/type");

var _window = require("../../../core/utils/window");

var _consts = require("./common/consts");

var _scrollable_props = require("./common/scrollable_props");

var _excluded = ["addWidgetClass", "aria", "bounceEnabled", "children", "classes", "direction", "disabled", "forceGeneratePockets", "height", "inertiaEnabled", "needRenderScrollbars", "needScrollViewContentWrapper", "needScrollViewLoadPanel", "onBounce", "onEnd", "onPullDown", "onReachBottom", "onScroll", "onStart", "onUpdated", "onVisibilityChange", "pullDownEnabled", "pulledDownText", "pullingDownText", "reachBottomEnabled", "reachBottomText", "refreshStrategy", "refreshingText", "rtlEnabled", "scrollByContent", "scrollByThumb", "scrollLocationChange", "showScrollbar", "useKeyboard", "useNative", "useSimulatedScrollbar", "visible", "width"];

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var isServerSide = !(0, _window.hasWindow)();

var viewFunction = function viewFunction(viewModel) {
  var _viewModel$props = viewModel.props,
      aria = _viewModel$props.aria,
      bounceEnabled = _viewModel$props.bounceEnabled,
      children = _viewModel$props.children,
      classes = _viewModel$props.classes,
      direction = _viewModel$props.direction,
      disabled = _viewModel$props.disabled,
      forceGeneratePockets = _viewModel$props.forceGeneratePockets,
      height = _viewModel$props.height,
      inertiaEnabled = _viewModel$props.inertiaEnabled,
      needScrollViewContentWrapper = _viewModel$props.needScrollViewContentWrapper,
      needScrollViewLoadPanel = _viewModel$props.needScrollViewLoadPanel,
      onBounce = _viewModel$props.onBounce,
      onEnd = _viewModel$props.onEnd,
      onPullDown = _viewModel$props.onPullDown,
      onReachBottom = _viewModel$props.onReachBottom,
      onScroll = _viewModel$props.onScroll,
      onStart = _viewModel$props.onStart,
      onUpdated = _viewModel$props.onUpdated,
      onVisibilityChange = _viewModel$props.onVisibilityChange,
      pullDownEnabled = _viewModel$props.pullDownEnabled,
      pulledDownText = _viewModel$props.pulledDownText,
      pullingDownText = _viewModel$props.pullingDownText,
      reachBottomEnabled = _viewModel$props.reachBottomEnabled,
      reachBottomText = _viewModel$props.reachBottomText,
      refreshStrategy = _viewModel$props.refreshStrategy,
      refreshingText = _viewModel$props.refreshingText,
      rtlEnabled = _viewModel$props.rtlEnabled,
      scrollByContent = _viewModel$props.scrollByContent,
      scrollByThumb = _viewModel$props.scrollByThumb,
      showScrollbar = _viewModel$props.showScrollbar,
      useKeyboard = _viewModel$props.useKeyboard,
      useNative = _viewModel$props.useNative,
      useSimulatedScrollbar = _viewModel$props.useSimulatedScrollbar,
      visible = _viewModel$props.visible,
      width = _viewModel$props.width,
      restAttributes = viewModel.restAttributes,
      scrollableNativeRef = viewModel.scrollableNativeRef,
      scrollableSimulatedRef = viewModel.scrollableSimulatedRef;
  isServerSide = !(0, _window.hasWindow)();
  return useNative ? (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _native.ScrollableNative, _extends({
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
  }), null, scrollableNativeRef)) : (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _simulated.ScrollableSimulated, _extends({
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

exports.viewFunction = viewFunction;

var Scrollable = /*#__PURE__*/function (_InfernoWrapperCompon) {
  _inheritsLoose(Scrollable, _InfernoWrapperCompon);

  function Scrollable(props) {
    var _this;

    _this = _InfernoWrapperCompon.call(this, props) || this;
    _this.state = {};
    _this.scrollableNativeRef = (0, _inferno.createRef)();
    _this.scrollableSimulatedRef = (0, _inferno.createRef)();
    _this.content = _this.content.bind(_assertThisInitialized(_this));
    _this.container = _this.container.bind(_assertThisInitialized(_this));
    _this.scrollTo = _this.scrollTo.bind(_assertThisInitialized(_this));
    _this.scrollBy = _this.scrollBy.bind(_assertThisInitialized(_this));
    _this.updateHandler = _this.updateHandler.bind(_assertThisInitialized(_this));
    _this.release = _this.release.bind(_assertThisInitialized(_this));
    _this.refresh = _this.refresh.bind(_assertThisInitialized(_this));
    _this.scrollToElement = _this.scrollToElement.bind(_assertThisInitialized(_this));
    _this.scrollHeight = _this.scrollHeight.bind(_assertThisInitialized(_this));
    _this.scrollWidth = _this.scrollWidth.bind(_assertThisInitialized(_this));
    _this.scrollOffset = _this.scrollOffset.bind(_assertThisInitialized(_this));
    _this.scrollTop = _this.scrollTop.bind(_assertThisInitialized(_this));
    _this.scrollLeft = _this.scrollLeft.bind(_assertThisInitialized(_this));
    _this.clientHeight = _this.clientHeight.bind(_assertThisInitialized(_this));
    _this.clientWidth = _this.clientWidth.bind(_assertThisInitialized(_this));
    _this.getScrollElementPosition = _this.getScrollElementPosition.bind(_assertThisInitialized(_this));
    _this.startLoading = _this.startLoading.bind(_assertThisInitialized(_this));
    _this.finishLoading = _this.finishLoading.bind(_assertThisInitialized(_this));
    _this.validate = _this.validate.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = Scrollable.prototype;

  _proto.createEffects = function createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
  };

  _proto.validate = function validate(event) {
    return this.scrollableRef.validate(event);
  };

  _proto.content = function content() {
    return this.scrollableRef.content();
  };

  _proto.container = function container() {
    return this.scrollableRef.container();
  };

  _proto.scrollTo = function scrollTo(targetLocation) {
    !this.props.useNative && this.updateHandler();
    var currentScrollOffset = this.props.useNative ? this.scrollOffset() : {
      top: this.container().scrollTop,
      left: this.container().scrollLeft
    };
    var distance = (0, _get_offset_distance.getOffsetDistance)((0, _convert_location.convertToLocation)(targetLocation, this.props.direction), currentScrollOffset);
    this.scrollBy(distance);
  };

  _proto.scrollBy = function scrollBy(distance) {
    var _convertToLocation = (0, _convert_location.convertToLocation)(distance, this.props.direction),
        left = _convertToLocation.left,
        top = _convertToLocation.top;

    if (!(0, _type.isDefined)(top) || !(0, _type.isNumeric)(top)) {
      top = 0;
    }

    if (!(0, _type.isDefined)(left) || !(0, _type.isNumeric)(top)) {
      left = 0;
    }

    if (top === 0 && left === 0) {
      return;
    }

    this.scrollableRef.scrollByLocation({
      top: top,
      left: left
    });
  };

  _proto.updateHandler = function updateHandler() {
    this.scrollableRef.updateHandler();
  };

  _proto.release = function release() {
    if (!isServerSide) {
      this.scrollableRef.release();
    }
  };

  _proto.refresh = function refresh() {
    if (!isServerSide) {
      this.scrollableRef.refresh();
    }
  };

  _proto.scrollToElement = function scrollToElement(element, offset) {
    if (!this.content().contains(element)) {
      return;
    }

    var scrollPosition = {
      top: 0,
      left: 0
    };
    var direction = this.props.direction;

    if (direction !== _consts.DIRECTION_VERTICAL) {
      scrollPosition.left = this.getScrollElementPosition(element, _consts.DIRECTION_HORIZONTAL, offset);
    }

    if (direction !== _consts.DIRECTION_HORIZONTAL) {
      scrollPosition.top = this.getScrollElementPosition(element, _consts.DIRECTION_VERTICAL, offset);
    }

    this.scrollTo(scrollPosition);
  };

  _proto.scrollHeight = function scrollHeight() {
    return this.scrollableRef.scrollHeight();
  };

  _proto.scrollWidth = function scrollWidth() {
    return this.scrollableRef.scrollWidth();
  };

  _proto.scrollOffset = function scrollOffset() {
    return this.scrollableRef.scrollOffset();
  };

  _proto.scrollTop = function scrollTop() {
    return this.scrollableRef.scrollTop();
  };

  _proto.scrollLeft = function scrollLeft() {
    return this.scrollableRef.scrollLeft();
  };

  _proto.clientHeight = function clientHeight() {
    return this.scrollableRef.clientHeight();
  };

  _proto.clientWidth = function clientWidth() {
    return this.scrollableRef.clientWidth();
  };

  _proto.getScrollElementPosition = function getScrollElementPosition(targetElement, direction, offset) {
    var scrollOffset = this.scrollOffset();
    return (0, _get_element_location_internal.getElementLocationInternal)(targetElement, direction, this.container(), scrollOffset, offset);
  };

  _proto.startLoading = function startLoading() {
    this.scrollableRef.startLoading();
  };

  _proto.finishLoading = function finishLoading() {
    if (!isServerSide) {
      this.scrollableRef.finishLoading();
    }
  };

  _proto.render = function render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props),
      scrollableNativeRef: this.scrollableNativeRef,
      scrollableSimulatedRef: this.scrollableSimulatedRef,
      validate: this.validate,
      scrollableRef: this.scrollableRef,
      restAttributes: this.restAttributes
    });
  };

  _createClass(Scrollable, [{
    key: "scrollableRef",
    get: function get() {
      if (this.props.useNative) {
        return this.scrollableNativeRef.current;
      }

      return this.scrollableSimulatedRef.current;
    }
  }, {
    key: "restAttributes",
    get: function get() {
      var _this$props = this.props,
          addWidgetClass = _this$props.addWidgetClass,
          aria = _this$props.aria,
          bounceEnabled = _this$props.bounceEnabled,
          children = _this$props.children,
          classes = _this$props.classes,
          direction = _this$props.direction,
          disabled = _this$props.disabled,
          forceGeneratePockets = _this$props.forceGeneratePockets,
          height = _this$props.height,
          inertiaEnabled = _this$props.inertiaEnabled,
          needRenderScrollbars = _this$props.needRenderScrollbars,
          needScrollViewContentWrapper = _this$props.needScrollViewContentWrapper,
          needScrollViewLoadPanel = _this$props.needScrollViewLoadPanel,
          onBounce = _this$props.onBounce,
          onEnd = _this$props.onEnd,
          onPullDown = _this$props.onPullDown,
          onReachBottom = _this$props.onReachBottom,
          onScroll = _this$props.onScroll,
          onStart = _this$props.onStart,
          onUpdated = _this$props.onUpdated,
          onVisibilityChange = _this$props.onVisibilityChange,
          pullDownEnabled = _this$props.pullDownEnabled,
          pulledDownText = _this$props.pulledDownText,
          pullingDownText = _this$props.pullingDownText,
          reachBottomEnabled = _this$props.reachBottomEnabled,
          reachBottomText = _this$props.reachBottomText,
          refreshStrategy = _this$props.refreshStrategy,
          refreshingText = _this$props.refreshingText,
          rtlEnabled = _this$props.rtlEnabled,
          scrollByContent = _this$props.scrollByContent,
          scrollByThumb = _this$props.scrollByThumb,
          scrollLocationChange = _this$props.scrollLocationChange,
          showScrollbar = _this$props.showScrollbar,
          useKeyboard = _this$props.useKeyboard,
          useNative = _this$props.useNative,
          useSimulatedScrollbar = _this$props.useSimulatedScrollbar,
          visible = _this$props.visible,
          width = _this$props.width,
          restProps = _objectWithoutProperties(_this$props, _excluded);

      return restProps;
    }
  }]);

  return Scrollable;
}(_inferno2.InfernoWrapperComponent);

exports.Scrollable = Scrollable;
Scrollable.defaultProps = _scrollable_props.ScrollableProps;