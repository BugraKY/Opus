import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["addWidgetClass", "aria", "bounceEnabled", "children", "classes", "direction", "disabled", "forceGeneratePockets", "height", "needRenderScrollbars", "needScrollViewContentWrapper", "needScrollViewLoadPanel", "onPullDown", "onReachBottom", "onScroll", "onUpdated", "pullDownEnabled", "pulledDownText", "pullingDownText", "reachBottomEnabled", "reachBottomText", "refreshStrategy", "refreshingText", "rtlEnabled", "scrollByContent", "showScrollbar", "useSimulatedScrollbar", "visible", "width"];
import { createVNode, createComponentVNode, normalizeProps } from "inferno";
import { InfernoEffect, InfernoComponent, normalizeStyles } from "@devextreme/runtime/inferno";
import "../../../../events/gesture/emitter.gesture.scroll";
import { subscribeToScrollEvent, subscribeToScrollInitEvent, subscribeToDXScrollEndEvent, subscribeToDXScrollMoveEvent, subscribeToDXScrollStopEvent } from "../../../utils/subscribe_to_event";
import { Widget } from "../../common/widget";
import { ScrollViewLoadPanel } from "../internal/load_panel";
import { combineClasses } from "../../../utils/combine_classes";
import { getScrollLeftMax } from "../utils/get_scroll_left_max";
import { getBoundaryProps } from "../utils/get_boundary_props";
import { normalizeOffsetLeft } from "../utils/normalize_offset_left";
import { getElementOverflowX, getElementOverflowY } from "../utils/get_element_style";
import devices from "../../../../core/devices";
import { isDefined } from "../../../../core/utils/type";
import { TopPocket } from "../internal/pocket/top";
import { BottomPocket } from "../internal/pocket/bottom";
import { isDxMouseWheelEvent } from "../../../../events/utils/index";
import { ScrollDirection } from "../utils/scroll_direction";
import { DIRECTION_HORIZONTAL, DIRECTION_BOTH, SCROLLABLE_CONTAINER_CLASS, SCROLLABLE_CONTENT_CLASS, SCROLLABLE_WRAPPER_CLASS, SCROLLVIEW_CONTENT_CLASS, SCROLLABLE_DISABLED_CLASS, SCROLLABLE_SCROLLBAR_SIMULATED, SCROLLABLE_SCROLLBARS_HIDDEN, TopPocketState } from "../common/consts";
import { Scrollbar } from "../scrollbar/scrollbar";
import { isElementVisible } from "../utils/is_element_visible";
import { ScrollableNativeProps } from "../common/native_strategy_props";
import { allowedDirection } from "../utils/get_allowed_direction";
import { getScrollTopMax } from "../utils/get_scroll_top_max";
import { subscribeToResize } from "../utils/subscribe_to_resize";
export var viewFunction = viewModel => {
  var {
    bottomPocketRef,
    containerClientHeight,
    containerClientWidth,
    containerRef,
    contentHeight,
    contentRef,
    contentStyles,
    contentTranslateTop,
    contentWidth,
    cssClasses,
    direction,
    hScrollLocation,
    hScrollOffsetMax,
    hScrollbarRef,
    isLoadPanelVisible,
    props: {
      aria,
      children,
      disabled,
      forceGeneratePockets,
      height,
      needRenderScrollbars,
      needScrollViewContentWrapper,
      needScrollViewLoadPanel,
      pullDownEnabled,
      pulledDownText,
      pullingDownText,
      reachBottomEnabled,
      reachBottomText,
      refreshStrategy,
      refreshingText,
      rtlEnabled,
      showScrollbar,
      useSimulatedScrollbar,
      visible,
      width
    },
    pullDownIconAngle,
    pullDownOpacity,
    pullDownTranslateTop,
    restAttributes,
    scrollViewContentRef,
    scrollableRef,
    scrolling,
    topPocketHeight,
    topPocketRef,
    topPocketState,
    vScrollLocation,
    vScrollOffsetMax,
    vScrollbarRef,
    wrapperRef
  } = viewModel;
  return normalizeProps(createComponentVNode(2, Widget, _extends({
    "rootElementRef": scrollableRef,
    "aria": aria,
    "addWidgetClass": false,
    "classes": cssClasses,
    "disabled": disabled,
    "rtlEnabled": rtlEnabled,
    "height": height,
    "width": width,
    "visible": visible
  }, restAttributes, {
    children: [createVNode(1, "div", SCROLLABLE_WRAPPER_CLASS, createVNode(1, "div", SCROLLABLE_CONTAINER_CLASS, createVNode(1, "div", SCROLLABLE_CONTENT_CLASS, [forceGeneratePockets && createComponentVNode(2, TopPocket, {
      "topPocketRef": topPocketRef,
      "pullingDownText": pullingDownText,
      "pulledDownText": pulledDownText,
      "refreshingText": refreshingText,
      "pocketState": topPocketState,
      "refreshStrategy": refreshStrategy,
      "pullDownTranslateTop": pullDownTranslateTop,
      "pullDownIconAngle": pullDownIconAngle,
      "topPocketTranslateTop": contentTranslateTop,
      "pullDownOpacity": pullDownOpacity,
      "pocketTop": topPocketHeight,
      "visible": !!pullDownEnabled
    }), needScrollViewContentWrapper ? createVNode(1, "div", SCROLLVIEW_CONTENT_CLASS, children, 0, {
      "style": normalizeStyles(contentStyles)
    }, null, scrollViewContentRef) : children, forceGeneratePockets && createComponentVNode(2, BottomPocket, {
      "bottomPocketRef": bottomPocketRef,
      "reachBottomText": reachBottomText,
      "visible": !!reachBottomEnabled
    })], 0, null, null, contentRef), 2, null, null, containerRef), 2, null, null, wrapperRef), needScrollViewLoadPanel && createComponentVNode(2, ScrollViewLoadPanel, {
      "targetElement": scrollableRef,
      "refreshingText": refreshingText,
      "visible": isLoadPanelVisible
    }), needRenderScrollbars && showScrollbar !== "never" && useSimulatedScrollbar && direction.isHorizontal && createComponentVNode(2, Scrollbar, {
      "direction": "horizontal",
      "showScrollbar": "onScroll",
      "contentSize": contentWidth,
      "containerSize": containerClientWidth,
      "maxOffset": hScrollOffsetMax,
      "scrollLocation": hScrollLocation,
      "visible": scrolling
    }, null, hScrollbarRef), needRenderScrollbars && showScrollbar !== "never" && useSimulatedScrollbar && direction.isVertical && createComponentVNode(2, Scrollbar, {
      "direction": "vertical",
      "showScrollbar": "onScroll",
      "contentSize": contentHeight,
      "containerSize": containerClientHeight,
      "maxOffset": vScrollOffsetMax,
      "scrollLocation": vScrollLocation,
      "visible": scrolling
    }, null, vScrollbarRef)]
  })));
};
import { createRef as infernoCreateRef } from "inferno";
export class ScrollableNative extends InfernoComponent {
  constructor(props) {
    super(props);
    this.scrollableRef = infernoCreateRef();
    this.topPocketRef = infernoCreateRef();
    this.bottomPocketRef = infernoCreateRef();
    this.wrapperRef = infernoCreateRef();
    this.contentRef = infernoCreateRef();
    this.scrollViewContentRef = infernoCreateRef();
    this.containerRef = infernoCreateRef();
    this.vScrollbarRef = infernoCreateRef();
    this.hScrollbarRef = infernoCreateRef();
    this.locked = false;
    this.loadingIndicatorEnabled = true;
    this.initPageY = 0;
    this.deltaY = 0;
    this.locationTop = 0;
    this.__getterCache = {};
    this.state = {
      containerClientWidth: 0,
      containerClientHeight: 0,
      contentClientWidth: 0,
      contentClientHeight: 0,
      contentScrollWidth: 0,
      contentScrollHeight: 0,
      topPocketHeight: 0,
      bottomPocketHeight: 0,
      scrolling: false,
      topPocketState: TopPocketState.STATE_RELEASED,
      isLoadPanelVisible: false,
      pullDownTranslateTop: 0,
      pullDownIconAngle: 0,
      pullDownOpacity: 0,
      contentTranslateTop: 0,
      vScrollLocation: 0,
      hScrollLocation: 0
    };
    this.content = this.content.bind(this);
    this.container = this.container.bind(this);
    this.refresh = this.refresh.bind(this);
    this.release = this.release.bind(this);
    this.disposeReleaseTimer = this.disposeReleaseTimer.bind(this);
    this.scrollHeight = this.scrollHeight.bind(this);
    this.scrollWidth = this.scrollWidth.bind(this);
    this.scrollOffset = this.scrollOffset.bind(this);
    this.scrollTop = this.scrollTop.bind(this);
    this.scrollLeft = this.scrollLeft.bind(this);
    this.clientHeight = this.clientHeight.bind(this);
    this.clientWidth = this.clientWidth.bind(this);
    this.scrollEffect = this.scrollEffect.bind(this);
    this.effectDisabledState = this.effectDisabledState.bind(this);
    this.effectResetInactiveState = this.effectResetInactiveState.bind(this);
    this.initEffect = this.initEffect.bind(this);
    this.moveEffect = this.moveEffect.bind(this);
    this.endEffect = this.endEffect.bind(this);
    this.stopEffect = this.stopEffect.bind(this);
    this.disposeRefreshTimer = this.disposeRefreshTimer.bind(this);
    this.validate = this.validate.bind(this);
    this.moveIsAllowed = this.moveIsAllowed.bind(this);
    this.updateHandler = this.updateHandler.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.subscribeContainerToResize = this.subscribeContainerToResize.bind(this);
    this.subscribeContentToResize = this.subscribeContentToResize.bind(this);
    this.scrollByLocation = this.scrollByLocation.bind(this);
    this.clearReleaseTimer = this.clearReleaseTimer.bind(this);
    this.onRelease = this.onRelease.bind(this);
    this.onUpdated = this.onUpdated.bind(this);
    this.startLoading = this.startLoading.bind(this);
    this.finishLoading = this.finishLoading.bind(this);
    this.setPocketState = this.setPocketState.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handlePocketState = this.handlePocketState.bind(this);
    this.pullDownReady = this.pullDownReady.bind(this);
    this.onReachBottom = this.onReachBottom.bind(this);
    this.onPullDown = this.onPullDown.bind(this);
    this.stateReleased = this.stateReleased.bind(this);
    this.getEventArgs = this.getEventArgs.bind(this);
    this.lock = this.lock.bind(this);
    this.unlock = this.unlock.bind(this);
    this.updateElementDimensions = this.updateElementDimensions.bind(this);
    this.setContainerDimensions = this.setContainerDimensions.bind(this);
    this.setContentDimensions = this.setContentDimensions.bind(this);
    this.syncScrollbarsWithContent = this.syncScrollbarsWithContent.bind(this);
    this.getInitEventData = this.getInitEventData.bind(this);
    this.handleInit = this.handleInit.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.pullDownComplete = this.pullDownComplete.bind(this);
    this.clearRefreshTimer = this.clearRefreshTimer.bind(this);
    this.pullDownRefreshing = this.pullDownRefreshing.bind(this);
    this.movePullDown = this.movePullDown.bind(this);
    this.getPullDownHeight = this.getPullDownHeight.bind(this);
    this.getPullDownStartPosition = this.getPullDownStartPosition.bind(this);
    this.complete = this.complete.bind(this);
    this.releaseState = this.releaseState.bind(this);
    this.isSwipeDown = this.isSwipeDown.bind(this);
    this.pulledDown = this.pulledDown.bind(this);
    this.isReachBottom = this.isReachBottom.bind(this);
    this.tryGetAllowedDirection = this.tryGetAllowedDirection.bind(this);
    this.isLocked = this.isLocked.bind(this);
    this.isScrollingOutOfBound = this.isScrollingOutOfBound.bind(this);
  }

