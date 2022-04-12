"use strict";

exports.default = void 0;

var _size = require("../core/utils/size");

var _renderer = _interopRequireDefault(require("../core/renderer"));

var _events_engine = _interopRequireDefault(require("../events/core/events_engine"));

var _devices = _interopRequireDefault(require("../core/devices"));

var _extend = require("../core/utils/extend");

var _component_registrator = _interopRequireDefault(require("../core/component_registrator"));

var _editor = _interopRequireDefault(require("./editor/editor"));

var _index = require("../events/utils/index");

var _emitter = require("../events/core/emitter.feedback");

var _position = require("../core/utils/position");

var _fx = _interopRequireDefault(require("../animation/fx"));

var _message = _interopRequireDefault(require("../localization/message"));

var _click = require("../events/click");

var _swipeable = _interopRequireDefault(require("../events/gesture/swipeable"));

var _deferred = require("../core/utils/deferred");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// STYLE switch
var SWITCH_CLASS = 'dx-switch';
var SWITCH_WRAPPER_CLASS = SWITCH_CLASS + '-wrapper';
var SWITCH_CONTAINER_CLASS = SWITCH_CLASS + '-container';
var SWITCH_INNER_CLASS = SWITCH_CLASS + '-inner';
var SWITCH_HANDLE_CLASS = SWITCH_CLASS + '-handle';
var SWITCH_ON_VALUE_CLASS = SWITCH_CLASS + '-on-value';
var SWITCH_ON_CLASS = SWITCH_CLASS + '-on';
var SWITCH_OFF_CLASS = SWITCH_CLASS + '-off';
var SWITCH_ANIMATION_DURATION = 100;

