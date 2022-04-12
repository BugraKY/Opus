import { smartFormatter as _format } from '../axes/smart_formatter';
import { isFunction } from '../../core/utils/type';
export var HEIGHT_COMPACT_MODE = 24;
var POINTER_SIZE = 4;
var EMPTY_SLIDER_MARKER_TEXT = '. . .';
export var utils = {
  trackerSettings: {
    fill: 'grey',
    stroke: 'grey',
    opacity: 0.0001
  },
  animationSettings: {
    duration: 250
  }
};
export var consts = {
  emptySliderMarkerText: EMPTY_SLIDER_MARKER_TEXT,
  pointerSize: POINTER_SIZE
};
export var formatValue = function formatValue(value, formatOptions, tickIntervalsInfo, valueType, type, logarithmBase) {
  var formatObject = {
    value: value,
    valueText: _format(value, {
      labelOptions: formatOptions,
      ticks: tickIntervalsInfo ? tickIntervalsInfo.ticks : [],
      tickInterval: tickIntervalsInfo ? tickIntervalsInfo.tickInterval : undefined,
      dataType: valueType,
      type: type,
      logarithmBase: logarithmBase
    })
  };
  return String(isFunction(formatOptions.customizeText) ? formatOptions.customizeText.call(formatObject, formatObject) : formatObject.valueText);
};