  createEffects() {
    return [new InfernoEffect(this.disposeReleaseTimer, []), new InfernoEffect(this.scrollEffect, [this.props.useSimulatedScrollbar, this.props.onScroll, this.props.rtlEnabled, this.props.direction, this.props.forceGeneratePockets, this.state.topPocketState, this.props.refreshStrategy, this.props.reachBottomEnabled, this.state.contentClientHeight, this.state.contentScrollHeight, this.state.containerClientHeight, this.props.onReachBottom, this.props.pullDownEnabled, this.state.topPocketHeight]), new InfernoEffect(this.effectDisabledState, [this.props.disabled]), new InfernoEffect(this.effectResetInactiveState, [this.props.direction]), new InfernoEffect(this.initEffect, [this.props.forceGeneratePockets, this.props.refreshStrategy, this.state.topPocketState, this.props.direction, this.props.needScrollViewContentWrapper, this.props.onUpdated, this.props.rtlEnabled, this.props.disabled]), new InfernoEffect(this.moveEffect, [this.props.direction, this.props.forceGeneratePockets, this.props.refreshStrategy, this.state.topPocketState, this.props.pullDownEnabled, this.state.topPocketHeight]), new InfernoEffect(this.endEffect, [this.props.forceGeneratePockets, this.props.refreshStrategy, this.props.pullDownEnabled, this.state.topPocketState, this.state.topPocketHeight, this.props.onPullDown]), new InfernoEffect(this.stopEffect, [this.props.forceGeneratePockets, this.props.refreshStrategy, this.state.topPocketState, this.state.topPocketHeight, this.props.onPullDown]), new InfernoEffect(this.disposeRefreshTimer, []), new InfernoEffect(this.updateDimensions, []), new InfernoEffect(this.subscribeContainerToResize, []), new InfernoEffect(this.subscribeContentToResize, [])];
  }

