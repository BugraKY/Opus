import { getHeight, getWidth } from '../../core/utils/size';
import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import eventsEngine from '../../events/core/events_engine';
import { titleize } from '../../core/utils/inflector';
import { extend } from '../../core/utils/extend';
import { getWindow, hasWindow } from '../../core/utils/window';
import { each, map } from '../../core/utils/iterator';
import { isDefined } from '../../core/utils/type';
import { getBoundingRect } from '../../core/utils/position';
import { resetPosition, move, locate } from '../../animation/translator';
import Class from '../../core/class';
import Animator from './animator';
import { isDxMouseWheelEvent, addNamespace as addEventNamespace, normalizeKeyName, isCommandKeyPressed } from '../../events/utils/index';
import { deferUpdate, deferUpdater, deferRender, deferRenderer, noop } from '../../core/utils/common';
import Scrollbar from './ui.scrollbar';
import { when, Deferred } from '../../core/utils/deferred';
var SCROLLABLE_SIMULATED = 'dxSimulatedScrollable';
var SCROLLABLE_STRATEGY = 'dxScrollableStrategy';
var SCROLLABLE_SIMULATED_CURSOR = SCROLLABLE_SIMULATED + 'Cursor';
var SCROLLABLE_SIMULATED_KEYBOARD = SCROLLABLE_SIMULATED + 'Keyboard';
var SCROLLABLE_SIMULATED_CLASS = 'dx-scrollable-simulated';
var SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE = 'dx-scrollable-scrollbars-alwaysvisible';
var SCROLLABLE_SCROLLBAR_CLASS = 'dx-scrollable-scrollbar';
var VERTICAL = 'vertical';
var HORIZONTAL = 'horizontal';
var ACCELERATION = 0.92;
var OUT_BOUNDS_ACCELERATION = 0.5;
var MIN_VELOCITY_LIMIT = 1;
var FRAME_DURATION = Math.round(1000 / 60);
var SCROLL_LINE_HEIGHT = 40;
var VALIDATE_WHEEL_TIMEOUT = 500;
var BOUNCE_MIN_VELOCITY_LIMIT = MIN_VELOCITY_LIMIT / 5;
var BOUNCE_DURATION = 400;
var BOUNCE_FRAMES = BOUNCE_DURATION / FRAME_DURATION;
var BOUNCE_ACCELERATION_SUM = (1 - Math.pow(ACCELERATION, BOUNCE_FRAMES)) / (1 - ACCELERATION);
var KEY_CODES = {
  PAGE_UP: 'pageUp',
  PAGE_DOWN: 'pageDown',
  END: 'end',
  HOME: 'home',
  LEFT: 'leftArrow',
  UP: 'upArrow',
  RIGHT: 'rightArrow',
  DOWN: 'downArrow',
  TAB: 'tab'
};
var InertiaAnimator = Animator.inherit({
  ctor: function ctor(scroller) {
    this.callBase();
    this.scroller = scroller;
  },
  VELOCITY_LIMIT: MIN_VELOCITY_LIMIT,
  _isFinished: function _isFinished() {
    return Math.abs(this.scroller._velocity) <= this.VELOCITY_LIMIT;
  },
  _step: function _step() {
    this.scroller._scrollStep(this.scroller._velocity);

    this.scroller._velocity *= this._acceleration();
  },
  _acceleration: function _acceleration() {
    return this.scroller._inBounds() ? ACCELERATION : OUT_BOUNDS_ACCELERATION;
  },
  _complete: function _complete() {
    this.scroller._scrollComplete();
  }
});
var BounceAnimator = InertiaAnimator.inherit({
  VELOCITY_LIMIT: BOUNCE_MIN_VELOCITY_LIMIT,
  _isFinished: function _isFinished() {
    return this.scroller._crossBoundOnNextStep() || this.callBase();
  },
  _acceleration: function _acceleration() {
    return ACCELERATION;
  },
  _complete: function _complete() {
    this.scroller._move(this.scroller._bounceLocation);

    this.callBase();
  }
});
export var Scroller = Class.inherit({
  ctor: function ctor(options) {
    this._initOptions(options);

    this._initAnimators();

    this._initScrollbar();
  },
  _initOptions: function _initOptions(options) {
    this._location = 0;
    this._topReached = false;
    this._bottomReached = false;
    this._axis = options.direction === HORIZONTAL ? 'x' : 'y';
    this._prop = options.direction === HORIZONTAL ? 'left' : 'top';
    this._dimension = options.direction === HORIZONTAL ? 'width' : 'height';
    this._scrollProp = options.direction === HORIZONTAL ? 'scrollLeft' : 'scrollTop';
    each(options, (optionName, optionValue) => {
      this['_' + optionName] = optionValue;
    });
  },
  _initAnimators: function _initAnimators() {
    this._inertiaAnimator = new InertiaAnimator(this);
    this._bounceAnimator = new BounceAnimator(this);
  },
  _initScrollbar: function _initScrollbar() {
    this._scrollbar = new Scrollbar($('<div>').appendTo(this._$container), {
      direction: this._direction,
      visible: this._scrollByThumb,
      visibilityMode: this._visibilityModeNormalize(this._scrollbarVisible),
      expandable: this._scrollByThumb
    });
    this._$scrollbar = this._scrollbar.$element();
  },
  _visibilityModeNormalize: function _visibilityModeNormalize(mode) {
    return mode === true ? 'onScroll' : mode === false ? 'never' : mode;
  },
  _scrollStep: function _scrollStep(delta) {
    var prevLocation = this._location;
    this._location += delta;

    this._suppressBounce();

    this._move();

    if (Math.abs(prevLocation - this._location) < 1) {
      return;
    }

    eventsEngine.triggerHandler(this._$container, {
      type: 'scroll'
    });
  },
  _suppressBounce: function _suppressBounce() {
    if (this._bounceEnabled || this._inBounds(this._location)) {
      return;
    }

    this._velocity = 0;
    this._location = this._boundLocation();
  },
  _boundLocation: function _boundLocation(location) {
    location = location !== undefined ? location : this._location;
    return Math.max(Math.min(location, this._maxOffset), this._minOffset);
  },
  _move: function _move(location) {
    this._location = location !== undefined ? location * this._getScaleRatio() : this._location;

    this._moveContent();

    this._moveScrollbar();
  },
  _moveContent: function _moveContent() {
    var location = this._location;

    this._$container[this._scrollProp](-location / this._getScaleRatio());

    this._moveContentByTranslator(location);
  },
  _getScaleRatio: function _getScaleRatio() {
    if (hasWindow() && !this._scaleRatio) {
      var element = this._$element.get(0);

      var realDimension = this._getRealDimension(element, this._dimension);

      var baseDimension = this._getBaseDimension(element, this._dimension); // NOTE: Ratio can be a fractional number, which leads to inaccuracy in the calculation of sizes.
      //       We should round it to hundredths in order to reduce the inaccuracy and prevent the unexpected appearance of a scrollbar.


      this._scaleRatio = Math.round(realDimension / baseDimension * 100) / 100;
    }

    return this._scaleRatio || 1;
  },
  _getRealDimension: function _getRealDimension(element, dimension) {
    return Math.round(getBoundingRect(element)[dimension]);
  },
  _getBaseDimension: function _getBaseDimension(element, dimension) {
    var dimensionName = 'offset' + titleize(dimension);
    return element[dimensionName];
  },
  _moveContentByTranslator: function _moveContentByTranslator(location) {
    var translateOffset;
    var minOffset = -this._maxScrollPropValue;

    if (location > 0) {
      translateOffset = location;
    } else if (location <= minOffset) {
      translateOffset = location - minOffset;
    } else {
      translateOffset = location % 1;
    }

    if (this._translateOffset === translateOffset) {
      return;
    }

    var targetLocation = {};
    targetLocation[this._prop] = translateOffset;
    this._translateOffset = translateOffset;

    if (translateOffset === 0) {
      resetPosition(this._$content);
      return;
    }

    move(this._$content, targetLocation);
  },
  _moveScrollbar: function _moveScrollbar() {
    this._scrollbar.moveTo(this._location);
  },
  _scrollComplete: function _scrollComplete() {
    if (this._inBounds()) {
      this._hideScrollbar();

      if (this._completeDeferred) {
        this._completeDeferred.resolve();
      }
    }

    this._scrollToBounds();
  },
  _scrollToBounds: function _scrollToBounds() {
    if (this._inBounds()) {
      return;
    }

    this._bounceAction();

    this._setupBounce();

    this._bounceAnimator.start();
  },
  _setupBounce: function _setupBounce() {
    var boundLocation = this._bounceLocation = this._boundLocation();

    var bounceDistance = boundLocation - this._location;
    this._velocity = bounceDistance / BOUNCE_ACCELERATION_SUM;
  },
  _inBounds: function _inBounds(location) {
    location = location !== undefined ? location : this._location;
    return this._boundLocation(location) === location;
  },
  _crossBoundOnNextStep: function _crossBoundOnNextStep() {
    var location = this._location;
    var nextLocation = location + this._velocity;
    return location < this._minOffset && nextLocation >= this._minOffset || location > this._maxOffset && nextLocation <= this._maxOffset;
  },
  _initHandler: function _initHandler(e) {
    this._stopScrolling();

    this._prepareThumbScrolling(e);
  },
  _stopScrolling: deferRenderer(function () {
    this._hideScrollbar();

    this._inertiaAnimator.stop();

    this._bounceAnimator.stop();
  }),
  _prepareThumbScrolling: function _prepareThumbScrolling(e) {
    if (isDxMouseWheelEvent(e.originalEvent)) {
      return;
    }

    var $target = $(e.originalEvent.target);

    var scrollbarClicked = this._isScrollbar($target);

    if (scrollbarClicked) {
      this._moveToMouseLocation(e);
    }

    this._thumbScrolling = scrollbarClicked || this._isThumb($target);
    this._crossThumbScrolling = !this._thumbScrolling && this._isAnyThumbScrolling($target);

    if (this._thumbScrolling) {
      this._scrollbar.feedbackOn();
    }
  },
  _isThumbScrollingHandler: function _isThumbScrollingHandler($target) {
    return this._isThumb($target);
  },
  _moveToMouseLocation: function _moveToMouseLocation(e) {
    var mouseLocation = e['page' + this._axis.toUpperCase()] - this._$element.offset()[this._prop];

    var location = this._location + mouseLocation / this._containerToContentRatio() - getHeight(this._$container) / 2;

    this._scrollStep(-Math.round(location));
  },
  _startHandler: function _startHandler() {
    this._showScrollbar();
  },
  _moveHandler: function _moveHandler(delta) {
    if (this._crossThumbScrolling) {
      return;
    }

    if (this._thumbScrolling) {
      delta[this._axis] = -Math.round(delta[this._axis] / this._containerToContentRatio());
    }

    this._scrollBy(delta);
  },
  _scrollBy: function _scrollBy(delta) {
    delta = delta[this._axis];

    if (!this._inBounds()) {
      delta *= OUT_BOUNDS_ACCELERATION;
    }

    this._scrollStep(delta);
  },
  _scrollByHandler: function _scrollByHandler(delta) {
    this._scrollBy(delta);

    this._scrollComplete();
  },
  _containerToContentRatio: function _containerToContentRatio() {
    return this._scrollbar.containerToContentRatio();
  },
  _endHandler: function _endHandler(velocity) {
    this._completeDeferred = new Deferred();
    this._velocity = velocity[this._axis];

    this._inertiaHandler();

    this._resetThumbScrolling();

    return this._completeDeferred.promise();
  },
  _inertiaHandler: function _inertiaHandler() {
    this._suppressInertia();

    this._inertiaAnimator.start();
  },
  _suppressInertia: function _suppressInertia() {
    if (!this._inertiaEnabled || this._thumbScrolling) {
      this._velocity = 0;
    }
  },
  _resetThumbScrolling: function _resetThumbScrolling() {
    this._thumbScrolling = false;
    this._crossThumbScrolling = false;
  },
  _stopHandler: function _stopHandler() {
    if (this._thumbScrolling) {
      this._scrollComplete();
    }

    this._resetThumbScrolling();

    this._scrollToBounds();
  },
  _disposeHandler: function _disposeHandler() {
    this._stopScrolling();

    this._$scrollbar.remove();
  },
  _updateHandler: function _updateHandler() {
    this._update();

    this._moveToBounds();
  },
  _update: function _update() {
    this._stopScrolling();

    return deferUpdate(() => {
      this._resetScaleRatio();

      this._updateLocation();

      this._updateBounds();

      this._updateScrollbar();

      deferRender(() => {
        this._moveScrollbar();

        this._scrollbar.update();
      });
    });
  },
  _resetScaleRatio: function _resetScaleRatio() {
    this._scaleRatio = null;
  },
  _updateLocation: function _updateLocation() {
    this._location = (locate(this._$content)[this._prop] - this._$container[this._scrollProp]()) * this._getScaleRatio();
  },
  _updateBounds: function _updateBounds() {
    this._maxOffset = this._getMaxOffset();
    this._minOffset = this._getMinOffset();
  },
  _getMaxOffset: function _getMaxOffset() {
    return 0;
  },
  _getMinOffset: function _getMinOffset() {
    this._maxScrollPropValue = Math.max(this._contentSize() - this._containerSize(), 0);
    return -this._maxScrollPropValue;
  },
  _updateScrollbar: deferUpdater(function () {
    var containerSize = this._containerSize();

    var contentSize = this._contentSize(); // NOTE: Real container and content sizes can be a fractional number when scaling.
    //       Let's save sizes when scale = 100% to decide whether it is necessary to show
    //       the scrollbar based on by more precise numbers. We can do it because the container
    //       size to content size ratio should remain approximately the same at any zoom.


    var baseContainerSize = this._getBaseDimension(this._$container.get(0), this._dimension);

    var baseContentSize = this._getBaseDimension(this._$content.get(0), this._dimension);

    deferRender(() => {
      this._scrollbar.option({
        containerSize,
        contentSize,
        baseContainerSize,
        baseContentSize,
        scaleRatio: this._getScaleRatio()
      });
    });
  }),
  _moveToBounds: deferRenderer(deferUpdater(deferRenderer(function () {
    var location = this._boundLocation();

    var locationChanged = location !== this._location;
    this._location = location;

    this._move();

    if (locationChanged) {
      this._scrollAction();
    }
  }))),
  _createActionsHandler: function _createActionsHandler(actions) {
    this._scrollAction = actions.scroll;
    this._bounceAction = actions.bounce;
  },
  _showScrollbar: function _showScrollbar() {
    this._scrollbar.option('visible', true);
  },
  _hideScrollbar: function _hideScrollbar() {
    this._scrollbar.option('visible', false);
  },
  _containerSize: function _containerSize() {
    return this._getRealDimension(this._$container.get(0), this._dimension);
  },
  _contentSize: function _contentSize() {
    var isOverflowHidden = this._$content.css('overflow' + this._axis.toUpperCase()) === 'hidden';

    var contentSize = this._getRealDimension(this._$content.get(0), this._dimension);

    if (!isOverflowHidden) {
      var containerScrollSize = this._$content[0]['scroll' + titleize(this._dimension)] * this._getScaleRatio();

      contentSize = Math.max(containerScrollSize, contentSize);
    }

    return contentSize;
  },
  _validateEvent: function _validateEvent(e) {
    var $target = $(e.originalEvent.target);
    return this._isThumb($target) || this._isScrollbar($target);
  },
  _isThumb: function _isThumb($element) {
    return this._scrollByThumb && this._scrollbar.isThumb($element);
  },
  _isScrollbar: function _isScrollbar($element) {
    return this._scrollByThumb && $element && $element.is(this._$scrollbar);
  },
  _reachedMin: function _reachedMin() {
    return Math.round(this._location - this._minOffset) <= 0;
  },
  _reachedMax: function _reachedMax() {
    return Math.round(this._location - this._maxOffset) >= 0;
  },
  _cursorEnterHandler: function _cursorEnterHandler() {
    this._resetScaleRatio();

    this._updateScrollbar();

    this._scrollbar.cursorEnter();
  },
  _cursorLeaveHandler: function _cursorLeaveHandler() {
    this._scrollbar.cursorLeave();
  },
  dispose: noop
});
var hoveredScrollable;
var activeScrollable;
export var SimulatedStrategy = Class.inherit({
  ctor: function ctor(scrollable) {
    this._init(scrollable);
  },
  _init: function _init(scrollable) {
    this._component = scrollable;
    this._$element = scrollable.$element();
    this._$container = $(scrollable.container());
    this._$wrapper = scrollable._$wrapper;
    this._$content = scrollable.$content();
    this.option = scrollable.option.bind(scrollable);
    this._createActionByOption = scrollable._createActionByOption.bind(scrollable);
    this._isLocked = scrollable._isLocked.bind(scrollable);
    this._isDirection = scrollable._isDirection.bind(scrollable);
    this._allowedDirection = scrollable._allowedDirection.bind(scrollable);
    this._getMaxOffset = scrollable._getMaxOffset.bind(scrollable);
  },
  render: function render() {
    this._$element.addClass(SCROLLABLE_SIMULATED_CLASS);

    this._createScrollers();

    if (this.option('useKeyboard')) {
      this._$container.prop('tabIndex', 0);
    }

    this._attachKeyboardHandler();

    this._attachCursorHandlers();
  },
  _createScrollers: function _createScrollers() {
    this._scrollers = {};

    if (this._isDirection(HORIZONTAL)) {
      this._createScroller(HORIZONTAL);
    }

    if (this._isDirection(VERTICAL)) {
      this._createScroller(VERTICAL);
    }

    this._$element.toggleClass(SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE, this.option('showScrollbar') === 'always');
  },
  _createScroller: function _createScroller(direction) {
    this._scrollers[direction] = new Scroller(this._scrollerOptions(direction));
  },
  _scrollerOptions: function _scrollerOptions(direction) {
    return {
      direction: direction,
      $content: this._$content,
      $container: this._$container,
      $wrapper: this._$wrapper,
      $element: this._$element,
      scrollByThumb: this.option('scrollByThumb'),
      scrollbarVisible: this.option('showScrollbar'),
      bounceEnabled: this.option('bounceEnabled'),
      inertiaEnabled: this.option('inertiaEnabled'),
      isAnyThumbScrolling: this._isAnyThumbScrolling.bind(this)
    };
  },
  _applyScaleRatio: function _applyScaleRatio(targetLocation) {
    for (var direction in this._scrollers) {
      var prop = this._getPropByDirection(direction);

      if (isDefined(targetLocation[prop])) {
        var scroller = this._scrollers[direction];
        targetLocation[prop] *= scroller._getScaleRatio();
      }
    }

    return targetLocation;
  },
  _isAnyThumbScrolling: function _isAnyThumbScrolling($target) {
    var result = false;

    this._eventHandler('isThumbScrolling', $target).done(function (isThumbScrollingVertical, isThumbScrollingHorizontal) {
      result = isThumbScrollingVertical || isThumbScrollingHorizontal;
    });

    return result;
  },
  handleInit: function handleInit(e) {
    this._suppressDirections(e);

    this._eventForUserAction = e;

    this._eventHandler('init', e);
  },
  _suppressDirections: function _suppressDirections(e) {
    if (isDxMouseWheelEvent(e.originalEvent)) {
      this._prepareDirections(true);

      return;
    }

    this._prepareDirections();

    this._eachScroller(function (scroller, direction) {
      var $target = $(e.originalEvent.target);

      var isValid = scroller._validateEvent(e) || this.option('scrollByContent') && this._isContent($target);

      this._validDirections[direction] = isValid;
    });
  },
  _isContent: function _isContent($element) {
    return !!$element.closest(this._$element).length;
  },
  _prepareDirections: function _prepareDirections(value) {
    value = value || false;
    this._validDirections = {};
    this._validDirections[HORIZONTAL] = value;
    this._validDirections[VERTICAL] = value;
  },
  _eachScroller: function _eachScroller(callback) {
    callback = callback.bind(this);
    each(this._scrollers, function (direction, scroller) {
      callback(scroller, direction);
    });
  },
  handleStart: function handleStart(e) {
    this._eventForUserAction = e;

    this._eventHandler('start').done(this._startAction);
  },
  _saveActive: function _saveActive() {
    activeScrollable = this;
  },
  _resetActive: function _resetActive() {
    if (activeScrollable === this) {
      activeScrollable = null;
    }
  },
  handleMove: function handleMove(e) {
    if (this._isLocked()) {
      e.cancel = true;

      this._resetActive();

      return;
    }

    this._saveActive();

    e.preventDefault && e.preventDefault();

    this._adjustDistance(e, e.delta);

    this._eventForUserAction = e;

    this._eventHandler('move', e.delta);
  },
  _adjustDistance: function _adjustDistance(e, distance) {
    distance.x *= this._validDirections[HORIZONTAL];
    distance.y *= this._validDirections[VERTICAL];

    var devicePixelRatio = this._tryGetDevicePixelRatio();

    if (devicePixelRatio && isDxMouseWheelEvent(e.originalEvent)) {
      distance.x = Math.round(distance.x / devicePixelRatio * 100) / 100;
      distance.y = Math.round(distance.y / devicePixelRatio * 100) / 100;
    }
  },
  _tryGetDevicePixelRatio: function _tryGetDevicePixelRatio() {
    if (hasWindow()) {
      return getWindow().devicePixelRatio;
    }
  },
  handleEnd: function handleEnd(e) {
    this._resetActive();

    this._refreshCursorState(e.originalEvent && e.originalEvent.target);

    this._adjustDistance(e, e.velocity);

    this._eventForUserAction = e;
    return this._eventHandler('end', e.velocity).done(this._endAction);
  },
  handleCancel: function handleCancel(e) {
    this._resetActive();

    this._eventForUserAction = e;
    return this._eventHandler('end', {
      x: 0,
      y: 0
    });
  },
  handleStop: function handleStop() {
    this._resetActive();

    this._eventHandler('stop');
  },
  handleScroll: function handleScroll() {
    this._updateRtlConfig();

    this._scrollAction();
  },
  _attachKeyboardHandler: function _attachKeyboardHandler() {
    eventsEngine.off(this._$element, ".".concat(SCROLLABLE_SIMULATED_KEYBOARD));

    if (!this.option('disabled') && this.option('useKeyboard')) {
      eventsEngine.on(this._$element, addEventNamespace('keydown', SCROLLABLE_SIMULATED_KEYBOARD), this._keyDownHandler.bind(this));
    }
  },
  _keyDownHandler: function _keyDownHandler(e) {
    clearTimeout(this._updateHandlerTimeout);
    this._updateHandlerTimeout = setTimeout(() => {
      if (normalizeKeyName(e) === KEY_CODES.TAB) {
        this._eachScroller(scroller => {
          scroller._updateHandler();
        });
      }
    });

    if (!this._$container.is(domAdapter.getActiveElement())) {
      return;
    }

    var handled = true;

    switch (normalizeKeyName(e)) {
      case KEY_CODES.DOWN:
        this._scrollByLine({
          y: 1
        });

        break;

      case KEY_CODES.UP:
        this._scrollByLine({
          y: -1
        });

        break;

      case KEY_CODES.RIGHT:
        this._scrollByLine({
          x: 1
        });

        break;

      case KEY_CODES.LEFT:
        this._scrollByLine({
          x: -1
        });

        break;

      case KEY_CODES.PAGE_DOWN:
        this._scrollByPage(1);

        break;

      case KEY_CODES.PAGE_UP:
        this._scrollByPage(-1);

        break;

      case KEY_CODES.HOME:
        this._scrollToHome();

        break;

      case KEY_CODES.END:
        this._scrollToEnd();

        break;

      default:
        handled = false;
        break;
    }

    if (handled) {
      e.stopPropagation();
      e.preventDefault();
    }
  },
  _scrollByLine: function _scrollByLine(lines) {
    var devicePixelRatio = this._tryGetDevicePixelRatio();

    var scrollOffset = SCROLL_LINE_HEIGHT;

    if (devicePixelRatio) {
      scrollOffset = Math.abs(scrollOffset / devicePixelRatio * 100) / 100;
    }

    this.scrollBy({
      top: (lines.y || 0) * -scrollOffset,
      left: (lines.x || 0) * -scrollOffset
    });
  },
  _scrollByPage: function _scrollByPage(page) {
    var prop = this._wheelProp();

    var dimension = this._dimensionByProp(prop);

    var distance = {};
    var getter = dimension === 'width' ? getWidth : getHeight;
    distance[prop] = page * -getter(this._$container);
    this.scrollBy(distance);
  },
  _dimensionByProp: function _dimensionByProp(prop) {
    return prop === 'left' ? 'width' : 'height';
  },
  _getPropByDirection: function _getPropByDirection(direction) {
    return direction === HORIZONTAL ? 'left' : 'top';
  },
  _scrollToHome: function _scrollToHome() {
    var prop = this._wheelProp();

    var distance = {};
    distance[prop] = 0;

    this._component.scrollTo(distance);
  },
  _scrollToEnd: function _scrollToEnd() {
    var prop = this._wheelProp();

    var dimension = this._dimensionByProp(prop);

    var distance = {};
    var getter = dimension === 'width' ? getWidth : getHeight;
    distance[prop] = getter(this._$content) - getter(this._$container);

    this._component.scrollTo(distance);
  },
  createActions: function createActions() {
    this._startAction = this._createActionHandler('onStart');
    this._endAction = this._createActionHandler('onEnd');
    this._updateAction = this._createActionHandler('onUpdated');

    this._createScrollerActions();
  },
  _createScrollerActions: function _createScrollerActions() {
    this._scrollAction = this._createActionHandler('onScroll');
    this._bounceAction = this._createActionHandler('onBounce');

    this._eventHandler('createActions', {
      scroll: this._scrollAction,
      bounce: this._bounceAction
    });
  },
  _createActionHandler: function _createActionHandler(optionName) {
    var actionHandler = this._createActionByOption(optionName);

    return () => {
      actionHandler(extend(this._createActionArgs(), arguments));
    };
  },
  _createActionArgs: function _createActionArgs() {
    var {
      horizontal: scrollerX,
      vertical: scrollerY
    } = this._scrollers;

    var offset = this._getScrollOffset();

    this._scrollOffset = {
      top: scrollerY && offset.top,
      left: scrollerX && offset.left
    };
    return {
      event: this._eventForUserAction,
      scrollOffset: this._scrollOffset,
      reachedLeft: scrollerX && scrollerX._reachedMax(),
      reachedRight: scrollerX && scrollerX._reachedMin(),
      reachedTop: scrollerY && scrollerY._reachedMax(),
      reachedBottom: scrollerY && scrollerY._reachedMin()
    };
  },

  _getScrollOffset() {
    return {
      top: -this.location().top,
      left: -this.location().left
    };
  },

  _eventHandler: function _eventHandler(eventName) {
    var args = [].slice.call(arguments).slice(1);
    var deferreds = map(this._scrollers, scroller => {
      return scroller['_' + eventName + 'Handler'].apply(scroller, args);
    });
    return when.apply($, deferreds).promise();
  },
  location: function location() {
    var location = locate(this._$content);
    location.top -= this._$container.scrollTop();
    location.left -= this._$container.scrollLeft();
    return location;
  },
  disabledChanged: function disabledChanged() {
    this._attachCursorHandlers();
  },
  _attachCursorHandlers: function _attachCursorHandlers() {
    eventsEngine.off(this._$element, ".".concat(SCROLLABLE_SIMULATED_CURSOR));

    if (!this.option('disabled') && this._isHoverMode()) {
      eventsEngine.on(this._$element, addEventNamespace('mouseenter', SCROLLABLE_SIMULATED_CURSOR), this._cursorEnterHandler.bind(this));
      eventsEngine.on(this._$element, addEventNamespace('mouseleave', SCROLLABLE_SIMULATED_CURSOR), this._cursorLeaveHandler.bind(this));
    }
  },
  _isHoverMode: function _isHoverMode() {
    return this.option('showScrollbar') === 'onHover';
  },
  _cursorEnterHandler: function _cursorEnterHandler(e) {
    e = e || {};
    e.originalEvent = e.originalEvent || {};

    if (activeScrollable || e.originalEvent._hoverHandled) {
      return;
    }

    if (hoveredScrollable) {
      hoveredScrollable._cursorLeaveHandler();
    }

    hoveredScrollable = this;

    this._eventHandler('cursorEnter');

    e.originalEvent._hoverHandled = true;
  },
  _cursorLeaveHandler: function _cursorLeaveHandler(e) {
    if (hoveredScrollable !== this || activeScrollable === hoveredScrollable) {
      return;
    }

    this._eventHandler('cursorLeave');

    hoveredScrollable = null;

    this._refreshCursorState(e && e.relatedTarget);
  },
  _refreshCursorState: function _refreshCursorState(target) {
    if (!this._isHoverMode() && (!target || activeScrollable)) {
      return;
    }

    var $target = $(target);
    var $scrollable = $target.closest(".".concat(SCROLLABLE_SIMULATED_CLASS, ":not(.dx-state-disabled)"));
    var targetScrollable = $scrollable.length && $scrollable.data(SCROLLABLE_STRATEGY);

    if (hoveredScrollable && hoveredScrollable !== targetScrollable) {
      hoveredScrollable._cursorLeaveHandler();
    }

    if (targetScrollable) {
      targetScrollable._cursorEnterHandler();
    }
  },
  update: function update() {
    var result = this._eventHandler('update').done(this._updateAction);

    return when(result, deferUpdate(() => {
      var allowedDirections = this._allowedDirections();

      deferRender(() => {
        var touchDirection = allowedDirections.vertical ? 'pan-x' : '';
        touchDirection = allowedDirections.horizontal ? 'pan-y' : touchDirection;
        touchDirection = allowedDirections.vertical && allowedDirections.horizontal ? 'none' : touchDirection;

        this._$container.css('touchAction', touchDirection);
      });
      return when().promise();
    }));
  },
  _allowedDirections: function _allowedDirections() {
    var bounceEnabled = this.option('bounceEnabled');
    var verticalScroller = this._scrollers[VERTICAL];
    var horizontalScroller = this._scrollers[HORIZONTAL];
    return {
      vertical: verticalScroller && (verticalScroller._minOffset < 0 || bounceEnabled),
      horizontal: horizontalScroller && (horizontalScroller._minOffset < 0 || bounceEnabled)
    };
  },
  _updateBounds: function _updateBounds() {
    this._scrollers[HORIZONTAL] && this._scrollers[HORIZONTAL]._updateBounds();
  },
  _isHorizontalAndRtlEnabled: function _isHorizontalAndRtlEnabled() {
    return this.option('rtlEnabled') && this.option('direction') !== VERTICAL;
  },
  updateRtlPosition: function updateRtlPosition(needInitializeRtlConfig) {
    if (needInitializeRtlConfig) {
      this._rtlConfig = {
        scrollRight: 0,
        clientWidth: this._$container.get(0).clientWidth,
        windowPixelRatio: this._getWindowDevicePixelRatio()
      };
    }

    this._updateBounds();

    if (this._isHorizontalAndRtlEnabled()) {
      deferUpdate(() => {
        var scrollLeft = this._getMaxOffset().left - this._rtlConfig.scrollRight;

        if (scrollLeft <= 0) {
          scrollLeft = 0;
          this._rtlConfig.scrollRight = this._getMaxOffset().left;
        }

        deferRender(() => {
          if (this._getScrollOffset().left !== scrollLeft) {
            this._rtlConfig.skipUpdating = true;

            this._component.scrollTo({
              left: scrollLeft
            });

            this._rtlConfig.skipUpdating = false;
          }
        });
      });
    }
  },
  _updateRtlConfig: function _updateRtlConfig() {
    if (this._isHorizontalAndRtlEnabled() && !this._rtlConfig.skipUpdating) {
      var {
        clientWidth,
        scrollLeft
      } = this._$container.get(0);

      var windowPixelRatio = this._getWindowDevicePixelRatio();

      if (this._rtlConfig.windowPixelRatio === windowPixelRatio && this._rtlConfig.clientWidth === clientWidth) {
        this._rtlConfig.scrollRight = this._getMaxOffset().left - scrollLeft;
      }

      this._rtlConfig.clientWidth = clientWidth;
      this._rtlConfig.windowPixelRatio = windowPixelRatio;
    }
  },
  _getWindowDevicePixelRatio: function _getWindowDevicePixelRatio() {
    return hasWindow() ? getWindow().devicePixelRatio : 1;
  },
  scrollBy: function scrollBy(distance) {
    var verticalScroller = this._scrollers[VERTICAL];
    var horizontalScroller = this._scrollers[HORIZONTAL];

    if (verticalScroller) {
      distance.top = verticalScroller._boundLocation(distance.top + verticalScroller._location) - verticalScroller._location;
    }

    if (horizontalScroller) {
      distance.left = horizontalScroller._boundLocation(distance.left + horizontalScroller._location) - horizontalScroller._location;
    }

    this._prepareDirections(true);

    this._startAction();

    this._eventHandler('scrollBy', {
      x: distance.left,
      y: distance.top
    });

    this._endAction();

    this._updateRtlConfig();
  },
  validate: function validate(e) {
    if (isDxMouseWheelEvent(e) && isCommandKeyPressed(e)) {
      return false;
    }

    if (this.option('disabled')) {
      return false;
    }

    if (this.option('bounceEnabled')) {
      return true;
    }

    return isDxMouseWheelEvent(e) ? this._validateWheel(e) : this._validateMove(e);
  },
  _validateWheel: function _validateWheel(e) {
    var scroller = this._scrollers[this._wheelDirection(e)];

    var reachedMin = scroller._reachedMin();

    var reachedMax = scroller._reachedMax();

    var contentGreaterThanContainer = !reachedMin || !reachedMax;
    var locatedNotAtBound = !reachedMin && !reachedMax;
    var scrollFromMin = reachedMin && e.delta > 0;
    var scrollFromMax = reachedMax && e.delta < 0;
    var validated = contentGreaterThanContainer && (locatedNotAtBound || scrollFromMin || scrollFromMax);
    validated = validated || this._validateWheelTimer !== undefined;

    if (validated) {
      clearTimeout(this._validateWheelTimer);
      this._validateWheelTimer = setTimeout(() => {
        this._validateWheelTimer = undefined;
      }, VALIDATE_WHEEL_TIMEOUT);
    }

    return validated;
  },
  _validateMove: function _validateMove(e) {
    if (!this.option('scrollByContent') && !$(e.target).closest(".".concat(SCROLLABLE_SCROLLBAR_CLASS)).length) {
      return false;
    }

    return this._allowedDirection();
  },
  getDirection: function getDirection(e) {
    return isDxMouseWheelEvent(e) ? this._wheelDirection(e) : this._allowedDirection();
  },
  _wheelProp: function _wheelProp() {
    return this._wheelDirection() === HORIZONTAL ? 'left' : 'top';
  },
  _wheelDirection: function _wheelDirection(e) {
    switch (this.option('direction')) {
      case HORIZONTAL:
        return HORIZONTAL;

      case VERTICAL:
        return VERTICAL;

      default:
        return e && e.shiftKey ? HORIZONTAL : VERTICAL;
    }
  },
  dispose: function dispose() {
    this._resetActive();

    if (hoveredScrollable === this) {
      hoveredScrollable = null;
    }

    this._eventHandler('dispose');

    this._detachEventHandlers();

    this._$element.removeClass(SCROLLABLE_SIMULATED_CLASS);

    this._eventForUserAction = null;
    clearTimeout(this._validateWheelTimer);
    clearTimeout(this._updateHandlerTimeout);
  },
  _detachEventHandlers: function _detachEventHandlers() {
    eventsEngine.off(this._$element, ".".concat(SCROLLABLE_SIMULATED_CURSOR));
    eventsEngine.off(this._$container, ".".concat(SCROLLABLE_SIMULATED_KEYBOARD));
  }
});