var Switch = _editor.default.inherit({
  _supportedKeys: function _supportedKeys() {
    var isRTL = this.option('rtlEnabled');

    var click = function click(e) {
      e.preventDefault();

      this._clickAction({
        event: e
      });
    };

    var move = function move(value, e) {
      e.preventDefault();
      e.stopPropagation();

      this._saveValueChangeEvent(e);

      this._animateValue(value);
    };

    return (0, _extend.extend)(this.callBase(), {
      space: click,
      enter: click,
      leftArrow: move.bind(this, isRTL ? true : false),
      rightArrow: move.bind(this, isRTL ? false : true)
    });
  },
  _useTemplates: function _useTemplates() {
    return false;
  },
  _getDefaultOptions: function _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      hoverStateEnabled: true,
      activeStateEnabled: true,
      switchedOnText: _message.default.format('dxSwitch-switchedOnText'),
      switchedOffText: _message.default.format('dxSwitch-switchedOffText'),
      value: false
    });
  },
  _defaultOptionsRules: function _defaultOptionsRules() {
    return this.callBase().concat([{
      device: function device() {
        return _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator();
      },
      options: {
        focusStateEnabled: true
      }
    }]);
  },
  _feedbackHideTimeout: 0,
  _animating: false,
  _initMarkup: function _initMarkup() {
    this._renderContainers();

    this.$element().addClass(SWITCH_CLASS).append(this._$switchWrapper);

    this._renderSubmitElement();

    this._renderClick();

    this.setAria('role', 'button');

    this._renderSwipeable();

    this.callBase();

    this._renderSwitchInner();

    this._renderLabels();

    this._renderValue();
  },
  _getInnerOffset: function _getInnerOffset(value, offset) {
    var ratio = (offset - this._offsetDirection() * Number(!value)) / 2;
    return 100 * ratio + '%';
  },
  _getHandleOffset: function _getHandleOffset(value, offset) {
    if (this.option('rtlEnabled')) {
      value = !value;
    }

    if (value) {
      var calcValue = -100 + 100 * -offset;
      return calcValue + '%';
    } else {
      return 100 * -offset + '%';
    }
  },
  _renderSwitchInner: function _renderSwitchInner() {
    this._$switchInner = (0, _renderer.default)('<div>').addClass(SWITCH_INNER_CLASS).appendTo(this._$switchContainer);
    this._$handle = (0, _renderer.default)('<div>').addClass(SWITCH_HANDLE_CLASS).appendTo(this._$switchInner);
  },
  _renderLabels: function _renderLabels() {
    this._$labelOn = (0, _renderer.default)('<div>').addClass(SWITCH_ON_CLASS).prependTo(this._$switchInner);
    this._$labelOff = (0, _renderer.default)('<div>').addClass(SWITCH_OFF_CLASS).appendTo(this._$switchInner);

    this._setLabelsText();
  },
  _renderContainers: function _renderContainers() {
    this._$switchContainer = (0, _renderer.default)('<div>').addClass(SWITCH_CONTAINER_CLASS);
    this._$switchWrapper = (0, _renderer.default)('<div>').addClass(SWITCH_WRAPPER_CLASS).append(this._$switchContainer);
  },
  _renderSwipeable: function _renderSwipeable() {
    this._createComponent(this.$element(), _swipeable.default, {
      elastic: false,
      immediate: true,
      onStart: this._swipeStartHandler.bind(this),
      onUpdated: this._swipeUpdateHandler.bind(this),
      onEnd: this._swipeEndHandler.bind(this),
      itemSizeFunc: this._getItemSizeFunc.bind(this)
    });
  },
  _getItemSizeFunc: function _getItemSizeFunc() {
    return (0, _size.getOuterWidth)(this._$switchContainer, true) - (0, _position.getBoundingRect)(this._$handle.get(0)).width;
  },
  _renderSubmitElement: function _renderSubmitElement() {
    this._$submitElement = (0, _renderer.default)('<input>').attr('type', 'hidden').appendTo(this.$element());
  },
  _getSubmitElement: function _getSubmitElement() {
    return this._$submitElement;
  },
  _offsetDirection: function _offsetDirection() {
    return this.option('rtlEnabled') ? -1 : 1;
  },
  _renderPosition: function _renderPosition(state, swipeOffset) {
    var innerOffset = this._getInnerOffset(state, swipeOffset);

    var handleOffset = this._getHandleOffset(state, swipeOffset);

    this._$switchInner.css('transform', ' translateX(' + innerOffset + ')');

    this._$handle.css('transform', ' translateX(' + handleOffset + ')');
  },
  _validateValue: function _validateValue() {
    var check = this.option('value');

    if (typeof check !== 'boolean') {
      this._options.silent('value', !!check);
    }
  },
  _renderClick: function _renderClick() {
    var eventName = (0, _index.addNamespace)(_click.name, this.NAME);
    var $element = this.$element();
    this._clickAction = this._createAction(this._clickHandler.bind(this));

    _events_engine.default.off($element, eventName);

    _events_engine.default.on($element, eventName, function (e) {
      this._clickAction({
        event: e
      });
    }.bind(this));
  },
  _clickHandler: function _clickHandler(args) {
    var e = args.event;

    this._saveValueChangeEvent(e);

    if (this._animating || this._swiping) {
      return;
    }

    this._animateValue(!this.option('value'));
  },
  _animateValue: function _animateValue(value) {
    var startValue = this.option('value');
    var endValue = value;

    if (startValue === endValue) {
      return;
    }

    this._animating = true;

    var fromInnerOffset = this._getInnerOffset(startValue, 0);

    var toInnerOffset = this._getInnerOffset(endValue, 0);

    var fromHandleOffset = this._getHandleOffset(startValue, 0);

    var toHandleOffset = this._getHandleOffset(endValue, 0);

    var that = this;
    var fromInnerConfig = {};
    var toInnerConfig = {};
    var fromHandleConfig = {};
    var toHandlerConfig = {};
    fromInnerConfig['transform'] = ' translateX(' + fromInnerOffset + ')';
    toInnerConfig['transform'] = ' translateX(' + toInnerOffset + ')';
    fromHandleConfig['transform'] = ' translateX(' + fromHandleOffset + ')';
    toHandlerConfig['transform'] = ' translateX(' + toHandleOffset + ')';
    this.$element().toggleClass(SWITCH_ON_VALUE_CLASS, endValue);

    _fx.default.animate(this._$handle, {
      from: fromHandleConfig,
      to: toHandlerConfig,
      duration: SWITCH_ANIMATION_DURATION
    });

    _fx.default.animate(this._$switchInner, {
      from: fromInnerConfig,
      to: toInnerConfig,
      duration: SWITCH_ANIMATION_DURATION,
      complete: function complete() {
        that._animating = false;
        that.option('value', endValue);
      }
    });
  },
  _swipeStartHandler: function _swipeStartHandler(e) {
    var state = this.option('value');
    var rtlEnabled = this.option('rtlEnabled');
    var maxOffOffset = rtlEnabled ? 0 : 1;
    var maxOnOffset = rtlEnabled ? 1 : 0;
    e.event.maxLeftOffset = state ? maxOffOffset : maxOnOffset;
    e.event.maxRightOffset = state ? maxOnOffset : maxOffOffset;
    this._swiping = true;
    this._feedbackDeferred = new _deferred.Deferred();
    (0, _emitter.lock)(this._feedbackDeferred);

    this._toggleActiveState(this.$element(), this.option('activeStateEnabled'));
  },
  _swipeUpdateHandler: function _swipeUpdateHandler(e) {
    this._renderPosition(this.option('value'), e.event.offset);
  },
  _swipeEndHandler: function _swipeEndHandler(e) {
    var that = this;

    var offsetDirection = this._offsetDirection();

    var toInnerConfig = {};
    var toHandleConfig = {};

    var innerOffset = this._getInnerOffset(that.option('value'), e.event.targetOffset);

    var handleOffset = this._getHandleOffset(that.option('value'), e.event.targetOffset);

    toInnerConfig['transform'] = ' translateX(' + innerOffset + ')';
    toHandleConfig['transform'] = ' translateX(' + handleOffset + ')';

    _fx.default.animate(this._$handle, {
      to: toHandleConfig,
      duration: SWITCH_ANIMATION_DURATION
    });

    _fx.default.animate(this._$switchInner, {
      to: toInnerConfig,
      duration: SWITCH_ANIMATION_DURATION,
      complete: function complete() {
        that._swiping = false;
        var pos = that.option('value') + offsetDirection * e.event.targetOffset;

        that._saveValueChangeEvent(e.event);

        that.option('value', Boolean(pos));

        that._feedbackDeferred.resolve();

        that._toggleActiveState(that.$element(), false);
      }
    });
  },
  _renderValue: function _renderValue() {
    this._validateValue();

    var val = this.option('value');

    this._renderPosition(val, 0);

    this.$element().toggleClass(SWITCH_ON_VALUE_CLASS, val);

    this._getSubmitElement().val(val);

    this.setAria({
      'pressed': val,
      'label': val ? this.option('switchedOnText') : this.option('switchedOffText')
    });
  },
  _setLabelsText: function _setLabelsText() {
    this._$labelOn && this._$labelOn.text(this.option('switchedOnText'));
    this._$labelOff && this._$labelOff.text(this.option('switchedOffText'));
  },
  _visibilityChanged: function _visibilityChanged(visible) {
    if (visible) {
      this.repaint();
    }
  },
  _optionChanged: function _optionChanged(args) {
    switch (args.name) {
      case 'width':
        delete this._marginBound;

        this._refresh();

        break;

      case 'switchedOnText':
      case 'switchedOffText':
        this._setLabelsText();

        break;

      case 'value':
        this._renderValue();

        this.callBase(args);
        break;

      default:
        this.callBase(args);
    }
  }
});

(0, _component_registrator.default)('dxSwitch', Switch);
var _default = Switch;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;