  updateEffects() {
    var _this$_effects$, _this$_effects$2, _this$_effects$3, _this$_effects$4, _this$_effects$5, _this$_effects$6, _this$_effects$7;

    (_this$_effects$ = this._effects[1]) === null || _this$_effects$ === void 0 ? void 0 : _this$_effects$.update([this.props.useSimulatedScrollbar, this.props.onScroll, this.props.rtlEnabled, this.props.direction, this.props.forceGeneratePockets, this.state.topPocketState, this.props.refreshStrategy, this.props.reachBottomEnabled, this.state.contentClientHeight, this.state.contentScrollHeight, this.state.containerClientHeight, this.props.onReachBottom, this.props.pullDownEnabled, this.state.topPocketHeight]);
    (_this$_effects$2 = this._effects[2]) === null || _this$_effects$2 === void 0 ? void 0 : _this$_effects$2.update([this.props.disabled]);
    (_this$_effects$3 = this._effects[3]) === null || _this$_effects$3 === void 0 ? void 0 : _this$_effects$3.update([this.props.direction]);
    (_this$_effects$4 = this._effects[4]) === null || _this$_effects$4 === void 0 ? void 0 : _this$_effects$4.update([this.props.forceGeneratePockets, this.props.refreshStrategy, this.state.topPocketState, this.props.direction, this.props.needScrollViewContentWrapper, this.props.onUpdated, this.props.rtlEnabled, this.props.disabled]);
    (_this$_effects$5 = this._effects[5]) === null || _this$_effects$5 === void 0 ? void 0 : _this$_effects$5.update([this.props.direction, this.props.forceGeneratePockets, this.props.refreshStrategy, this.state.topPocketState, this.props.pullDownEnabled, this.state.topPocketHeight]);
    (_this$_effects$6 = this._effects[6]) === null || _this$_effects$6 === void 0 ? void 0 : _this$_effects$6.update([this.props.forceGeneratePockets, this.props.refreshStrategy, this.props.pullDownEnabled, this.state.topPocketState, this.state.topPocketHeight, this.props.onPullDown]);
    (_this$_effects$7 = this._effects[7]) === null || _this$_effects$7 === void 0 ? void 0 : _this$_effects$7.update([this.props.forceGeneratePockets, this.props.refreshStrategy, this.state.topPocketState, this.state.topPocketHeight, this.props.onPullDown]);
  }

