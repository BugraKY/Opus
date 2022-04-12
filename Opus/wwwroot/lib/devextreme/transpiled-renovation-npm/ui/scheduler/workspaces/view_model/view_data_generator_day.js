"use strict";

exports.ViewDataGeneratorDay = void 0;

var _day = require("../../../../renovation/ui/scheduler/view_model/to_test/views/utils/day");

var _view_data_generator = require("./view_data_generator");

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ViewDataGeneratorDay = /*#__PURE__*/function (_ViewDataGenerator) {
  _inheritsLoose(ViewDataGeneratorDay, _ViewDataGenerator);

  function ViewDataGeneratorDay() {
    return _ViewDataGenerator.apply(this, arguments) || this;
  }

  var _proto = ViewDataGeneratorDay.prototype;

  _proto._calculateStartViewDate = function _calculateStartViewDate(options) {
    return (0, _day.calculateStartViewDate)(options.currentDate, options.startDayHour, options.startDate, this._getIntervalDuration(options.intervalCount));
  };

  return ViewDataGeneratorDay;
}(_view_data_generator.ViewDataGenerator);

exports.ViewDataGeneratorDay = ViewDataGeneratorDay;