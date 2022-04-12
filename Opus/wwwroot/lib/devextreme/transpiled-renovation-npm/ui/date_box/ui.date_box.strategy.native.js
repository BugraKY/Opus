"use strict";

exports.default = void 0;

var _common = require("../../core/utils/common");

var _uiDate_box = _interopRequireDefault(require("./ui.date_box.strategy"));

var _support = require("../../core/utils/support");

var _array = require("../../core/utils/array");

var _ui = _interopRequireDefault(require("./ui.date_utils"));

var _date_serialization = _interopRequireDefault(require("../../core/utils/date_serialization"));

var _extend = require("../../core/utils/extend");

var _devices = _interopRequireDefault(require("../../core/devices"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NativeStrategy = _uiDate_box.default.inherit({
  NAME: 'Native',
  popupConfig: function popupConfig(_popupConfig) {
    return (0, _extend.extend)({}, _popupConfig, {
      width: 'auto'
    });
  },
  getParsedText: function getParsedText(text) {
    if (!text) {
      return null;
    } // NOTE: Required for correct date parsing when native picker is used (T418155)


    if (this.dateBox.option('type') === 'datetime') {
      return new Date(text.replace(/-/g, '/').replace('T', ' ').split('.')[0]);
    }

    return _ui.default.fromStandardDateFormat(text);
  },
  renderPopupContent: _common.noop,
  _getWidgetName: _common.noop,
  _getWidgetOptions: _common.noop,
  _getDateBoxType: function _getDateBoxType() {
    var type = this.dateBox.option('type');

    if ((0, _array.inArray)(type, _ui.default.SUPPORTED_FORMATS) === -1) {
      type = 'date';
    } else if (type === 'datetime' && !(0, _support.inputType)(type)) {
      type = 'datetime-local';
    }

    return type;
  },
  customizeButtons: function customizeButtons() {
    var dropDownButton = this.dateBox.getButton('dropDown');

    if (_devices.default.real().android && dropDownButton) {
      dropDownButton.on('click', function () {
        this.dateBox._input().get(0).click();
      }.bind(this));
    }
  },
  getDefaultOptions: function getDefaultOptions() {
    return {
      mode: this._getDateBoxType()
    };
  },
  getDisplayFormat: function getDisplayFormat(displayFormat) {
    var type = this._getDateBoxType();

    return displayFormat || _ui.default.FORMATS_MAP[type];
  },
  renderInputMinMax: function renderInputMinMax($input) {
    $input.attr({
      min: _date_serialization.default.serializeDate(this.dateBox.dateOption('min'), 'yyyy-MM-dd'),
      max: _date_serialization.default.serializeDate(this.dateBox.dateOption('max'), 'yyyy-MM-dd')
    });
  }
});

var _default = NativeStrategy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;