  disposeReleaseTimer() {
    return () => this.clearReleaseTimer();
  }

  scrollEffect() {
    return subscribeToScrollEvent(this.containerRef.current, event => {
      this.handleScroll(event);
    });
  }

  effectDisabledState() {
    if (this.props.disabled) {
      this.lock();
    } else {
      this.unlock();
    }
  }

  effectResetInactiveState() {
    if (this.props.direction === DIRECTION_BOTH) {
      return;
    }

    this.containerRef.current[this.fullScrollInactiveProp] = 0;
  }

  initEffect() {
    return subscribeToScrollInitEvent(this.wrapperRef.current, event => {
      this.handleInit(event);
    }, this.getInitEventData());
  }

  moveEffect() {
    return subscribeToDXScrollMoveEvent(this.wrapperRef.current, event => {
      this.handleMove(event);
    });
  }

  endEffect() {
    return subscribeToDXScrollEndEvent(this.wrapperRef.current, () => {
      this.handleEnd();
    });
  }

  stopEffect() {
    return subscribeToDXScrollStopEvent(this.wrapperRef.current, () => {
      this.handleStop();
    });
  }

  disposeRefreshTimer() {
    return () => this.clearRefreshTimer();
  }

  updateDimensions() {
    this.updateElementDimensions();
  }

  subscribeContainerToResize() {
    return subscribeToResize(this.containerRef.current, element => {
      this.setContainerDimensions(element);
    });
  }

  subscribeContentToResize() {
    return subscribeToResize(this.content(), element => {
      this.setContentDimensions(element);
    });
  }

  clearReleaseTimer() {
    clearTimeout(this.releaseTimer);
    this.releaseTimer = undefined;
  }

  onRelease() {
    this.loadingIndicatorEnabled = true;
    this.finishLoading();
    this.updateHandler();
  }

  onUpdated() {
    var _this$props$onUpdated, _this$props;

    (_this$props$onUpdated = (_this$props = this.props).onUpdated) === null || _this$props$onUpdated === void 0 ? void 0 : _this$props$onUpdated.call(_this$props, this.getEventArgs());
  }

  startLoading() {
    if (this.loadingIndicatorEnabled && isElementVisible(this.scrollableRef.current)) {
      this.setState(__state_argument => ({
        isLoadPanelVisible: true
      }));
    }

    this.lock();
  }

  finishLoading() {
    this.setState(__state_argument => ({
      isLoadPanelVisible: false
    }));
    this.unlock();
  }

  setPocketState(newState) {
    this.setState(__state_argument => ({
      topPocketState: newState
    }));
  }

