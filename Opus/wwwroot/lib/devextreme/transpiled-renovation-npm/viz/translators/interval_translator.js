"use strict";

exports.default = void 0;

var _type = require("../../core/utils/type");

var _date = _interopRequireDefault(require("../../core/utils/date"));

var _math = require("../../core/utils/math");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var floor = Math.floor;
var _default = {
  _intervalize: function _intervalize(value, interval) {
    if (!(0, _type.isDefined)(value)) {
      return undefined;
    }

    if (this._businessRange.dataType === 'datetime') {
      if ((0, _type.isNumeric)(value)) {
        value = new Date(value);
      } else {
        value = new Date(value.getTime());
      }

      value = _date.default.correctDateWithUnitBeginning(value, interval, null, this._options.firstDayOfWeek);
    } else {
      value = (0, _math.adjust)(floor((0, _math.adjust)(value / interval)) * interval, interval);
    }

    return value;
  },
  translate: function translate(bp, direction, interval) {
    var that = this;
    var specialValue = that.translateSpecialCase(bp);

    if ((0, _type.isDefined)(specialValue)) {
      return Math.round(specialValue);
    }

    interval = interval || that._options.interval; // TODO B253861

    if (!that.isValid(bp, interval)) {
      return null;
    }

    return that.to(bp, direction, interval);
  },
  getInterval: function getInterval() {
    return Math.round(this._canvasOptions.ratioOfCanvasRange * (this._businessRange.interval || Math.abs(this._canvasOptions.rangeMax - this._canvasOptions.rangeMin)));
  },
  zoom: function zoom() {},
  getMinScale: function getMinScale() {},
  getScale: function getScale() {},
  _parse: function _parse(value) {
    return this._businessRange.dataType === 'datetime' ? new Date(value) : Number(value);
  },
  fromValue: function fromValue(value) {
    return this._parse(value);
  },
  toValue: function toValue(value) {
    return this._parse(value);
  },
  isValid: function isValid(value, interval) {
    var that = this;
    var co = that._canvasOptions;
    var rangeMin = co.rangeMin;
    var rangeMax = co.rangeMax;
    interval = interval || that._options.interval;

    if (value === null || isNaN(value)) {
      return false;
    }

    value = that._businessRange.dataType === 'datetime' && (0, _type.isNumeric)(value) ? new Date(value) : value;

    if (interval !== that._options.interval) {
      rangeMin = that._intervalize(rangeMin, interval);
      rangeMax = that._intervalize(rangeMax, interval);
    }

    if (value.valueOf() < rangeMin || value.valueOf() >= _date.default.addInterval(rangeMax, interval)) {
      return false;
    }

    return true;
  },
  to: function to(bp, direction, interval) {
    var that = this;
    interval = interval || that._options.interval;

    var v1 = that._intervalize(bp, interval);

    var v2 = _date.default.addInterval(v1, interval);

    var res = that._to(v1);

    var p2 = that._to(v2);

    if (!direction) {
      res = floor((res + p2) / 2);
    } else if (direction > 0) {
      res = p2;
    }

    return res;
  },
  _to: function _to(value) {
    var co = this._canvasOptions;
    var rMin = co.rangeMinVisible;
    var rMax = co.rangeMaxVisible;
    var offset = value - rMin;

    if (value < rMin) {
      offset = 0;
    } else if (value > rMax) {
      offset = _date.default.addInterval(rMax, this._options.interval) - rMin;
    }

    return this._conversionValue(this._calculateProjection(offset * this._canvasOptions.ratioOfCanvasRange));
  },
  from: function from(position, direction) {
    var that = this;
    var origInterval = that._options.interval;
    var interval = origInterval;
    var co = that._canvasOptions;
    var rMin = co.rangeMinVisible;
    var rMax = co.rangeMaxVisible;
    var value;

    if (that._businessRange.dataType === 'datetime') {
      interval = _date.default.dateToMilliseconds(origInterval);
    }

    value = that._calculateUnProjection((position - that._canvasOptions.startPoint) / that._canvasOptions.ratioOfCanvasRange);
    value = that._intervalize(_date.default.addInterval(value, interval / 2, direction > 0), origInterval);

    if (value < rMin) {
      value = rMin;
    } else if (value > rMax) {
      value = rMax;
    }

    return value;
  },
  _add: function _add() {
    return NaN;
  },
  isValueProlonged: true
};
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;