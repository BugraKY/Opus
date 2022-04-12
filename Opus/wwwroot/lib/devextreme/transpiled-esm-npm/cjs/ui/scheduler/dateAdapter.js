"use strict";

exports.default = void 0;

var _date = _interopRequireDefault(require("../../core/utils/date"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var toMs = _date.default.dateToMilliseconds;

var DateAdapterCore = /*#__PURE__*/function () {
  function DateAdapterCore(source) {
    this._source = new Date(source.getTime ? source.getTime() : source);
  }

  var _proto = DateAdapterCore.prototype;

  _proto.result = function result() {
    return this._source;
  };

  _proto.getTimezoneOffset = function getTimezoneOffset() {
    var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

    var value = this._source.getTimezoneOffset();

    if (format === 'minute') {
      return value * toMs('minute');
    }

    return value;
  };

  _proto.getTime = function getTime() {
    return this._source.getTime();
  };

  _proto.setTime = function setTime(value) {
    this._source.setTime(value);

    return this;
  };

  _proto.addTime = function addTime(value) {
    this._source.setTime(this._source.getTime() + value);

    return this;
  };

  _proto.setMinutes = function setMinutes(value) {
    this._source.setMinutes(value);

    return this;
  };

  _proto.addMinutes = function addMinutes(value) {
    this._source.setMinutes(this._source.getMinutes() + value);

    return this;
  };

  _proto.subtractMinutes = function subtractMinutes(value) {
    this._source.setMinutes(this._source.getMinutes() - value);

    return this;
  };

  _createClass(DateAdapterCore, [{
    key: "source",
    get: function get() {
      // TODO
      return this._source;
    }
  }]);

  return DateAdapterCore;
}();

var DateAdapter = function DateAdapter(date) {
  return new DateAdapterCore(date);
};

var _default = DateAdapter;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;