  handleScroll(event) {
    var _this$props$onScroll, _this$props2;

    this.eventForUserAction = event;

    if (this.props.useSimulatedScrollbar) {
      this.setState(__state_argument => ({
        scrolling: true
      }));
      this.syncScrollbarsWithContent();
      this.setState(__state_argument => ({
        scrolling: false
      }));
    }

    (_this$props$onScroll = (_this$props2 = this.props).onScroll) === null || _this$props$onScroll === void 0 ? void 0 : _this$props$onScroll.call(_this$props2, this.getEventArgs());
    this.handlePocketState();
  }

  handlePocketState() {
    if (this.props.forceGeneratePockets) {
      if (this.state.topPocketState === TopPocketState.STATE_REFRESHING) {
        return;
      }

      var {
        scrollTop
      } = this.containerRef.current;
      var scrollDelta = this.locationTop + scrollTop;
      this.locationTop = -scrollTop;

      if (this.isSwipeDownStrategy && scrollDelta > 0 && this.isReachBottom()) {
        this.onReachBottom();
        return;
      }

      if (this.isPullDownStrategy) {
        if (this.pulledDown()) {
          this.pullDownReady();
          return;
        }

        if (scrollDelta > 0 && this.isReachBottom()) {
          if (this.state.topPocketState !== TopPocketState.STATE_LOADING) {
            this.setPocketState(TopPocketState.STATE_LOADING);
            this.onReachBottom();
          }

          return;
        }
      }

      this.stateReleased();
    }
  }

  pullDownReady() {
    if (this.state.topPocketState === TopPocketState.STATE_READY) {
      return;
    }

    this.setPocketState(TopPocketState.STATE_READY);
  }

  onReachBottom() {
    var _this$props$onReachBo, _this$props3;

    (_this$props$onReachBo = (_this$props3 = this.props).onReachBottom) === null || _this$props$onReachBo === void 0 ? void 0 : _this$props$onReachBo.call(_this$props3, {});
  }

  onPullDown() {
    var _this$props$onPullDow, _this$props4;

    (_this$props$onPullDow = (_this$props4 = this.props).onPullDown) === null || _this$props$onPullDow === void 0 ? void 0 : _this$props$onPullDow.call(_this$props4, {});
  }

  stateReleased() {
    if (this.state.topPocketState === TopPocketState.STATE_RELEASED) {
      return;
    }

    this.releaseState();
  }

  getEventArgs() {
    var scrollOffset = this.scrollOffset();
    return _extends({
      event: this.eventForUserAction,
      scrollOffset
    }, getBoundaryProps(this.props.direction, scrollOffset, this.containerRef.current));
  }

  lock() {
    this.locked = true;
  }

  unlock() {
    if (!this.props.disabled) {
      this.locked = false;
    }
  }

  get fullScrollInactiveProp() {
    return this.props.direction === DIRECTION_HORIZONTAL ? "scrollTop" : "scrollLeft";
  }

  updateElementDimensions() {
    this.setContentDimensions(this.content());
    this.setContainerDimensions(this.containerRef.current);
  }

  setContainerDimensions(containerEl) {
    this.setState(__state_argument => ({
      containerClientWidth: containerEl.clientWidth
    }));
    this.setState(__state_argument => ({
      containerClientHeight: containerEl.clientHeight
    }));
  }

  setContentDimensions(contentEl) {
    this.setState(__state_argument => ({
      contentClientWidth: contentEl.clientWidth
    }));
    this.setState(__state_argument => ({
      contentClientHeight: contentEl.clientHeight
    }));
    this.setState(__state_argument => ({
      contentScrollWidth: contentEl.scrollWidth
    }));
    this.setState(__state_argument => ({
      contentScrollHeight: contentEl.scrollHeight
    }));

    if (this.props.forceGeneratePockets) {
      this.setState(__state_argument => {
        var _this$topPocketRef;

        return {
          topPocketHeight: ((_this$topPocketRef = this.topPocketRef) === null || _this$topPocketRef === void 0 ? void 0 : _this$topPocketRef.current.clientHeight) || 0
        };
      });
      this.setState(__state_argument => {
        var _this$bottomPocketRef;

        return {
          bottomPocketHeight: ((_this$bottomPocketRef = this.bottomPocketRef) === null || _this$bottomPocketRef === void 0 ? void 0 : _this$bottomPocketRef.current.clientHeight) || 0
        };
      });
    }
  }

  syncScrollbarsWithContent() {
    var {
      left,
      top
    } = this.scrollOffset();
    this.setState(__state_argument => ({
      hScrollLocation: -left
    }));
    this.setState(__state_argument => ({
      vScrollLocation: -top
    }));
  }

  getInitEventData() {
    return {
      getDirection: () => this.tryGetAllowedDirection(),
      validate: event => this.validate(event),
      isNative: true,
      scrollTarget: this.containerRef.current
    };
  }

