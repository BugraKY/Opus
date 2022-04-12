"use strict";

exports.default = void 0;

var _window = require("../../core/utils/window");

var _type = require("../../core/utils/type");

var _dom = require("../../core/utils/dom");

var _iterator = require("../../core/utils/iterator");

var _version = require("../../core/utils/version");

var _extend = require("../../core/utils/extend");

var _support = require("../../core/utils/support");

var _devices = _interopRequireDefault(require("../../core/devices"));

var _config = _interopRequireDefault(require("../../core/config"));

var _date = _interopRequireDefault(require("../../core/utils/date"));

var _ui = _interopRequireDefault(require("./ui.date_utils"));

var _date_serialization = _interopRequireDefault(require("../../core/utils/date_serialization"));

var _ui2 = _interopRequireDefault(require("../drop_down_editor/ui.drop_down_editor"));

var _date2 = _interopRequireDefault(require("../../localization/date"));

var _message = _interopRequireDefault(require("../../localization/message"));

var _uiDate_boxStrategy = _interopRequireDefault(require("./ui.date_box.strategy.calendar"));

var _uiDate_boxStrategy2 = _interopRequireDefault(require("./ui.date_box.strategy.date_view"));

var _uiDate_boxStrategy3 = _interopRequireDefault(require("./ui.date_box.strategy.native"));

var _uiDate_boxStrategy4 = _interopRequireDefault(require("./ui.date_box.strategy.calendar_with_time"));

