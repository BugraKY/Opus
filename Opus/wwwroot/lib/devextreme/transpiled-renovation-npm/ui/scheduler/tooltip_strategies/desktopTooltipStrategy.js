"use strict";

exports.DesktopTooltipStrategy = void 0;

var _tooltipStrategyBase = require("./tooltipStrategyBase");

var _tooltip = _interopRequireDefault(require("../../tooltip"));

var _support = require("../../../core/utils/support");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var APPOINTMENT_TOOLTIP_WRAPPER_CLASS = 'dx-scheduler-appointment-tooltip-wrapper';
var MAX_TOOLTIP_HEIGHT = 200;

var DesktopTooltipStrategy = /*#__PURE__*/function (_TooltipStrategyBase) {
  _inheritsLoose(DesktopTooltipStrategy, _TooltipStrategyBase);

  function DesktopTooltipStrategy() {
    return _TooltipStrategyBase.apply(this, arguments) || this;
  }

  var _proto = DesktopTooltipStrategy.prototype;

  _proto._prepareBeforeVisibleChanged = function _prepareBeforeVisibleChanged(dataList) {
    this._tooltip.option('position', {
      my: 'bottom',
      at: 'top',
      boundary: this._getBoundary(dataList),
      offset: this._extraOptions.offset,
      collision: 'fit flipfit'
    });
  };

  _proto._getBoundary = function _getBoundary(dataList) {
    return this._options.isAppointmentInAllDayPanel(dataList[0].appointment) ? this._options.container : this._options.getScrollableContainer();
  };

  _proto._onShown = function _onShown() {
    _TooltipStrategyBase.prototype._onShown.call(this);

    if (this._extraOptions.isButtonClick) {
      this._list.focus();

      this._list.option('focusedElement', null);
    }
  };

  _proto._createListOption = function _createListOption(target, dataList) {
    var result = _TooltipStrategyBase.prototype._createListOption.call(this, target, dataList); // TODO:T724287 this condition is not covered by tests, because touch variable cannot be overridden.
    // In the future, it is necessary to cover the tests


    result.showScrollbar = _support.touch ? 'always' : 'onHover';
    return result;
  };

  _proto._createTooltip = function _createTooltip(target, dataList) {
    var tooltip = this._createTooltipElement(APPOINTMENT_TOOLTIP_WRAPPER_CLASS);

    return this._options.createComponent(tooltip, _tooltip.default, {
      target: target,
      maxHeight: MAX_TOOLTIP_HEIGHT,
      rtlEnabled: this._extraOptions.rtlEnabled,
      onShown: this._onShown.bind(this),
      contentTemplate: this._getContentTemplate(dataList),
      copyRootClassesToWrapper: true,
      _ignoreCopyRootClassesToWrapperDeprecation: true
    });
  };

  _proto._onListRender = function _onListRender(e) {
    return this._extraOptions.dragBehavior && this._extraOptions.dragBehavior(e);
  };

  return DesktopTooltipStrategy;
}(_tooltipStrategyBase.TooltipStrategyBase);

exports.DesktopTooltipStrategy = DesktopTooltipStrategy;