  handleInit(event) {
    if (this.props.forceGeneratePockets && this.isSwipeDownStrategy) {
      var {
        scrollTop
      } = this.containerRef.current;

      if (this.state.topPocketState === TopPocketState.STATE_RELEASED && scrollTop === 0) {
        this.initPageY = event.originalEvent.pageY;
        this.setPocketState(TopPocketState.STATE_TOUCHED);
      }
    }
  }

  handleMove(e) {
    if (this.locked) {
      e.cancel = true;
      return;
    }

    if (isDefined(this.tryGetAllowedDirection())) {
      e.originalEvent.isScrollingEvent = true;
    }

    if (this.props.forceGeneratePockets && this.isSwipeDownStrategy) {
      this.deltaY = e.originalEvent.pageY - this.initPageY;

      if (this.state.topPocketState === TopPocketState.STATE_TOUCHED) {
        if (this.pullDownEnabled && this.deltaY > 0) {
          this.setPocketState(TopPocketState.STATE_PULLED);
        } else {
          this.complete();
        }
      }

      if (this.state.topPocketState === TopPocketState.STATE_PULLED) {
        e.preventDefault();
        this.movePullDown();
      }
    }
  }

  handleEnd() {
    if (this.props.forceGeneratePockets) {
      if (this.isSwipeDownStrategy) {
        if (this.isSwipeDown()) {
          this.pullDownRefreshing();
        }

        this.complete();
      }

      if (this.isPullDownStrategy) {
        this.pullDownComplete();
      }
    }
  }

  handleStop() {
    if (this.props.forceGeneratePockets) {
      if (this.isSwipeDownStrategy) {
        this.complete();
      }

      if (this.isPullDownStrategy) {
        this.pullDownComplete();
      }
    }
  }

  pullDownComplete() {
    if (this.state.topPocketState === TopPocketState.STATE_READY) {
      this.setState(__state_argument => ({
        contentTranslateTop: this.state.topPocketHeight
      }));
      this.clearRefreshTimer();
      this.refreshTimer = setTimeout(() => {
        this.pullDownRefreshing();
      }, 400);
    }
  }

  clearRefreshTimer() {
    clearTimeout(this.refreshTimer);
    this.refreshTimer = undefined;
  }

  pullDownRefreshing() {
    if (this.state.topPocketState === TopPocketState.STATE_REFRESHING) {
      return;
    }

    this.setPocketState(TopPocketState.STATE_REFRESHING);

    if (this.isSwipeDownStrategy) {
      this.setState(__state_argument => ({
        pullDownTranslateTop: this.getPullDownHeight()
      }));
    }

    this.onPullDown();
  }

  movePullDown() {
    var pullDownHeight = this.getPullDownHeight();
    var top = Math.min(pullDownHeight * 3, this.deltaY + this.getPullDownStartPosition());
    var angle = 180 * top / pullDownHeight / 3;
    this.setState(__state_argument => ({
      pullDownOpacity: 1
    }));
    this.setState(__state_argument => ({
      pullDownTranslateTop: top
    }));
    this.setState(__state_argument => ({
      pullDownIconAngle: angle
    }));
  }

  getPullDownHeight() {
    return Math.round(this.scrollableRef.current.offsetHeight * 0.05);
  }

  getPullDownStartPosition() {
    return -Math.round(this.state.topPocketHeight * 1.5);
  }

  complete() {
    if (this.state.topPocketState === TopPocketState.STATE_TOUCHED || this.state.topPocketState === TopPocketState.STATE_PULLED) {
      this.releaseState();
    }
  }

  releaseState() {
    this.setPocketState(TopPocketState.STATE_RELEASED);
    this.setState(__state_argument => ({
      pullDownOpacity: 0
    }));
  }

  get isSwipeDownStrategy() {
    return this.props.refreshStrategy === "swipeDown";
  }

  get isPullDownStrategy() {
    return this.props.refreshStrategy === "pullDown";
  }

  isSwipeDown() {
    return this.pullDownEnabled && this.state.topPocketState === TopPocketState.STATE_PULLED && this.deltaY >= this.getPullDownHeight() - this.getPullDownStartPosition();
  }

  pulledDown() {
    var {
      scrollTop
    } = this.containerRef.current;
    return this.pullDownEnabled && scrollTop <= -this.state.topPocketHeight;
  }

  isReachBottom() {
    var {
      scrollTop
    } = this.containerRef.current;
    return this.props.reachBottomEnabled && Math.round(-scrollTop - this.vScrollOffsetMax) <= 1;
  }

  tryGetAllowedDirection() {
    var containerEl = this.containerRef.current;
    return allowedDirection(this.props.direction, getScrollTopMax(containerEl), getScrollLeftMax(containerEl), false);
  }

  isLocked() {
    return this.locked;
  }

