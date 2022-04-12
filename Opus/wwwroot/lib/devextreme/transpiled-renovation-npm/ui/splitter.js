"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../core/renderer"));

var _ui = _interopRequireDefault(require("./widget/ui.widget"));

var _dom_adapter = _interopRequireDefault(require("../core/dom_adapter"));

var _events_engine = _interopRequireDefault(require("../events/core/events_engine"));

var _pointer = _interopRequireDefault(require("../events/pointer"));

var _window = require("../core/utils/window");

var _index = require("../events/utils/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var window = (0, _window.getWindow)();
var SPLITTER_CLASS = 'dx-splitter';
var SPLITTER_WRAPPER_CLASS = "".concat(SPLITTER_CLASS, "-wrapper");
var SPLITTER_INACTIVE_CLASS = "".concat(SPLITTER_CLASS, "-inactive");
var SPLITTER_BORDER_CLASS = "".concat(SPLITTER_CLASS, "-border");
var SPLITTER_INITIAL_STATE_CLASS = "".concat(SPLITTER_CLASS, "-initial");
var STATE_DISABLED_CLASS = 'dx-state-disabled';
var SPLITTER_MODULE_NAMESPACE = 'dxSplitterResizing';
var SPLITTER_POINTER_DOWN_EVENT_NAME = (0, _index.addNamespace)(_pointer.default.down, SPLITTER_MODULE_NAMESPACE);
var SPLITTER_POINTER_MOVE_EVENT_NAME = (0, _index.addNamespace)(_pointer.default.move, SPLITTER_MODULE_NAMESPACE);
var SPLITTER_POINTER_UP_EVENT_NAME = (0, _index.addNamespace)(_pointer.default.up, SPLITTER_MODULE_NAMESPACE);

var SplitterControl = /*#__PURE__*/function (_Widget) {
  _inheritsLoose(SplitterControl, _Widget);

  function SplitterControl() {
    return _Widget.apply(this, arguments) || this;
  }

  var _proto = SplitterControl.prototype;

  _proto._initMarkup = function _initMarkup() {
    _Widget.prototype._initMarkup.call(this);

    this._initActions();

    this._$container = this.option('container');
    this._$leftElement = this.option('leftElement');
    this._$rightElement = this.option('rightElement');
    this.$element().addClass(SPLITTER_WRAPPER_CLASS).addClass(SPLITTER_INITIAL_STATE_CLASS);
    this._$splitterBorder = (0, _renderer.default)('<div>').addClass(SPLITTER_BORDER_CLASS).appendTo(this.$element());
    this._$splitter = (0, _renderer.default)('<div>').addClass(SPLITTER_CLASS).addClass(SPLITTER_INACTIVE_CLASS).appendTo(this._$splitterBorder);
  };

  _proto._initActions = function _initActions() {
    this._actions = {
      onApplyPanelSize: this._createActionByOption('onApplyPanelSize'),
      onActiveStateChanged: this._createActionByOption('onActiveStateChanged')
    };
  };

  _proto._render = function _render() {
    _Widget.prototype._render.call(this);

    this._detachEventHandlers();

    this._attachEventHandlers();
  };

  _proto._clean = function _clean() {
    this._detachEventHandlers();

    _Widget.prototype._clean.call(this);
  };

  _proto._attachEventHandlers = function _attachEventHandlers() {
    var document = _dom_adapter.default.getDocument();

    _events_engine.default.on(this._$splitterBorder, SPLITTER_POINTER_DOWN_EVENT_NAME, this._onMouseDownHandler.bind(this));

    _events_engine.default.on(document, SPLITTER_POINTER_MOVE_EVENT_NAME, this._onMouseMoveHandler.bind(this));

    _events_engine.default.on(document, SPLITTER_POINTER_UP_EVENT_NAME, this._onMouseUpHandler.bind(this));
  };

  _proto._detachEventHandlers = function _detachEventHandlers() {
    var document = _dom_adapter.default.getDocument();

    _events_engine.default.off(this._$splitterBorder, SPLITTER_POINTER_DOWN_EVENT_NAME);

    _events_engine.default.off(document, SPLITTER_POINTER_MOVE_EVENT_NAME);

    _events_engine.default.off(document, SPLITTER_POINTER_UP_EVENT_NAME);
  };

  _proto._dimensionChanged = function _dimensionChanged(dimension) {
    if (!dimension || dimension !== 'height') {
      this._containerWidth = this._$container.get(0).clientWidth;

      this._setSplitterPositionLeft({
        needUpdatePanels: true,
        usePercentagePanelsWidth: true
      });
    }
  };

  _proto._onMouseDownHandler = function _onMouseDownHandler(e) {
    e.preventDefault();
    this._offsetX = e.pageX - this._$splitterBorder.offset().left <= this._getSplitterBorderWidth() ? e.pageX - this._$splitterBorder.offset().left : 0;
    this._containerWidth = this._$container.get(0).clientWidth;
    this.$element().removeClass(SPLITTER_INITIAL_STATE_CLASS);

    this._toggleActive(true);

    this._setSplitterPositionLeft({
      needUpdatePanels: true
    });
  };

  _proto._onMouseMoveHandler = function _onMouseMoveHandler(e) {
    if (!this._isSplitterActive) {
      return;
    }

    this._setSplitterPositionLeft({
      splitterPositionLeft: this._getNewSplitterPositionLeft(e),
      needUpdatePanels: true
    });
  };

  _proto._onMouseUpHandler = function _onMouseUpHandler() {
    if (!this._isSplitterActive) {
      return;
    }

    this._leftPanelPercentageWidth = null;

    this._toggleActive(false);

    this._setSplitterPositionLeft({
      needUpdatePanels: true,
      usePercentagePanelsWidth: true
    });
  };

  _proto._getNewSplitterPositionLeft = function _getNewSplitterPositionLeft(e) {
    var newSplitterPositionLeft = e.pageX - this._getContainerLeftOffset() - this._offsetX;

    newSplitterPositionLeft = Math.max(0 - this._getSplitterOffset(), newSplitterPositionLeft);
    newSplitterPositionLeft = Math.min(this._containerWidth - this._getSplitterOffset() - this._getSplitterWidth(), newSplitterPositionLeft);
    return newSplitterPositionLeft;
  };

  _proto._getContainerLeftOffset = function _getContainerLeftOffset() {
    var offsetLeft = this._$container.offset().left;

    if (window) {
      var style = window.getComputedStyle(this._$container.get(0));
      var paddingLeft = parseFloat(style['paddingLeft']) || 0;
      var borderLeft = parseFloat(style['borderLeftWidth']) || 0;
      offsetLeft += paddingLeft + borderLeft;
    }

    return offsetLeft;
  };

  _proto._getSplitterOffset = function _getSplitterOffset() {
    return (this._getSplitterBorderWidth() - this._getSplitterWidth()) / 2;
  };

  _proto._getSplitterWidth = function _getSplitterWidth() {
    return this._$splitter.get(0).clientWidth;
  };

  _proto._getSplitterBorderWidth = function _getSplitterBorderWidth() {
    return this._$splitterBorder.get(0).clientWidth;
  };

  _proto._getLeftPanelWidth = function _getLeftPanelWidth() {
    return this._$leftElement.get(0).clientWidth;
  };

  _proto.getSplitterBorderElement = function getSplitterBorderElement() {
    return this._$splitterBorder;
  };

  _proto._toggleActive = function _toggleActive(isActive) {
    this.$element().toggleClass(SPLITTER_INACTIVE_CLASS, !isActive);

    this._$splitter.toggleClass(SPLITTER_INACTIVE_CLASS, !isActive);

    this._isSplitterActive = isActive;

    this._actions.onActiveStateChanged({
      isActive: isActive
    });
  };

  _proto.toggleDisabled = function toggleDisabled(isDisabled) {
    this.$element().toggleClass(STATE_DISABLED_CLASS, isDisabled);

    this._$splitter.toggleClass(STATE_DISABLED_CLASS, isDisabled);
  };

  _proto.isSplitterMoved = function isSplitterMoved() {
    return !this.$element().hasClass(SPLITTER_INITIAL_STATE_CLASS);
  };

  _proto.disableSplitterCalculation = function disableSplitterCalculation(value) {
    this._isSplitterCalculationDisabled = value;
  };

  _proto._setSplitterPositionLeft = function _setSplitterPositionLeft() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$splitterPosition = _ref.splitterPositionLeft,
        splitterPositionLeft = _ref$splitterPosition === void 0 ? null : _ref$splitterPosition,
        _ref$needUpdatePanels = _ref.needUpdatePanels,
        needUpdatePanels = _ref$needUpdatePanels === void 0 ? false : _ref$needUpdatePanels,
        _ref$usePercentagePan = _ref.usePercentagePanelsWidth,
        usePercentagePanelsWidth = _ref$usePercentagePan === void 0 ? false : _ref$usePercentagePan;

    splitterPositionLeft = splitterPositionLeft || this._getLeftPanelWidth() - this._getSplitterOffset();

    var leftPanelWidth = splitterPositionLeft + this._getSplitterOffset();

    var rightPanelWidth = this._containerWidth - leftPanelWidth;

    if (!this._isSplitterCalculationDisabled) {
      this.$element().css('left', splitterPositionLeft);
    }

    this._leftPanelPercentageWidth = this._leftPanelPercentageWidth || this._convertToPercentage(leftPanelWidth);

    var rightPanelPercentageWidth = this._convertToPercentage(this._containerWidth - this._convertToPixels(this._leftPanelPercentageWidth));

    if (!needUpdatePanels) {
      return;
    }

    this._actions.onApplyPanelSize({
      leftPanelWidth: usePercentagePanelsWidth ? "".concat(this._leftPanelPercentageWidth, "%") : leftPanelWidth,
      rightPanelWidth: usePercentagePanelsWidth ? "".concat(rightPanelPercentageWidth, "%") : rightPanelWidth
    });
  };

  _proto._optionChanged = function _optionChanged(args) {
    switch (args.name) {
      case 'initialLeftPanelWidth':
        this._leftPanelPercentageWidth = this._convertToPercentage(args.value);

        this._dimensionChanged();

        break;

      case 'leftElement':
        this.repaint();
        break;

      case 'onActiveStateChanged':
      case 'onApplyPanelSize':
        this._actions[args.name] = this._createActionByOption(args.name);
        break;

      default:
        _Widget.prototype._optionChanged.call(this, args);

    }
  };

  _proto._convertToPercentage = function _convertToPercentage(pixelWidth) {
    return pixelWidth / this._$container.get(0).clientWidth * 100;
  };

  _proto._convertToPixels = function _convertToPixels(percentageWidth) {
    return percentageWidth / 100 * this._$container.get(0).clientWidth;
  };

  return SplitterControl;
}(_ui.default);

exports.default = SplitterControl;
module.exports = exports.default;
module.exports.default = exports.default;