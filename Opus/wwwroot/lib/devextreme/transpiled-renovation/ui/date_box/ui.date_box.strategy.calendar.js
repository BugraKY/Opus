"use strict";

exports.default = void 0;

var _calendar = _interopRequireDefault(require("../calendar"));

var _uiDate_box = _interopRequireDefault(require("./ui.date_box.strategy"));

var _date = _interopRequireDefault(require("../../core/utils/date"));

var _common = require("../../core/utils/common");

var _type = require("../../core/utils/type");

var _extend = require("../../core/utils/extend");

var _message = _interopRequireDefault(require("../../localization/message"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CalendarStrategy = _uiDate_box.default.inherit({
  NAME: 'Calendar',
  supportedKeys: function supportedKeys() {
    var homeEndHandler = function homeEndHandler(e) {
      if (this.option('opened')) {
        e.preventDefault();
        return true;
      }

      return false;
    };

    return {
      rightArrow: function rightArrow() {
        if (this.option('opened')) {
          return true;
        }
      },
      leftArrow: function leftArrow() {
        if (this.option('opened')) {
          return true;
        }
      },
      enter: function (e) {
        if (this.dateBox.option('opened')) {
          e.preventDefault();

          if (this._widget.option('zoomLevel') === this._widget.option('maxZoomLevel')) {
            var viewValue = this._getContouredValue();

            var lastActionElement = this._lastActionElement;

            var shouldCloseDropDown = this._closeDropDownByEnter();

            if (shouldCloseDropDown && viewValue && lastActionElement === 'calendar') {
              this.dateBoxValue(viewValue, e);
            }

            shouldCloseDropDown && this.dateBox.close();

            this.dateBox._valueChangeEventHandler(e);

            return !shouldCloseDropDown;
          } else {
            return true;
          }
        } else {
          this.dateBox._valueChangeEventHandler(e);
        }
      }.bind(this),
      home: homeEndHandler,
      end: homeEndHandler
    };
  },
  getDisplayFormat: function getDisplayFormat(displayFormat) {
    return displayFormat || 'shortdate';
  },
  _closeDropDownByEnter: function _closeDropDownByEnter() {
    return true;
  },
  _getWidgetName: function _getWidgetName() {
    return _calendar.default;
  },
  _getContouredValue: function _getContouredValue() {
    return this._widget._view.option('contouredDate');
  },
  getKeyboardListener: function getKeyboardListener() {
    return this._widget;
  },
  _getWidgetOptions: function _getWidgetOptions() {
    var disabledDates = this.dateBox.option('disabledDates');
    return (0, _extend.extend)(this.dateBox.option('calendarOptions'), {
      value: this.dateBoxValue() || null,
      dateSerializationFormat: null,
      min: this.dateBox.dateOption('min'),
      max: this.dateBox.dateOption('max'),
      onValueChanged: this._valueChangedHandler.bind(this),
      onCellClick: this._cellClickHandler.bind(this),
      tabIndex: null,
      disabledDates: (0, _type.isFunction)(disabledDates) ? this._injectComponent(disabledDates.bind(this.dateBox)) : disabledDates,
      onContouredChanged: this._refreshActiveDescendant.bind(this),
      skipFocusCheck: true
    });
  },
  _injectComponent: function _injectComponent(func) {
    var that = this;
    return function (params) {
      (0, _extend.extend)(params, {
        component: that.dateBox
      });
      return func(params);
    };
  },
  _refreshActiveDescendant: function _refreshActiveDescendant(e) {
    this._lastActionElement = 'calendar';
    this.dateBox.setAria('activedescendant', e.actionValue);
  },
  popupConfig: function popupConfig(_popupConfig) {
    var _this = this;

    var toolbarItems = _popupConfig.toolbarItems;
    var buttonsLocation = this.dateBox.option('buttonsLocation');
    var position = [];

    if (buttonsLocation !== 'default') {
      position = (0, _common.splitPair)(buttonsLocation);
    } else {
      position = ['bottom', 'center'];
    }

    if (this.dateBox.option('applyValueMode') === 'useButtons' && this._isCalendarVisible()) {
      toolbarItems.unshift({
        widget: 'dxButton',
        toolbar: position[0],
        location: position[1] === 'after' ? 'before' : position[1],
        options: {
          onInitialized: function (e) {
            e.component.registerKeyHandler('escape', this._escapeHandler.bind(this));
          }.bind(this),
          onClick: function onClick(args) {
            _this._widget._toTodayView(args);
          },
          text: _message.default.format('dxCalendar-todayButtonText'),
          type: 'today'
        }
      });
    }

    return (0, _extend.extend)(true, _popupConfig, {
      toolbarItems: toolbarItems,
      position: {
        collision: 'flipfit flip'
      },
      width: 'auto'
    });
  },
  _isCalendarVisible: function _isCalendarVisible() {
    return (0, _type.isEmptyObject)(this.dateBox.option('calendarOptions')) || this.dateBox.option('calendarOptions.visible') !== false;
  },
  _escapeHandler: function _escapeHandler() {
    this.dateBox.close();
    this.dateBox.focus();
  },
  _valueChangedHandler: function _valueChangedHandler(e) {
    var dateBox = this.dateBox;
    var value = e.value;
    var prevValue = e.previousValue;

    if (_date.default.sameDate(value, prevValue)) {
      return;
    }

    if (dateBox.option('applyValueMode') === 'instantly') {
      this.dateBoxValue(this.getValue(), e.event);
    }
  },
  _updateValue: function _updateValue() {
    if (!this._widget) {
      return;
    }

    this._widget.option('value', this.dateBoxValue());
  },
  textChangedHandler: function textChangedHandler() {
    this._lastActionElement = 'input';

    if (this.dateBox.option('opened') && this._widget) {
      this._updateValue(true);
    }
  },
  _cellClickHandler: function _cellClickHandler(e) {
    var dateBox = this.dateBox;

    if (dateBox.option('applyValueMode') === 'instantly') {
      dateBox.option('opened', false);
      this.dateBoxValue(this.getValue(), e.event);
    }
  }
});

var _default = CalendarStrategy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;