  isScrollingOutOfBound(event) {
    var {
      delta,
      shiftKey
    } = event;
    var {
      clientHeight,
      clientWidth,
      scrollHeight,
      scrollLeft,
      scrollTop,
      scrollWidth
    } = this.containerRef.current;

    if (delta > 0) {
      return shiftKey ? !scrollLeft : !scrollTop;
    }

    return shiftKey ? clientWidth >= scrollWidth - scrollLeft : clientHeight >= scrollHeight - scrollTop;
  }

  get cssClasses() {
    var {
      classes,
      direction,
      disabled,
      showScrollbar
    } = this.props;
    var classesMap = {
      ["dx-scrollable dx-scrollable-native dx-scrollable-native-".concat(devices.real().platform)]: true,
      ["dx-scrollable-".concat(direction)]: true,
      [SCROLLABLE_DISABLED_CLASS]: !!disabled,
      [SCROLLABLE_SCROLLBAR_SIMULATED]: showScrollbar !== "never" && this.props.useSimulatedScrollbar,
      [SCROLLABLE_SCROLLBARS_HIDDEN]: showScrollbar === "never",
      [String(classes)]: !!classes
    };
    return combineClasses(classesMap);
  }

  get direction() {
    if (this.__getterCache["direction"] !== undefined) {
      return this.__getterCache["direction"];
    }

    return this.__getterCache["direction"] = (() => {
      return new ScrollDirection(this.props.direction);
    })();
  }

  get pullDownEnabled() {
    return this.props.pullDownEnabled && devices.real().platform !== "generic";
  }

  get contentStyles() {
    if (this.__getterCache["contentStyles"] !== undefined) {
      return this.__getterCache["contentStyles"];
    }

    return this.__getterCache["contentStyles"] = (() => {
      if (this.props.forceGeneratePockets && this.isPullDownStrategy) {
        return {
          transform: "translate(0px, ".concat(this.state.contentTranslateTop, "px)")
        };
      }

      return undefined;
    })();
  }

  get contentHeight() {
    var _this$contentRef;

    return getElementOverflowY((_this$contentRef = this.contentRef) === null || _this$contentRef === void 0 ? void 0 : _this$contentRef.current) === "hidden" ? this.state.contentClientHeight : Math.max(this.state.contentScrollHeight, this.state.contentClientHeight);
  }

  get contentWidth() {
    var _this$contentRef2;

    return getElementOverflowX((_this$contentRef2 = this.contentRef) === null || _this$contentRef2 === void 0 ? void 0 : _this$contentRef2.current) === "hidden" ? this.state.contentClientWidth : Math.max(this.state.contentScrollWidth, this.state.contentClientWidth);
  }

  get hScrollOffsetMax() {
    return -Math.max(this.contentWidth - this.state.containerClientWidth, 0);
  }

  get vScrollOffsetMax() {
    return -Math.max(this.contentHeight - this.state.containerClientHeight, 0);
  }

  get restAttributes() {
    var _this$props5 = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props5, _excluded);

