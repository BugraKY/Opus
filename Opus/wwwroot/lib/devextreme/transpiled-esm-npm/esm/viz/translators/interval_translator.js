import { isNumeric as isNumber, isDefined } from '../../core/utils/type';
import dateUtils from '../../core/utils/date';
var floor = Math.floor;
import { adjust } from '../../core/utils/math';
export default {
  _intervalize: function _intervalize(value, interval) {
    if (!isDefined(value)) {
      return undefined;
    }

    if (this._businessRange.dataType === 'datetime') {
      if (isNumber(value)) {
        value = new Date(value);
      } else {
        value = new Date(value.getTime());
      }

      value = dateUtils.correctDateWithUnitBeginning(value, interval, null, this._options.firstDayOfWeek);
    } else {
      value = adjust(floor(adjust(value / interval)) * interval, interval);
    }

    return value;
  },
  translate: function translate(bp, direction, interval) {
    var that = this;
    var specialValue = that.translateSpecialCase(bp);

    if (isDefined(specialValue)) {
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

    value = that._businessRange.dataType === 'datetime' && isNumber(value) ? new Date(value) : value;

    if (interval !== that._options.interval) {
      rangeMin = that._intervalize(rangeMin, interval);
      rangeMax = that._intervalize(rangeMax, interval);
    }

    if (value.valueOf() < rangeMin || value.valueOf() >= dateUtils.addInterval(rangeMax, interval)) {
      return false;
    }

    return true;
  },
  to: function to(bp, direction, interval) {
    var that = this;
    interval = interval || that._options.interval;

    var v1 = that._intervalize(bp, interval);

    var v2 = dateUtils.addInterval(v1, interval);

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
      offset = dateUtils.addInterval(rMax, this._options.interval) - rMin;
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
      interval = dateUtils.dateToMilliseconds(origInterval);
    }

    value = that._calculateUnProjection((position - that._canvasOptions.startPoint) / that._canvasOptions.ratioOfCanvasRange);
    value = that._intervalize(dateUtils.addInterval(value, interval / 2, direction > 0), origInterval);

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