var _uiDate_boxStrategy5 = _interopRequireDefault(require("./ui.date_box.strategy.list"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var window = (0, _window.getWindow)();
var DATEBOX_CLASS = 'dx-datebox';
var DX_AUTO_WIDTH_CLASS = 'dx-auto-width';
var DX_INVALID_BADGE_CLASS = 'dx-show-invalid-badge';
var DX_CLEAR_BUTTON_CLASS = 'dx-clear-button-area';
var DATEBOX_WRAPPER_CLASS = 'dx-datebox-wrapper';
var DROPDOWNEDITOR_OVERLAY_CLASS = 'dx-dropdowneditor-overlay';
var PICKER_TYPE = {
  calendar: 'calendar',
  rollers: 'rollers',
  list: 'list',
  native: 'native'
};
var TYPE = {
  date: 'date',
  datetime: 'datetime',
  time: 'time'
};
var STRATEGY_NAME = {
  calendar: 'Calendar',
  dateView: 'DateView',
  native: 'Native',
  calendarWithTime: 'CalendarWithTime',
  list: 'List'
};
var STRATEGY_CLASSES = {
  Calendar: _uiDate_boxStrategy.default,
  DateView: _uiDate_boxStrategy2.default,
  Native: _uiDate_boxStrategy3.default,
  CalendarWithTime: _uiDate_boxStrategy4.default,
  List: _uiDate_boxStrategy5.default
};

var DateBox = _ui2.default.inherit({
  _supportedKeys: function _supportedKeys() {
    return (0, _extend.extend)(this.callBase(), this._strategy.supportedKeys());
  },
  _renderButtonContainers: function _renderButtonContainers() {
    this.callBase.apply(this, arguments);

    this._strategy.customizeButtons();
  },
  _getDefaultOptions: function _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      type: 'date',
      showAnalogClock: true,
      value: null,
      dateSerializationFormat: undefined,
      min: undefined,
      max: undefined,
      displayFormat: null,
      interval: 30,
      disabledDates: null,
      pickerType: PICKER_TYPE['calendar'],
      invalidDateMessage: _message.default.format('dxDateBox-validation-datetime'),
      dateOutOfRangeMessage: _message.default.format('validation-range'),
      applyButtonText: _message.default.format('OK'),
      adaptivityEnabled: false,
      calendarOptions: {},
      useHiddenSubmitElement: true
    });
  },
  _defaultOptionsRules: function _defaultOptionsRules() {
    return this.callBase().concat([{
      device: {
        platform: 'ios'
      },
      options: {
        'dropDownOptions.showTitle': true
      }
    }, {
      device: {
        platform: 'android'
      },
      options: {
        buttonsLocation: 'bottom after'
      }
    }, {
      device: function device() {
        var realDevice = _devices.default.real();

        var platform = realDevice.platform;
        return platform === 'ios' || platform === 'android';
      },
      options: {
        pickerType: PICKER_TYPE.native
      }
    }, {
      device: function device(currentDevice) {
        var realDevice = _devices.default.real();

        var platform = realDevice.platform;
        var version = realDevice.version;
        return platform === 'generic' && currentDevice.deviceType !== 'desktop' || platform === 'android' && (0, _version.compare)(version, [4, 4]) < 0;
      },
      options: {
        pickerType: PICKER_TYPE.rollers
      }
    }, {
      device: {
        platform: 'generic',
        deviceType: 'desktop'
      },
      options: {
        buttonsLocation: 'bottom after'
      }
    }]);
  },
  _initOptions: function _initOptions(options) {
    this._userOptions = (0, _extend.extend)({}, options);
    this.callBase(options);

    this._updatePickerOptions();
  },
  _updatePickerOptions: function _updatePickerOptions() {
    var pickerType = this.option('pickerType');
    var type = this.option('type');

    if (pickerType === PICKER_TYPE.list && (type === TYPE.datetime || type === TYPE.date)) {
      pickerType = PICKER_TYPE.calendar;
    }

    if (type === TYPE.time && pickerType === PICKER_TYPE.calendar) {
      pickerType = PICKER_TYPE.list;
    }

    this.option('showDropDownButton', _devices.default.real().platform !== 'generic' || pickerType !== PICKER_TYPE['native']);
    this._pickerType = pickerType;
  },
  _init: function _init() {
    this._initStrategy();

    this.option((0, _extend.extend)({}, this._strategy.getDefaultOptions(), this._userOptions));
    delete this._userOptions;
    this.callBase();
  },
  _toLowerCaseFirstLetter: function _toLowerCaseFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.substr(1);
  },
  _initStrategy: function _initStrategy() {
    var strategyName = this._getStrategyName(this._getFormatType());

    var strategy = STRATEGY_CLASSES[strategyName];

    if (!(this._strategy && this._strategy.NAME === strategyName)) {
      this._strategy = new strategy(this);
    }
  },
  _getFormatType: function _getFormatType() {
    var currentType = this.option('type');
    var isTime = /h|m|s/g.test(currentType);
    var isDate = /d|M|Y/g.test(currentType);
    var type = '';

    if (isDate) {
      type += TYPE.date;
    }

    if (isTime) {
      type += TYPE.time;
    }

    return type;
  },
  _getStrategyName: function _getStrategyName(type) {
    var pickerType = this._pickerType;

    if (pickerType === PICKER_TYPE.rollers) {
      return STRATEGY_NAME.dateView;
    } else if (pickerType === PICKER_TYPE.native) {
      return STRATEGY_NAME['native'];
    }

    if (type === TYPE.date) {
      return STRATEGY_NAME.calendar;
    }

    if (type === TYPE.datetime) {
      return STRATEGY_NAME.calendarWithTime;
    }

    return STRATEGY_NAME.list;
  },
  _initMarkup: function _initMarkup() {
    this.$element().addClass(DATEBOX_CLASS);
    this.callBase();

    this._refreshFormatClass();

    this._refreshPickerTypeClass();

    this._strategy.renderInputMinMax(this._input());
  },
  _render: function _render() {
    this.callBase();

    this._formatValidationIcon();
  },
  _renderDimensions: function _renderDimensions() {
    this.callBase();
    this.$element().toggleClass(DX_AUTO_WIDTH_CLASS, !this.option('width'));

    this._dimensionChanged();
  },
  _dimensionChanged: function _dimensionChanged() {
    this.callBase(arguments);

    if (this._popup) {
      var _this$_strategy$_upda, _this$_strategy;

      (_this$_strategy$_upda = (_this$_strategy = this._strategy)._updatePopupHeight) === null || _this$_strategy$_upda === void 0 ? void 0 : _this$_strategy$_upda.call(_this$_strategy);
    }
  },
  _refreshFormatClass: function _refreshFormatClass() {
    var $element = this.$element();
    (0, _iterator.each)(TYPE, function (_, item) {
      $element.removeClass(DATEBOX_CLASS + '-' + item);
    });
    $element.addClass(DATEBOX_CLASS + '-' + this.option('type'));
  },
  _refreshPickerTypeClass: function _refreshPickerTypeClass() {
    var $element = this.$element();
    (0, _iterator.each)(PICKER_TYPE, function (_, item) {
      $element.removeClass(DATEBOX_CLASS + '-' + item);
    });
    $element.addClass(DATEBOX_CLASS + '-' + this._pickerType);
  },
  _formatValidationIcon: function _formatValidationIcon() {
    if (!(0, _window.hasWindow)()) {
      return;
    }

    var inputElement = this._input().get(0);

    var isRtlEnabled = this.option('rtlEnabled');

    var clearButtonWidth = this._getClearButtonWidth();

    var longestElementDimensions = this._getLongestElementDimensions();

    var curWidth = parseFloat(window.getComputedStyle(inputElement).width) - clearButtonWidth;
    var shouldHideValidationIcon = longestElementDimensions.width > curWidth;
    var style = inputElement.style;
    this.$element().toggleClass(DX_INVALID_BADGE_CLASS, !shouldHideValidationIcon);

    if (shouldHideValidationIcon) {
      if (this._storedPadding === undefined) {
        this._storedPadding = isRtlEnabled ? longestElementDimensions.leftPadding : longestElementDimensions.rightPadding;
      }

      isRtlEnabled ? style.paddingLeft = 0 : style.paddingRight = 0;
    } else {
      isRtlEnabled ? style.paddingLeft = this._storedPadding + 'px' : style.paddingRight = this._storedPadding + 'px';
    }
  },
  _getClearButtonWidth: function _getClearButtonWidth() {
    var clearButtonWidth = 0;

    if (this._isClearButtonVisible() && this._input().val() === '') {
      var clearButtonElement = this.$element().find('.' + DX_CLEAR_BUTTON_CLASS).get(0);
      clearButtonWidth = parseFloat(window.getComputedStyle(clearButtonElement).width);
    }

    return clearButtonWidth;
  },
  _getLongestElementDimensions: function _getLongestElementDimensions() {
    var format = this._strategy.getDisplayFormat(this.option('displayFormat'));

    var longestValue = _date2.default.format(_ui.default.getLongestDate(format, _date2.default.getMonthNames(), _date2.default.getDayNames()), format);

    var $input = this._input();

    var inputElement = $input.get(0);
    var $longestValueElement = (0, _dom.createTextElementHiddenCopy)($input, longestValue);
    var isPaddingStored = this._storedPadding !== undefined;
    var storedPadding = !isPaddingStored ? 0 : this._storedPadding;
    $longestValueElement.appendTo(this.$element());
    var elementWidth = parseFloat(window.getComputedStyle($longestValueElement.get(0)).width);
    var rightPadding = parseFloat(window.getComputedStyle(inputElement).paddingRight);
    var leftPadding = parseFloat(window.getComputedStyle(inputElement).paddingLeft);
    var necessaryWidth = elementWidth + leftPadding + rightPadding + storedPadding;
    $longestValueElement.remove();
    return {
      width: necessaryWidth,
      leftPadding: leftPadding,
      rightPadding: rightPadding
    };
  },
  _getKeyboardListeners: function _getKeyboardListeners() {
    return this.callBase().concat([this._strategy && this._strategy.getKeyboardListener()]);
  },
  _renderPopup: function _renderPopup() {
    this.callBase();

    this._popup.$wrapper().addClass(DATEBOX_WRAPPER_CLASS);

    this._renderPopupWrapper();
  },
  _popupConfig: function _popupConfig() {
    var popupConfig = this.callBase();
    return (0, _extend.extend)(this._strategy.popupConfig(popupConfig), {
      title: this._getPopupTitle(),
      dragEnabled: false
    });
  },
  _renderPopupWrapper: function _renderPopupWrapper() {
    if (!this._popup) {
      return;
    }

    var $element = this.$element();
    var classPostfixes = (0, _extend.extend)({}, TYPE, PICKER_TYPE);
    (0, _iterator.each)(classPostfixes, function (_, item) {
      $element.removeClass(DATEBOX_WRAPPER_CLASS + '-' + item);
    }.bind(this));

    this._popup.$wrapper().addClass(DATEBOX_WRAPPER_CLASS + '-' + this.option('type')).addClass(DATEBOX_WRAPPER_CLASS + '-' + this._pickerType).addClass(DROPDOWNEDITOR_OVERLAY_CLASS);
  },
  _renderPopupContent: function _renderPopupContent() {
    this.callBase();

    this._strategy.renderPopupContent();
  },
  _getFirstPopupElement: function _getFirstPopupElement() {
    return this._strategy.getFirstPopupElement() || this.callBase();
  },
  _getLastPopupElement: function _getLastPopupElement() {
    return this._strategy.getLastPopupElement() || this.callBase();
  },
  _popupShowingHandler: function _popupShowingHandler() {
    this.callBase();

    this._strategy.popupShowingHandler();
  },
  _popupShownHandler: function _popupShownHandler() {
    this.callBase();

    this._strategy.renderOpenedState();
  },
  _popupHiddenHandler: function _popupHiddenHandler() {
    this.callBase();

    this._strategy.renderOpenedState();

    this._strategy.popupHiddenHandler();
  },
  _visibilityChanged: function _visibilityChanged(visible) {
    if (visible) {
      this._formatValidationIcon();
    }
  },
  _clearValueHandler: function _clearValueHandler(e) {
    this.option('text', '');
    this.callBase(e);
  },
  _readOnlyPropValue: function _readOnlyPropValue() {
    if (this._pickerType === PICKER_TYPE.rollers) {
      return true;
    }

    var platform = _devices.default.real().platform;

    var isCustomValueDisabled = this._isNativeType() && (platform === 'ios' || platform === 'android');

    if (isCustomValueDisabled) {
      return this.option('readOnly');
    }

    return this.callBase();
  },
  _isClearButtonVisible: function _isClearButtonVisible() {
    return this.callBase() && !this._isNativeType();
  },
  _renderValue: function _renderValue() {
    var value = this.dateOption('value');
    this.option('text', this._getDisplayedText(value));

    this._strategy.renderValue();

    return this.callBase();
  },
  _setSubmitValue: function _setSubmitValue() {
    var value = this.dateOption('value');
    var dateSerializationFormat = this.option('dateSerializationFormat');

    var submitFormat = _ui.default.SUBMIT_FORMATS_MAP[this.option('type')];

    var submitValue = dateSerializationFormat ? _date_serialization.default.serializeDate(value, dateSerializationFormat) : _ui.default.toStandardDateFormat(value, submitFormat);

    this._getSubmitElement().val(submitValue);
  },
  _getDisplayedText: function _getDisplayedText(value) {
    var mode = this.option('mode');
    var displayedText;

    if (mode === 'text') {
      var displayFormat = this._strategy.getDisplayFormat(this.option('displayFormat'));

      displayedText = _date2.default.format(value, displayFormat);
    } else {
      var format = this._getFormatByMode(mode);

      if (format) {
        displayedText = _date2.default.format(value, format);
      } else {
        displayedText = _ui.default.toStandardDateFormat(value, mode);
      }
    }

    return displayedText;
  },
  _getFormatByMode: function _getFormatByMode(mode) {
    return (0, _support.inputType)(mode) ? null : _ui.default.FORMATS_MAP[mode];
  },
  _valueChangeEventHandler: function _valueChangeEventHandler(e) {
    var _this$option = this.option(),
        text = _this$option.text,
        type = _this$option.type,
        validationError = _this$option.validationError;

    var currentValue = this.dateOption('value');

    if (text === this._getDisplayedText(currentValue)) {
      if (!validationError || validationError.editorSpecific) {
        this._applyInternalValidation(currentValue);

        this._applyCustomValidation(currentValue);
      }

      return;
    }

    var parsedDate = this._getParsedDate(text);

    var value = currentValue !== null && currentValue !== void 0 ? currentValue : this._getDateByDefault();

    var newValue = _ui.default.mergeDates(value, parsedDate, type);

    var date = parsedDate && type === 'time' ? newValue : parsedDate;

    if (this._applyInternalValidation(date).isValid) {
      var displayedText = this._getDisplayedText(newValue);

      if (value && newValue && value.getTime() === newValue.getTime() && displayedText !== text) {
        this._renderValue();
      } else {
        this.dateValue(newValue, e);
      }
    }
  },
  _getDateByDefault: function _getDateByDefault() {
    return this._strategy.useCurrentDateByDefault() && this._strategy.getDefaultDate();
  },
  _getParsedDate: function _getParsedDate(text) {
    var displayFormat = this._strategy.getDisplayFormat(this.option('displayFormat'));

    var parsedText = this._strategy.getParsedText(text, displayFormat);

    return parsedText !== null && parsedText !== void 0 ? parsedText : undefined;
  },
  _applyInternalValidation: function _applyInternalValidation(value) {
    var text = this.option('text');
    var hasText = !!text && value !== null;
    var isDate = !!value && (0, _type.isDate)(value) && !isNaN(value.getTime());

    var isDateInRange = isDate && _date.default.dateInRange(value, this.dateOption('min'), this.dateOption('max'), this.option('type'));

    var isValid = !hasText && !value || isDateInRange;
    var validationMessage = '';

    if (!isDate) {
      validationMessage = this.option('invalidDateMessage');
    } else if (!isDateInRange) {
      validationMessage = this.option('dateOutOfRangeMessage');
    }

    this.option({
      isValid: isValid,
      validationError: isValid ? null : {
        editorSpecific: true,
        message: validationMessage
      }
    });
    return {
      isValid: isValid,
      isDate: isDate
    };
  },
  _applyCustomValidation: function _applyCustomValidation(value) {
    this.validationRequest.fire({
      editor: this,
      value: this._serializeDate(value)
    });
  },
  _isValueChanged: function _isValueChanged(newValue) {
    var oldValue = this.dateOption('value');
    var oldTime = oldValue && oldValue.getTime();
    var newTime = newValue && newValue.getTime();
    return oldTime !== newTime;
  },
  _isTextChanged: function _isTextChanged(newValue) {
    var oldText = this.option('text');
    var newText = newValue && this._getDisplayedText(newValue) || '';
    return oldText !== newText;
  },
  _renderProps: function _renderProps() {
    this.callBase();

    this._input().attr('autocomplete', 'off');
  },
  _renderOpenedState: function _renderOpenedState() {
    if (!this._isNativeType()) {
      this.callBase();
    }

    if (this._strategy.isAdaptivityChanged()) {
      this._refreshStrategy();
    }
  },
  _getPopupTitle: function _getPopupTitle() {
    var placeholder = this.option('placeholder');

    if (placeholder) {
      return placeholder;
    }

    var type = this.option('type');

    if (type === TYPE.time) {
      return _message.default.format('dxDateBox-simulatedDataPickerTitleTime');
    }

    if (type === TYPE.date || type === TYPE.datetime) {
      return _message.default.format('dxDateBox-simulatedDataPickerTitleDate');
    }

    return '';
  },
  _refreshStrategy: function _refreshStrategy() {
    this._strategy.dispose();

    this._initStrategy();

    this.option(this._strategy.getDefaultOptions());

    this._refresh();
  },
  _applyButtonHandler: function _applyButtonHandler(e) {
    var value = this._strategy.getValue();

    var _this$_applyInternalV = this._applyInternalValidation(value),
        isValid = _this$_applyInternalV.isValid,
        isDate = _this$_applyInternalV.isDate;

    if (isValid) {
      this.dateValue(value, e.event);
    } else if (isDate) {
      var displayedText = this._getDisplayedText(value);

      this.option('text', displayedText);

      this._renderDisplayText(displayedText);
    }

    this.callBase();
  },
  _dispose: function _dispose() {
    var _this$_strategy2;

    this.callBase();
    (_this$_strategy2 = this._strategy) === null || _this$_strategy2 === void 0 ? void 0 : _this$_strategy2.dispose();
  },
  _isNativeType: function _isNativeType() {
    return this._pickerType === PICKER_TYPE['native'];
  },
  _updatePopupTitle: function _updatePopupTitle() {
    var _this$_popup;

    (_this$_popup = this._popup) === null || _this$_popup === void 0 ? void 0 : _this$_popup.option('title', this._getPopupTitle());
  },
  _optionChanged: function _optionChanged(args) {
    switch (args.name) {
      case 'showClearButton':
      case 'buttons':
        this.callBase.apply(this, arguments);

        this._formatValidationIcon();

        break;

      case 'pickerType':
        this._updatePickerOptions({
          pickerType: args.value
        });

        this._refreshStrategy();

        this._refreshPickerTypeClass();

        this._invalidate();

        break;

      case 'type':
        this._updatePickerOptions({
          format: args.value
        });

        this._refreshStrategy();

        this._refreshFormatClass();

        this._renderPopupWrapper();

        this._formatValidationIcon();

        this._updateValue();

        break;

      case 'placeholder':
        this.callBase.apply(this, arguments);

        this._updatePopupTitle();

        break;

      case 'min':
      case 'max':
        {
          var isValid = this.option('isValid');

          this._applyInternalValidation(this.dateOption('value'));

          if (!isValid) {
            this._applyCustomValidation(this.dateOption('value'));
          }

          this._invalidate();

          break;
        }

      case 'dateSerializationFormat':
      case 'interval':
      case 'disabledDates':
      case 'calendarOptions':
        this._invalidate();

        break;

      case 'displayFormat':
        this.option('text', this._getDisplayedText(this.dateOption('value')));

        this._renderInputValue();

        break;

      case 'text':
        this._strategy.textChangedHandler(args.value);

        this.callBase.apply(this, arguments);
        break;

      case 'isValid':
        this.callBase.apply(this, arguments);

        this._formatValidationIcon();

        break;

      case 'showDropDownButton':
        this._formatValidationIcon();

        this.callBase.apply(this, arguments);
        break;

      case 'readOnly':
        this.callBase.apply(this, arguments);

        this._formatValidationIcon();

        break;

      case 'invalidDateMessage':
      case 'dateOutOfRangeMessage':
      case 'adaptivityEnabled':
      case 'showAnalogClock':
        break;

      default:
        this.callBase.apply(this, arguments);
    }
  },
  _getSerializationFormat: function _getSerializationFormat() {
    var value = this.option('value');

    if (this.option('dateSerializationFormat') && (0, _config.default)().forceIsoDateParsing) {
      return this.option('dateSerializationFormat');
    }

    if ((0, _type.isNumeric)(value)) {
      return 'number';
    }

    if (!(0, _type.isString)(value)) {
      return;
    }

    return _date_serialization.default.getDateSerializationFormat(value);
  },
  _updateValue: function _updateValue(value) {
    this.callBase();

    this._applyInternalValidation(value !== null && value !== void 0 ? value : this.dateOption('value'));
  },
  dateValue: function dateValue(value, dxEvent) {
    var isValueChanged = this._isValueChanged(value);

    if (isValueChanged && dxEvent) {
      this._saveValueChangeEvent(dxEvent);
    }

    if (!isValueChanged) {
      if (this._isTextChanged(value)) {
        this._updateValue(value);
      } else if (this.option('text') === '') {
        this._applyCustomValidation(value);
      }
    }

    return this.dateOption('value', value);
  },
  dateOption: function dateOption(optionName, value) {
    if (arguments.length === 1) {
      return _date_serialization.default.deserializeDate(this.option(optionName));
    }

    this.option(optionName, this._serializeDate(value));
  },
  _serializeDate: function _serializeDate(date) {
    var serializationFormat = this._getSerializationFormat();

    return _date_serialization.default.serializeDate(date, serializationFormat);
  },
  _clearValue: function _clearValue() {
    var value = this.option('value');
    this.callBase();

    if (value === null) {
      this._applyCustomValidation(null);
    }
  },
  reset: function reset() {
    var value = this.option('value');
    this.callBase();

    if (value === null) {
      this._applyInternalValidation(null);
    }
  }
});

var _default = DateBox;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;