    return restProps;
  }

  content() {
    if (this.props.needScrollViewContentWrapper) {
      return this.scrollViewContentRef.current;
    }

    return this.contentRef.current;
  }

  container() {
    return this.containerRef.current;
  }

  refresh() {
    this.setPocketState(TopPocketState.STATE_READY);
    this.startLoading();
    this.onPullDown();
  }

  release() {
    this.clearReleaseTimer();

    if (this.isPullDownStrategy) {
      if (this.state.topPocketState === TopPocketState.STATE_LOADING) {
        this.setPocketState(TopPocketState.STATE_RELEASED);
      }
    }

    this.releaseTimer = setTimeout(() => {
      if (this.isPullDownStrategy) {
        this.setState(__state_argument => ({
          contentTranslateTop: 0
        }));
      }

      this.stateReleased();
      this.onRelease();
    }, this.isSwipeDownStrategy ? 800 : 400);
  }

  scrollHeight() {
    return this.content().offsetHeight;
  }

  scrollWidth() {
    return this.content().offsetWidth;
  }

  scrollOffset() {
    return {
      top: this.scrollTop(),
      left: this.scrollLeft()
    };
  }

  scrollTop() {
    return this.containerRef.current.scrollTop;
  }

  scrollLeft() {
    var containerEl = this.containerRef.current;
    var scrollLeftMax = getScrollLeftMax(containerEl);
    return normalizeOffsetLeft(containerEl.scrollLeft, scrollLeftMax, !!this.props.rtlEnabled);
  }

  clientHeight() {
    return this.containerRef.current.clientHeight;
  }

  clientWidth() {
    return this.containerRef.current.clientWidth;
  }

  validate(event) {
    if (this.isLocked()) {
      return false;
    }

    this.updateHandler();
    return this.moveIsAllowed(event);
  }

  moveIsAllowed(event) {
    if (this.props.disabled || isDxMouseWheelEvent(event) && this.isScrollingOutOfBound(event)) {
      return false;
    }

    return isDefined(this.tryGetAllowedDirection());
  }

  updateHandler() {
    this.updateElementDimensions();
    this.onUpdated();
  }

  scrollByLocation(location) {
    var containerEl = this.containerRef.current;

    if (this.direction.isVertical) {
      containerEl.scrollTop += location.top;
    }

    if (this.direction.isHorizontal) {
      containerEl.scrollLeft += location.left;
    }
  }

  componentWillUpdate(nextProps, nextState, context) {
    super.componentWillUpdate();

    if (this.props["direction"] !== nextProps["direction"]) {
      this.__getterCache["direction"] = undefined;
    }

    if (this.props["forceGeneratePockets"] !== nextProps["forceGeneratePockets"] || this.props["refreshStrategy"] !== nextProps["refreshStrategy"] || this.state["contentTranslateTop"] !== nextState["contentTranslateTop"]) {
      this.__getterCache["contentStyles"] = undefined;
    }
  }

  render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props),
      containerClientWidth: this.state.containerClientWidth,
      containerClientHeight: this.state.containerClientHeight,
      contentClientWidth: this.state.contentClientWidth,
      contentClientHeight: this.state.contentClientHeight,
      contentScrollWidth: this.state.contentScrollWidth,
      contentScrollHeight: this.state.contentScrollHeight,
      topPocketHeight: this.state.topPocketHeight,
      bottomPocketHeight: this.state.bottomPocketHeight,
      scrolling: this.state.scrolling,
      topPocketState: this.state.topPocketState,
      isLoadPanelVisible: this.state.isLoadPanelVisible,
      pullDownTranslateTop: this.state.pullDownTranslateTop,
      pullDownIconAngle: this.state.pullDownIconAngle,
      pullDownOpacity: this.state.pullDownOpacity,
      contentTranslateTop: this.state.contentTranslateTop,
      vScrollLocation: this.state.vScrollLocation,
      hScrollLocation: this.state.hScrollLocation,
      wrapperRef: this.wrapperRef,
      contentRef: this.contentRef,
      scrollViewContentRef: this.scrollViewContentRef,
      containerRef: this.containerRef,
      scrollableRef: this.scrollableRef,
      topPocketRef: this.topPocketRef,
      bottomPocketRef: this.bottomPocketRef,
      vScrollbarRef: this.vScrollbarRef,
      hScrollbarRef: this.hScrollbarRef,
      clearReleaseTimer: this.clearReleaseTimer,
      onRelease: this.onRelease,
      onUpdated: this.onUpdated,
      startLoading: this.startLoading,
      finishLoading: this.finishLoading,
      setPocketState: this.setPocketState,
      handleScroll: this.handleScroll,
      handlePocketState: this.handlePocketState,
      pullDownReady: this.pullDownReady,
      onReachBottom: this.onReachBottom,
      onPullDown: this.onPullDown,
      stateReleased: this.stateReleased,
      getEventArgs: this.getEventArgs,
      lock: this.lock,
      unlock: this.unlock,
      fullScrollInactiveProp: this.fullScrollInactiveProp,
      updateElementDimensions: this.updateElementDimensions,
      setContainerDimensions: this.setContainerDimensions,
      setContentDimensions: this.setContentDimensions,
      syncScrollbarsWithContent: this.syncScrollbarsWithContent,
      getInitEventData: this.getInitEventData,
      handleInit: this.handleInit,
      handleMove: this.handleMove,
      handleEnd: this.handleEnd,
      handleStop: this.handleStop,
      pullDownComplete: this.pullDownComplete,
      clearRefreshTimer: this.clearRefreshTimer,
      pullDownRefreshing: this.pullDownRefreshing,
      movePullDown: this.movePullDown,
      getPullDownHeight: this.getPullDownHeight,
      getPullDownStartPosition: this.getPullDownStartPosition,
      complete: this.complete,
      releaseState: this.releaseState,
      isSwipeDownStrategy: this.isSwipeDownStrategy,
      isPullDownStrategy: this.isPullDownStrategy,
      isSwipeDown: this.isSwipeDown,
      pulledDown: this.pulledDown,
      isReachBottom: this.isReachBottom,
      tryGetAllowedDirection: this.tryGetAllowedDirection,
      isLocked: this.isLocked,
      isScrollingOutOfBound: this.isScrollingOutOfBound,
      cssClasses: this.cssClasses,
      direction: this.direction,
      pullDownEnabled: this.pullDownEnabled,
      contentStyles: this.contentStyles,
      contentHeight: this.contentHeight,
      contentWidth: this.contentWidth,
      hScrollOffsetMax: this.hScrollOffsetMax,
      vScrollOffsetMax: this.vScrollOffsetMax,
      restAttributes: this.restAttributes
    });
  }

}
ScrollableNative.defaultProps = ScrollableNativeProps;