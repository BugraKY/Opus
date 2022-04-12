"use strict";

exports.default = void 0;

var _size = require("../../core/utils/size");

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));

var _support = require("../../core/utils/support");

var _browser = _interopRequireDefault(require("../../core/utils/browser"));

var _common = require("../../core/utils/common");

var _type = require("../../core/utils/type");

var _extend = require("../../core/utils/extend");

var _element = require("../../core/element");

var _window = require("../../core/utils/window");

var _devices = _interopRequireDefault(require("../../core/devices"));

var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));

var _dom_component = _interopRequireDefault(require("../../core/dom_component"));

var _index = require("../../events/utils/index");

var _emitterGesture = _interopRequireDefault(require("../../events/gesture/emitter.gesture.scroll"));

var _uiScrollable = require("./ui.scrollable.simulated");

var _uiScrollable2 = _interopRequireDefault(require("./ui.scrollable.native"));

var _uiScrollable3 = require("./ui.scrollable.device");

var _deferred = require("../../core/utils/deferred");

var _get_element_location_internal = require("../../renovation/ui/scroll_view/utils/get_element_location_internal");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SCROLLABLE = 'dxScrollable';
var SCROLLABLE_STRATEGY = 'dxScrollableStrategy';
var SCROLLABLE_CLASS = 'dx-scrollable';
var SCROLLABLE_DISABLED_CLASS = 'dx-scrollable-disabled';
var SCROLLABLE_CONTAINER_CLASS = 'dx-scrollable-container';
var SCROLLABLE_WRAPPER_CLASS = 'dx-scrollable-wrapper';
var SCROLLABLE_CONTENT_CLASS = 'dx-scrollable-content';
var VERTICAL = 'vertical';
var HORIZONTAL = 'horizontal';
var BOTH = 'both';

