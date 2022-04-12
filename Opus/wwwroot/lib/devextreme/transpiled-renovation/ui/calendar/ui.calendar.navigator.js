"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _extend = require("../../core/utils/extend");

var _ui = _interopRequireDefault(require("../widget/ui.widget"));

var _button = _interopRequireDefault(require("../button"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CALENDAR_NAVIGATOR_CLASS = 'dx-calendar-navigator';
var CALENDAR_NAVIGATOR_PREVIOUS_MONTH_CLASS = 'dx-calendar-navigator-previous-month';
var CALENDAR_NAVIGATOR_NEXT_MONTH_CLASS = 'dx-calendar-navigator-next-month';
var CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS = 'dx-calendar-navigator-previous-view';
var CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS = 'dx-calendar-navigator-next-view';
var CALENDAR_NAVIGATOR_DISABLED_LINK_CLASS = 'dx-calendar-disabled-navigator-link';
var CALENDAR_NAVIGATOR_CAPTION_BUTTON_CLASS = 'dx-calendar-caption-button';

var Navigator = _ui.default.inherit({
  _getDefaultOptions: function _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      onClick: null,
      onCaptionClick: null,
      text: ''
    });
  },
  _init: function _init() {
    this.callBase();

    this._initActions();
  },
  _initActions: function _initActions() {
    this._clickAction = this._createActionByOption('onClick');
    this._captionClickAction = this._createActionByOption('onCaptionClick');
  },
  _initMarkup: function _initMarkup() {
    this.callBase();
    this.$element().addClass(CALENDAR_NAVIGATOR_CLASS);

    this._renderButtons();

    this._renderCaption();
  },
  _renderButtons: function _renderButtons() {
    var that = this;
    var direction = this.option('rtlEnabled') ? -1 : 1;
    this._prevButton = this._createComponent((0, _renderer.default)('<a>'), _button.default, {
      focusStateEnabled: false,
      icon: 'chevronleft',
      onClick: function onClick(e) {
        that._clickAction({
          direction: -direction,
          event: e
        });
      },
      integrationOptions: {}
    });

    var $prevButton = this._prevButton.$element().addClass(CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS).addClass(CALENDAR_NAVIGATOR_PREVIOUS_MONTH_CLASS);

    this._nextButton = this._createComponent((0, _renderer.default)('<a>'), _button.default, {
      focusStateEnabled: false,
      icon: 'chevronright',
      onClick: function onClick(e) {
        that._clickAction({
          direction: direction,
          event: e
        });
      },
      integrationOptions: {}
    });

    var $nextButton = this._nextButton.$element().addClass(CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS).addClass(CALENDAR_NAVIGATOR_NEXT_MONTH_CLASS);

    this._caption = this._createComponent((0, _renderer.default)('<a>').addClass(CALENDAR_NAVIGATOR_CAPTION_BUTTON_CLASS), _button.default, {
      focusStateEnabled: false,
      onClick: function onClick(e) {
        that._captionClickAction({
          event: e
        });
      },
      integrationOptions: {}
    });

    var $caption = this._caption.$element();

    this.$element().append($prevButton, $caption, $nextButton);
  },
  _renderCaption: function _renderCaption() {
    this._caption.option('text', this.option('text'));
  },
  toggleButton: function toggleButton(buttonPrefix, value) {
    var buttonName = '_' + buttonPrefix + 'Button';
    var button = this[buttonName];

    if (button) {
      button.option('disabled', value);
      button.$element().toggleClass(CALENDAR_NAVIGATOR_DISABLED_LINK_CLASS, value);
    }
  },
  _optionChanged: function _optionChanged(args) {
    switch (args.name) {
      case 'text':
        this._renderCaption();

        break;

      default:
        this.callBase(args);
    }
  }
});

var _default = Navigator;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;