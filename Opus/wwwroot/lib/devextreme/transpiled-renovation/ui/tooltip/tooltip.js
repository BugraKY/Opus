"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _guid = _interopRequireDefault(require("../../core/guid"));

var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));

var _extend = require("../../core/utils/extend");

var _popover = _interopRequireDefault(require("../popover"));

var _type = require("../../core/utils/type");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TOOLTIP_CLASS = 'dx-tooltip';
var TOOLTIP_WRAPPER_CLASS = 'dx-tooltip-wrapper';

// STYLE tooltip
var Tooltip = _popover.default.inherit({
  _getDefaultOptions: function _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      /**
      * @name dxTooltipOptions.toolbarItems
      * @hidden
      */
      toolbarItems: [],

      /**
      * @name dxTooltipOptions.showCloseButton
      * @hidden
      */
      showCloseButton: false,

      /**
      * @name dxTooltipOptions.showTitle
      * @hidden
      */
      showTitle: false,

      /**
      * @name dxTooltipOptions.title
      * @hidden
      */
      title: null,

      /**
      * @name dxTooltipOptions.titleTemplate
      * @hidden
      */
      titleTemplate: null,

      /**
      * @name dxTooltipOptions.onTitleRendered
      * @hidden
      * @action
      */
      onTitleRendered: null,
      bottomTemplate: null,
      propagateOutsideClick: true
    });
  },
  _render: function _render() {
    this.$element().addClass(TOOLTIP_CLASS);
    this.$wrapper().addClass(TOOLTIP_WRAPPER_CLASS);
    this.callBase();
  },
  _renderContent: function _renderContent() {
    this.callBase();
    this._contentId = 'dx-' + new _guid.default();
    this.$overlayContent().attr({
      'id': this._contentId,
      'role': 'tooltip'
    });

    this._toggleAriaDescription(true);
  },
  _toggleAriaDescription: function _toggleAriaDescription(showing) {
    var $target = (0, _renderer.default)(this.option('target'));
    var label = showing ? this._contentId : undefined;

    if (!(0, _type.isWindow)($target.get(0))) {
      this.setAria('describedby', label, $target);
    }
  }
});

(0, _component_registrator.default)('dxTooltip', Tooltip);
var _default = Tooltip;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;