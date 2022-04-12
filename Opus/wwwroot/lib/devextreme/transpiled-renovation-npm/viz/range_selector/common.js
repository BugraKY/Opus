"use strict";

exports.utils = exports.formatValue = exports.consts = exports.HEIGHT_COMPACT_MODE = void 0;

var _smart_formatter = require("../axes/smart_formatter");

var _type = require("../../core/utils/type");

var HEIGHT_COMPACT_MODE = 24;
exports.HEIGHT_COMPACT_MODE = HEIGHT_COMPACT_MODE;
var POINTER_SIZE = 4;
var EMPTY_SLIDER_MARKER_TEXT = '. . .';
var utils = {
  trackerSettings: {
    fill: 'grey',
    stroke: 'grey',
    opacity: 0.0001
  },
  animationSettings: {
    duration: 250
  }
};
exports.utils = utils;
var consts = {
  emptySliderMarkerText: EMPTY_SLIDER_MARKER_TEXT,
  pointerSize: POINTER_SIZE
};
exports.consts = consts;

var formatValue = function formatValue(value, formatOptions, tickIntervalsInfo, valueType, type, logarithmBase) {
  var formatObject = {
    value: value,
    valueText: (0, _smart_formatter.smartFormatter)(value, {
      labelOptions: formatOptions,
      ticks: tickIntervalsInfo ? tickIntervalsInfo.ticks : [],
      tickInterval: tickIntervalsInfo ? tickIntervalsInfo.tickInterval : undefined,
      dataType: valueType,
      type: type,
      logarithmBase: logarithmBase
    })
  };
  return String((0, _type.isFunction)(formatOptions.customizeText) ? formatOptions.customizeText.call(formatObject, formatObject) : formatObject.valueText);
};

exports.formatValue = formatValue;