var Scrollable = _dom_component.default.inherit({
  _getDefaultOptions: function _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      disabled: false,
      onScroll: null,
      direction: VERTICAL,
      showScrollbar: 'onScroll',
      useNative: true,
      bounceEnabled: true,
      scrollByContent: true,
      scrollByThumb: false,
      onUpdated: null,
      onStart: null,
      onEnd: null,
      onBounce: null,
      useSimulatedScrollbar: false,
      useKeyboard: true,
      inertiaEnabled: true,
      updateManually: false
    });
  },
  _defaultOptionsRules: function _defaultOptionsRules() {
    return this.callBase().concat((0, _uiScrollable3.deviceDependentOptions)(), [{
      device: function device() {
        return _support.nativeScrolling && _devices.default.real().platform === 'android' && !_browser.default.mozilla;
      },
      options: {
        useSimulatedScrollbar: true
      }
    }]);
  },
  _initOptions: function _initOptions(options) {
    this.callBase(options);

    if (!('useSimulatedScrollbar' in options)) {
      this._setUseSimulatedScrollbar();
    }
  },
  _setUseSimulatedScrollbar: function _setUseSimulatedScrollbar() {
    if (!this.initialOption('useSimulatedScrollbar')) {
      this.option('useSimulatedScrollbar', !this.option('useNative'));
    }
  },
  _init: function _init() {
    this.callBase();

    this._initScrollableMarkup();

    this._locked = false;
  },
  _visibilityChanged: function _visibilityChanged(visible) {
    if (visible) {
      this.update();

      this._updateRtlPosition();

      this._savedScrollOffset && this.scrollTo(this._savedScrollOffset);
      delete this._savedScrollOffset;
    } else {
      this._savedScrollOffset = this.scrollOffset();
    }
  },
  _initScrollableMarkup: function _initScrollableMarkup() {
    var $element = this.$element().addClass(SCROLLABLE_CLASS);
    var $container = this._$container = (0, _renderer.default)('<div>').addClass(SCROLLABLE_CONTAINER_CLASS);
    var $wrapper = this._$wrapper = (0, _renderer.default)('<div>').addClass(SCROLLABLE_WRAPPER_CLASS);
    var $content = this._$content = (0, _renderer.default)('<div>').addClass(SCROLLABLE_CONTENT_CLASS);
    $content.append($element.contents()).appendTo($container);
    $container.appendTo($wrapper);
    $wrapper.appendTo($element);
  },
  _dimensionChanged: function _dimensionChanged() {
    this.update();

    this._updateRtlPosition();
  },
  _initMarkup: function _initMarkup() {
    this.callBase();

    this._renderDirection();
  },
  _render: function _render() {
    this._renderStrategy();

    this._attachEventHandlers();

    this._renderDisabledState();

    this._createActions();

    this.update();
    this.callBase();

    this._updateRtlPosition(true);
  },
  _updateRtlPosition: function _updateRtlPosition(needInitializeRtlConfig) {
    this._strategy.updateRtlPosition(needInitializeRtlConfig);
  },
  _getMaxOffset: function _getMaxOffset() {
    var _$$get = (0, _renderer.default)(this.container()).get(0),
        scrollWidth = _$$get.scrollWidth,
        clientWidth = _$$get.clientWidth,
        scrollHeight = _$$get.scrollHeight,
        clientHeight = _$$get.clientHeight;

    return {
      left: scrollWidth - clientWidth,
      top: scrollHeight - clientHeight
    };
  },
  _attachEventHandlers: function _attachEventHandlers() {
    var strategy = this._strategy;
    var initEventData = {
      getDirection: strategy.getDirection.bind(strategy),
      validate: this._validate.bind(this),
      isNative: this.option('useNative'),
      scrollTarget: this._$container
    };

    _events_engine.default.off(this._$wrapper, '.' + SCROLLABLE);

    _events_engine.default.on(this._$wrapper, (0, _index.addNamespace)(_emitterGesture.default.init, SCROLLABLE), initEventData, this._initHandler.bind(this));

    _events_engine.default.on(this._$wrapper, (0, _index.addNamespace)(_emitterGesture.default.start, SCROLLABLE), strategy.handleStart.bind(strategy));

    _events_engine.default.on(this._$wrapper, (0, _index.addNamespace)(_emitterGesture.default.move, SCROLLABLE), strategy.handleMove.bind(strategy));

    _events_engine.default.on(this._$wrapper, (0, _index.addNamespace)(_emitterGesture.default.end, SCROLLABLE), strategy.handleEnd.bind(strategy));

    _events_engine.default.on(this._$wrapper, (0, _index.addNamespace)(_emitterGesture.default.cancel, SCROLLABLE), strategy.handleCancel.bind(strategy));

    _events_engine.default.on(this._$wrapper, (0, _index.addNamespace)(_emitterGesture.default.stop, SCROLLABLE), strategy.handleStop.bind(strategy));

    _events_engine.default.off(this._$container, '.' + SCROLLABLE);

    _events_engine.default.on(this._$container, (0, _index.addNamespace)('scroll', SCROLLABLE), strategy.handleScroll.bind(strategy));
  },
  _validate: function _validate(e) {
    if (this._isLocked()) {
      return false;
    }

    this._updateIfNeed();

    return this._moveIsAllowed(e);
  },
  _moveIsAllowed: function _moveIsAllowed(e) {
    return this._strategy.validate(e);
  },
  handleMove: function handleMove(e) {
    this._strategy.handleMove(e);
  },
  _prepareDirections: function _prepareDirections(value) {
    this._strategy._prepareDirections(value);
  },
  _initHandler: function _initHandler() {
    var strategy = this._strategy;
    strategy.handleInit.apply(strategy, arguments);
  },
  _renderDisabledState: function _renderDisabledState() {
    this.$element().toggleClass(SCROLLABLE_DISABLED_CLASS, this.option('disabled'));

    if (this.option('disabled')) {
      this._lock();
    } else {
      this._unlock();
    }
  },
  _renderDirection: function _renderDirection() {
    this.$element().removeClass('dx-scrollable-' + HORIZONTAL).removeClass('dx-scrollable-' + VERTICAL).removeClass('dx-scrollable-' + BOTH).addClass('dx-scrollable-' + this.option('direction'));
  },
  _renderStrategy: function _renderStrategy() {
    this._createStrategy();

    this._strategy.render();

    this.$element().data(SCROLLABLE_STRATEGY, this._strategy);
  },
  _createStrategy: function _createStrategy() {
    this._strategy = this.option('useNative') ? new _uiScrollable2.default(this) : new _uiScrollable.SimulatedStrategy(this);
  },
  _createActions: function _createActions() {
    this._strategy && this._strategy.createActions();
  },
  _clean: function _clean() {
    this._strategy && this._strategy.dispose();
  },
  _optionChanged: function _optionChanged(args) {
    switch (args.name) {
      case 'onStart':
      case 'onEnd':
      case 'onUpdated':
      case 'onScroll':
      case 'onBounce':
        this._createActions();

        break;

      case 'direction':
        this._resetInactiveDirection();

        this._invalidate();

        break;

      case 'useNative':
        this._setUseSimulatedScrollbar();

        this._invalidate();

        break;

      case 'inertiaEnabled':
      case 'scrollByThumb':
      case 'bounceEnabled':
      case 'useKeyboard':
      case 'showScrollbar':
      case 'useSimulatedScrollbar':
        this._invalidate();

        break;

      case 'disabled':
        this._renderDisabledState();

        this._strategy && this._strategy.disabledChanged();
        break;

      case 'updateManually':
      case 'scrollByContent':
        break;

      case 'width':
        this.callBase(args);

        this._updateRtlPosition();

        break;

      default:
        this.callBase(args);
    }
  },
  _resetInactiveDirection: function _resetInactiveDirection() {
    var inactiveProp = this._getInactiveProp();

    if (!inactiveProp || !(0, _window.hasWindow)()) {
      return;
    }

    var scrollOffset = this.scrollOffset();
    scrollOffset[inactiveProp] = 0;
    this.scrollTo(scrollOffset);
  },
  _getInactiveProp: function _getInactiveProp() {
    var direction = this.option('direction');

    if (direction === VERTICAL) {
      return 'left';
    }

    if (direction === HORIZONTAL) {
      return 'top';
    }
  },
  _location: function _location() {
    return this._strategy.location();
  },
  _normalizeLocation: function _normalizeLocation(location) {
    if ((0, _type.isPlainObject)(location)) {
      var left = (0, _common.ensureDefined)(location.left, location.x);
      var top = (0, _common.ensureDefined)(location.top, location.y);
      return {
        left: (0, _type.isDefined)(left) ? -left : undefined,
        top: (0, _type.isDefined)(top) ? -top : undefined
      };
    } else {
      var direction = this.option('direction');
      return {
        left: direction !== VERTICAL ? -location : undefined,
        top: direction !== HORIZONTAL ? -location : undefined
      };
    }
  },
  _isLocked: function _isLocked() {
    return this._locked;
  },
  _lock: function _lock() {
    this._locked = true;
  },
  _unlock: function _unlock() {
    if (!this.option('disabled')) {
      this._locked = false;
    }
  },
  _isDirection: function _isDirection(direction) {
    var current = this.option('direction');

    if (direction === VERTICAL) {
      return current !== HORIZONTAL;
    }

    if (direction === HORIZONTAL) {
      return current !== VERTICAL;
    }

    return current === direction;
  },
  _updateAllowedDirection: function _updateAllowedDirection() {
    var allowedDirections = this._strategy._allowedDirections();

    if (this._isDirection(BOTH) && allowedDirections.vertical && allowedDirections.horizontal) {
      this._allowedDirectionValue = BOTH;
    } else if (this._isDirection(HORIZONTAL) && allowedDirections.horizontal) {
      this._allowedDirectionValue = HORIZONTAL;
    } else if (this._isDirection(VERTICAL) && allowedDirections.vertical) {
      this._allowedDirectionValue = VERTICAL;
    } else {
      this._allowedDirectionValue = null;
    }
  },
  _allowedDirection: function _allowedDirection() {
    return this._allowedDirectionValue;
  },
  $content: function $content() {
    return this._$content;
  },
  content: function content() {
    return (0, _element.getPublicElement)(this._$content);
  },
  container: function container() {
    return (0, _element.getPublicElement)(this._$container);
  },
  scrollOffset: function scrollOffset() {
    return this._strategy._getScrollOffset();
  },
  _isRtlNativeStrategy: function _isRtlNativeStrategy() {
    var _this$option = this.option(),
        useNative = _this$option.useNative,
        rtlEnabled = _this$option.rtlEnabled;

    return useNative && rtlEnabled;
  },
  scrollTop: function scrollTop() {
    return this.scrollOffset().top;
  },
  scrollLeft: function scrollLeft() {
    return this.scrollOffset().left;
  },
  clientHeight: function clientHeight() {
    return (0, _size.getHeight)(this._$container);
  },
  scrollHeight: function scrollHeight() {
    return (0, _size.getOuterHeight)(this.$content());
  },
  clientWidth: function clientWidth() {
    return (0, _size.getWidth)(this._$container);
  },
  scrollWidth: function scrollWidth() {
    return (0, _size.getOuterWidth)(this.$content());
  },
  update: function update() {
    if (!this._strategy) {
      return;
    }

    return (0, _deferred.when)(this._strategy.update()).done(function () {
      this._updateAllowedDirection();
    }.bind(this));
  },
  scrollBy: function scrollBy(distance) {
    distance = this._normalizeLocation(distance);

    if (!distance.top && !distance.left) {
      return;
    }

    this._updateIfNeed();

    this._strategy.scrollBy(distance);
  },
  scrollTo: function scrollTo(targetLocation) {
    targetLocation = this._normalizeLocation(targetLocation);

    this._updateIfNeed();

    var location = this._location();

    if (!this.option('useNative')) {
      targetLocation = this._strategy._applyScaleRatio(targetLocation);
      location = this._strategy._applyScaleRatio(location);
    }

    if (this._isRtlNativeStrategy()) {
      location.left = location.left - this._getMaxOffset().left;
    }

    var distance = this._normalizeLocation({
      left: location.left - (0, _common.ensureDefined)(targetLocation.left, location.left),
      top: location.top - (0, _common.ensureDefined)(targetLocation.top, location.top)
    });

    if (!distance.top && !distance.left) {
      return;
    }

    this._strategy.scrollBy(distance);
  },
  scrollToElement: function scrollToElement(element, offset) {
    var $element = (0, _renderer.default)(element);
    var elementInsideContent = this.$content().find(element).length;
    var elementIsInsideContent = $element.parents('.' + SCROLLABLE_CLASS).length - $element.parents('.' + SCROLLABLE_CONTENT_CLASS).length === 0;

    if (!elementInsideContent || !elementIsInsideContent) {
      return;
    }

    var scrollPosition = {
      top: 0,
      left: 0
    };
    var direction = this.option('direction');

    if (direction !== VERTICAL) {
      scrollPosition.left = this.getScrollElementPosition($element, HORIZONTAL, offset);
    }

    if (direction !== HORIZONTAL) {
      scrollPosition.top = this.getScrollElementPosition($element, VERTICAL, offset);
    }

    this.scrollTo(scrollPosition);
  },
  getScrollElementPosition: function getScrollElementPosition($element, direction, offset) {
    var scrollOffset = this.scrollOffset();
    return (0, _get_element_location_internal.getElementLocationInternal)($element.get(0), direction, (0, _renderer.default)(this.container()).get(0), scrollOffset, offset);
  },
  _updateIfNeed: function _updateIfNeed() {
    if (!this.option('updateManually')) {
      this.update();
    }
  },
  _useTemplates: function _useTemplates() {
    return false;
  },
  isRenovated: function isRenovated() {
    return !!Scrollable.IS_RENOVATED_WIDGET;
  }
});

(0, _component_registrator.default)(SCROLLABLE, Scrollable);
var _default = Scrollable;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;